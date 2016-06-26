module.exports = function(brain_r, brain_c, Neuron, Output) {
    var m = null;
    
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

    // insert inputs into the existing neurons of the brain
    function input(ii,jj) {
	console.log("generating input for "+ii+","+jj);
	var part_of_output = [];
	for (var jjj = (jj-a<0?0:jj-a);
	     ((jjj <= (jj+a)) && (jjj < brain_c));
	     jjj++) {
	    console.log("output is "+ii+","+jjj);
	    part_of_output.push(brain[ii][jjj]);
	}
	return new Neuron(ii,jj,part_of_output);
    }
    
    // connect outputs for processing results
    function out(ii,jj,f) {
	brain[ii][jj].hijack(f);
    }

    function wrap(jj) {
	return function() {
	    brain[brain_r-1-1][jj].message()
	}
    }
    
    for (var jj = 0; jj < brain_c; jj++) {
	brain[0][jj].hijack(wrap(jj));
    }
    
    // Now we need to craete the neural inputs
    var e = brain_r - 2;
    var c = Math.floor(brain_c / 2);
    console.log("center is "+c);
    var inputs = {
	direction: {
	    N: input(e, c ),
	    E: input(e, c + 1),
	    S: input(e, c + 2),
	    W: input(e, c + 3),
	},
	smell: {
	    ahead: [ input( e, c - 8 ), input( e, c - 7), input( e, c - 6 ) ],
	    left: input( e, c - 9 ),
	    right: input( e, c - 5 ),
	},
	digestion: {
	    hunger: [ input( e, c - 10 ), input( e, c - 11 ),
		      input( e, c - 4 ), input( e, c - 3 ) ],
	    food_in_mouth: input( e, c - 2 ),
	},
	sight: {
	    ahead: [ input( e, c + 5 ), input( e, c + 6 ) ],
	    left: input( e, c + 4 ),
	    right: input( e, c + 7 ),
	},
	movement: {
	    is_moving: input( e, c + 10 ),
	    turn_left: input( e, c + 9 ),
	    turn_right: input( e, c + 11 ),
	},
	time: [ input( e, c - 15 ), input( e, c + 16 ),
		input( e, c - 17 ), input( e, c + 18 ) ],
    };

    var t = this; // close over
    
    // now we need to create the neural outputs
    out( 0, c - 10, function() {
	t.turn_left();
    });

    out( 0, c - 9, function() {
	t.turn_left();
    });

    out( 0, c - 5, function() {
	t.turn_right();
    });

    out( 0, c - 4, function() {
	t.turn_right();
    });

    out( 0, c - 8, function() {
	t.start_moving();
    });
	
    out( 0, c - 7, function() {
	t.start_moving();
    });
	
    out( 0, c - 6, function() {
	t.start_moving();
    });

    out( 0, c + 4, function() {
	t.turn_right();
    });

    out( 0, c + 7, function() {
	t.turn_left();
    });

    out( 0, c + 5, function() {
	t.stop_moving();
    });

    out( 0, c + 6, function() {
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
    setInterval(function() {
	inputs.direction[direction].message();
    }, 100);

    var smell_message = function() {
	var ahead = inputs.smell["ahead"];
	ahead[0].message();
	ahead[1].message();
	ahead[2].message();
    };
    setInterval(function() {
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
    }, 100);

    var hunger_message = function() {
	hunger[0].message();
	hunger[1].message();
	hunger[2].message();
	hunger[3].message();
    };
    setInterval(function() {
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
    }, 100);

    setInterval(function() {
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
    }, 100);

    setInterval(function() {
	if (is_moving) {
	    inputs.movement["is_moving"].message();
	}
    }, 100);

    setInterval(function() {
	inputs.time[0].message();
    }, 250);

    setInterval(function() {
	inputs.time[1].message();
    }, 500);

    setInterval(function() {
	inputs.time[2].message();
    }, 5000);

    setInterval(function() {
	inputs.time[3].message();
    }, 50000);
    
    // the monitor
    
    this.monitor = function(monitor) {
	m = monitor;
	for (var ii = 0; ii < brain_r - 1; ii++) {
	    for (var jj = 0; jj < brain_c; jj++) {
		brain[ii][jj].monitor(m);
	    }
	}
    }
}
