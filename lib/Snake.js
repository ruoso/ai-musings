module.exports = function(brain_r, brain_c, Neuron, Output, config) {
    var m = null;
    var ts = [];
    
    // each input, output and relay is used in sequence from the
    // config. The config is a string of hex-encoded numbers.
    function bits_from_config(offset) {
	if (config.length <= offset*4) { // 4 bits per char
	    //console.log("config for "+offset+" is 0");
	    return 0;
	} else {
	    var s = config.substring(offset*4, (offset*4)+1);
	    var v = parseInt(s,16);
	    //console.log("config for "+offset+" is "+v);
	    return v;
	}
    }

    // all the different status of the body
    var hunger = 0;
    var direction = "N"; // start heading north;
    var smell_ahead = null;
    var smell_right = null;
    var smell_left = null;
    var distance_to_wall_ahead = 0;
    var is_there_wall_right = 0;
    var is_there_wall_left = 0;
    var is_moving = 0;

    // read-only accessors...
    this.is_moving = function() {
	return is_moving;
    };

    this.pointing_to = function() {
	return direction;
    };
    
    // let's make a row of j outputs
    var outputs = [];
    for (var jj = 0; jj < brain_c; jj++) {
	outputs.push(new Output(jj));
    };
    
    // size of the brain
    var brain = [];

    // let's make rows of neurons in a chain
    var current_output = outputs;
    var a = 3;
    for (var ii = 1; ii < brain_r; ii++) {
	// let's make each row with neurons, and connect each neuron in a
	// row with every neuron in the next row.
	var new_output = [];
	for (var jj = 0; jj < brain_c; jj++) {
	    var part_of_output = [];
	    for (var jjj = (jj-a<0?0:jj-a);
		 ((jjj <= (jj+a)) && (jjj < brain_c));
		 jjj++) {
		part_of_output.push(current_output[jjj]);
	    }
	    new_output.push(new Neuron(ii, jj, part_of_output));
	}
	current_output = new_output;
	brain.push(new_output);
    }

    var max_index = 0;
    // insert inputs into the existing neurons of the brain
    function input() {
	var index = max_index++;
	var ii = bits_from_config(index*2)*2;
	var jj = bits_from_config((index*2)+1)*2;
	//console.log("generating input "+index+" for "+ii+","+jj);
	var part_of_output = [];
	for (var jjj = (jj-a<0?0:jj-a);
	     ((jjj <= (jj+a)) && (jjj < brain_c));
	     jjj++) {
	    //console.log("output is "+ii+","+jjj);
	    part_of_output.push(brain[ii][jjj]);
	}
	return new Neuron(ii,jj,part_of_output);
    }
    
    // connect outputs for processing results
    function out(f) {
	var index = max_index++;
	var ii = bits_from_config(index*2)*2;
	var jj = bits_from_config((index*2)+1)*2;
	brain[ii][jj].hijack(f);
    }

    function wrap() {
	var index1 = max_index++;
	var index2 = max_index++;
	var ii1 = bits_from_config(index1*2)*2;
	var jj1 = bits_from_config((index1*2)+1)*2;
	var ii2 = bits_from_config(index2*2)*2;
	var jj2 = bits_from_config((index2*2)+1)*2;
	brain[ii1][jj1].hijack(function() {
	    brain[ii2][jj2].message()
	});
    }
    
    for (var oi = 0; oi < brain_c; oi++) {
	wrap();
    }
    
    // Now we need to craete the neural inputs
    var e = brain_r - 2;
    var c = Math.floor(brain_c / 2);
    //console.log("center is "+c);
    var inputs = {
	direction: {
	    N: input(),
	    E: input(),
	    S: input(),
	    W: input(),
	},
	smell: {
	    ahead: [ input(), input(), input() ],
	    left: input(),
	    right: input(),
	},
	digestion: {
	    hunger: [ input(), input(),
		      input(), input() ],
	    food_in_mouth: input(),
	},
	sight: {
	    ahead: [ input(), input() ],
	    left: input(),
	    right: input(),
	},
	movement: {
	    is_moving: input(),
	    turn_left: input(),
	    turn_right: input(),
	},
	time: [ input(), input(),
		input(), input() ],
    };

    var t = this; // close over
    
    // now we need to create the neural outputs
    out(function() {
	t.turn_left();
    });

    out(function() {
	t.turn_left();
    });

    out(function() {
	t.turn_right();
    });

    out(function() {
	t.turn_right();
    });

    out(function() {
	t.start_moving();
    });
	
    out(function() {
	t.start_moving();
    });
	
    out(function() {
	t.start_moving();
    });

    out(function() {
	t.turn_right();
    });

    out(function() {
	t.turn_left();
    });

    out(function() {
	t.stop_moving();
    });

    out(function() {
	t.stop_moving();
    });

    // actions:

    this.turn_left = function() {
	var left_of = {
	    N: "W",
	    E: "N",
	    S: "E",
	    W: "S"
	};
	direction = left_of[direction];
	inputs["movement"]["turn_left"].message();
    };
    
    this.turn_right = function() {
	var right_of = {
	    N: "E",
	    E: "S",
	    S: "W",
	    W: "N"
	};
	direction = right_of[direction];
	inputs["movement"]["turn_right"].message();
    };
    
    this.start_moving = function() {
	is_moving = 1;
	inputs["movement"]["is_moving"].message();
    };

    this.stop_moving = function() {
	is_moving = 0;
	inputs["movement"]["is_moving"].message();
    };

    // state fed from the external environment:

    this.direction_head_is_pointing = function(d) {
	direction = d;
    };
    
    this.distance_of_head_from_obstacles = function(d_a, d_r, d_l) {
	distance_to_wall_ahead = d_a;
	is_there_wall_right = d_r;
	is_there_wall_left = d_l;
    };
    
    this.distance_of_head_from_food = function(d_a, d_r, d_l) {
	smell_ahead = d_a;
	smell_left = d_l;
	smell_right = d_r;
    };

    this.food_in_mouth = function() {
	inputs["digestion"]["food_in_mouth"].message();
    };

    // body inputs to the brain
    ts.push(setInterval(function() {
	inputs.direction[direction].message();
    }, 100));

    var smell_message = function() {
	var ahead = inputs.smell["ahead"];
	ahead[0].message();
	ahead[1].message();
	ahead[2].message();
    };
    ts.push(setInterval(function() {
	if (smell_ahead != null) {
	    smell_message();
	    if (smell_ahead < 10) {
		setTimeout(function() { smell_message() }, 20);
		if (smell_ahead < 3) {
		    setTimeout(function() { smell_message() }, 50);
		}
	    }
	}
	if (smell_left) {
	    inputs.smell["left"].message();
	}
	if (smell_right) {
	    inputs.smell["right"].message();
	}
    }, 100));

    var hunger_message = function() {
	hunger[0].message();
	hunger[1].message();
	hunger[2].message();
	hunger[3].message();
    };
    ts.push(setInterval(function() {
	var hunger_v = inputs.smell["hunger"];
	if (hunger_v > 5) {
	    hunger_message();
	    if (hunger_v > 50) {
		setTimeout(function() { hunger_message() }, 20);
		if (hunger_v > 250) {
		    setTimeout(function() { hunger_message() }, 60);
		    if (hunger_v > 500) {
			setTimeout(function() { hunger_message() }, 90);
		    }
		}
	    }
	}
	hunger_v = hunger_v + 0.01;
    }, 100));

    ts.push(setInterval(function() {
	if (distance_to_wall_ahead < 10) {
	    inputs.sight["ahead"][0].message();
	    if (distance_to_wall_ahead < 3) {
		inputs.sight["ahead"][1].message();
	    }
	}
	if (is_there_wall_left) {
	    inputs.sight["left"].message();
	}
	if (is_there_wall_right) {
	    inputs.sight["right"].message();
	}
    }, 100));

    ts.push(setInterval(function() {
	if (is_moving) {
	    inputs.movement["is_moving"].message();
	}
    }, 100));

    ts.push(setInterval(function() {
	inputs.time[0].message();
    }, 250));

    ts.push(setInterval(function() {
	inputs.time[1].message();
    }, 500));

    ts.push(setInterval(function() {
	inputs.time[2].message();
    }, 5000));

    ts.push(setInterval(function() {
	inputs.time[3].message();
    }, 50000));
    
    // the monitor
    
    this.monitor = function(monitor) {
	m = monitor;
	for (var ii = 0; ii < brain_r - 1; ii++) {
	    for (var jj = 0; jj < brain_c; jj++) {
		brain[ii][jj].monitor(m);
	    }
	}
    }

    this.stop = function() {
	for (var oi = 0; oi < ts.length; oi++) {
	    clearTimeout(ts[oi]);
	}
	for (var ii = 0; ii < brain_r - 1; ii++) {
	    for (var jj = 0; jj < brain_c; jj++) {
		brain[ii][jj].stop(m);
	    }
	}
    }

    //console.log("max index is: "+max_index);
}
