var Monitor       = require("./lib/Monitor.js");
var Neuron        = require("./lib/Neuron.js");
var Output        = require("./lib/Output.js");
var Snake         = require("./lib/Snake.js");
var Rules         = require("./lib/Rules.js");
var fs            = require('fs');

var brain_r = 32;
var brain_c = 32;
var map_w = 130;
var map_h = 40;

function randomstring(size) {
    var char = ""
    var valid = [ '0', '1', '2', '3', '4', '5', '6', '7',
		  '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
    for (var i = 0; i < size; i++) {
	char += valid[Math.round(Math.random() * 15)];
    }
    return char;
}

function gen_simulation(config) {
    var walls =
	[
	    { start: { x: 0, y: 0},
	      end:   { x: 129, y: 0},
	    },
	    { start: { x: 0, y: 0},
	      end:   { x: 0, y: 39},
	    },
	    { start: { x: 129, y: 0},
	      end:   { x: 129, y: 39},
	    },
	    { start: { x: 0, y: 39},
	      end:   { x: 129, y: 39},
	    },
	];

    var food =
	[];
    for (var ffx = 5; ffx < 130; ffx += 10) {
	for (var ffy = 5; ffy < 40; ffy += 10) {
	    food.push({ x: ffx+Math.floor(Math.random()*8)-4,
			y: ffy+Math.floor(Math.random()*8)-4 });
	}
    }
    
    var snake = new Snake(brain_r, brain_c, Neuron, Output, config);
    var rules = new Rules(map_h, map_w, snake, walls, food);
    return {
	rules: rules,
	config: config,
    };
}

var number_of_generations = 2000000;
var population_size       = 40;
var gene_size             = 2;
var dna_size              = 400*gene_size;

var configs = [];

function compare_snakes(a, b) {
    if (a["rules"].food_left() ==
	b["rules"].food_left()) {
	if (a["rules"].snake_odometer() ==
	    b["rules"].snake_odometer()) {
	    return 0;
	} else if (a["rules"].snake_odometer() >
		   b["rules"].snake_odometer()) {
	    return -1;
	} else {
	    return 1;
	}
    } else if (a["rules"].food_left() <
	       b["rules"].food_left()) {
	return -1;
    } else {
	return 1;
    }
}

function gen_children() {
    var sorted_configs = configs.sort(compare_snakes);
    // we will preserve the two parents, add two more completely
    // random entries, and generate children for the other slots;
    var new_config = [ { config: sorted_configs[0]["config"] },
		       { config: sorted_configs[1]["config"] },
		       { config: sorted_configs[2]["config"] },
		       { config: sorted_configs[3]["config"] },
		       { config: sorted_configs[4]["config"] },
		       { config: sorted_configs[5]["config"] },
		       { config: sorted_configs[6]["config"] },
		       { config: sorted_configs[7]["config"] },
		       { config: sorted_configs[8]["config"] },
		       { config: sorted_configs[9]["config"] },
		       { config: sorted_configs[10]["config"] },
		       { config: sorted_configs[11]["config"] },
		       { config: sorted_configs[12]["config"] },
		       { config: sorted_configs[13]["config"] },
		       { config: sorted_configs[14]["config"] },
		       { config: sorted_configs[15]["config"] },
		       { config: sorted_configs[16]["config"] },
		       { config: sorted_configs[17]["config"] },
		       { config: sorted_configs[18]["config"] },
		       { config: sorted_configs[19]["config"] },
		     ];
    var sa = sorted_configs[0]["config"];
    var sb = sorted_configs[1]["config"];
    var sr = randomstring(dna_size);
    while (new_config.length < population_size) {
	var new_dna = "";
	for (var i = 0; i <= dna_size/gene_size; i++) {
	    var s;
	    if (Math.random() > 0.99) { // mutation
		s = sr
	    } else { // mix the first 5 snakes' dna
		if (Math.random() > 0.5) {
		    s = sa;
		} else {
		    s = sb;
		}
	    }
	    new_dna += s.substring(i*gene_size, (i*gene_size)+gene_size);
	}
	new_config.push({ config: new_dna });
    }
    configs = new_config;
}


function winning_run() {
    var sorted_snake = configs.sort(compare_snakes);
    var sim = gen_simulation(sorted_snake[0]["config"]);
    var rules = sim["rules"];
    var monitor = new Monitor(brain_r, brain_c, rules);

    monitor.start();
    var m_i = setInterval(function() {
	monitor.output();
    }, 1000/30);

    setTimeout(function() {
	rules.stop();
	clearTimeout(m_i);
	console.log("Snake odometer: "+rules.snake_odometer());
	console.log("Food left: "+rules.food_left());
	setTimeout(function() { console.log("leaving....") }, 1000);
    }, 60000);
}

function gen_generation(stream, count) {
    console.log(count+" generations left");
    for (var j = 0; j < population_size; j++) {
	if (configs[j] == null) {
	    configs[j] = { config: randomstring(dna_size) };
	}
	configs[j] = gen_simulation(configs[j]["config"]);
    }
    setTimeout(function() {
	console.log(count+" generations run ended");
	for (var j = 0; j < population_size; j++) {
	    configs[j]["rules"].stop();
	}
	fs.write(stream, "// generation "+count+"\n");
	var sorted_configs = configs.sort(compare_snakes).reverse();
	for (var j = 0; j < population_size; j++) {
	    console.log('snake '+
			sorted_configs[j]["config"].substring(0,4)+
			' had '+
			sorted_configs[j]["rules"].food_left()+" "+
			sorted_configs[j]["rules"].snake_odometer());
	    fs.write(stream,
		     sorted_configs[j]["config"]+" "+
		     sorted_configs[j]["rules"].food_left()+" "+
		     sorted_configs[j]["rules"].snake_odometer()+"\n");
	}
	if (count > 0) {
	    gen_children();
	    gen_generation(stream, count-1);
	} else {
	    winning_run();
	}
    }, 30000);
}

configs = [];
for (var i = 0; i < 20; i++) {
    configs.push({ config: "bf684ab2537e6ea10a6dbb88aa2ba89f549a11e742dbd6c7e1439c2aac3258e48821cc3e37d1e92e48b3aada3529e4638a54dcdc3d7be7d8b47fb291de7b39dd04d6c242c380c1a793e6589e8ce856e3ce44691a51867588bdacc52c7779a66ed8a85e9b3ebf18d6be690e4b97284c2030a31c4316e6c7df021972f1adb7318efb5cdce765d60c88b92453cde17c3f7e1eb7c2b3c5cdb2dbccd8c82c36c052b05675cdc71663ec2068eca5912da8d3a9d218fba8679e85566b43775df2e58477a90e1b41c35b061bb6eba37cde121401f0da4d4e6d2e4443def82b6a7593c2f7c688195ad5cc45b6864ddc1bb62a4bef3ab8c9142bae9f3a682f85176e49a1429ccfdc60443515b1564663893599215628ad6c731b61ebbd1e0e6d217362d142d969f14ca2e4c28b1917b15ded88c0535a27866626e5ba31863891bcc505bcbb4d6cc1dc37b1dcd2abfb01cd447d1e184b01976a12b01b39d91aed1d0c124993925db95b1857153a183e667dd292ca855e182a6a9152db869d09ad38c4a15602195e6b4741a46191c5de8a96d5d1fcca", rules: { food_left: function() { 0 }, snake_odometer: function() {} }});
}

// evolve
fs.open('generations.log', 'w', function(err, stream) {
    if (err) {
	throw err;
    }
    gen_generation(stream,  number_of_generations);
});
// or do the winning run
// winning_run();
