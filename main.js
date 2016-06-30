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
	    food.push({ x: ffx, y: ffy });
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
    }, 600000);
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
    configs.push({ config: "e69154c1f9e14747b1ba7c6a741b37e98a0ac3931c12735dae19bb21b3d659e9bdf41e8c86702537b689cba8698e5edc4193dbb9b204b3725b5c56d4d366454a23e1ac66d823457ed53b72a68e6ecdffac3d8fc91880beb431e75d48258d7564d2d72651173fc16d6d02c727b7a8c42f0e3e3852b5cb4be8ed33a253bdead43eb24d3798b28fd22ea662e46c7c108c9a0aeb99a08a87bcd261e92ba69bb16c431396b67d3efc167dd58d52878756bf52695645171b06f34e32d1bd875cdfd24545cc4e79b457e7f67c13856c16877105b2e8d90e03c98c3c2453962060d3b7cdb08656a954dfcdbb519758d77d6aa300cc2ce74a8ab1bce8bdd665a3b732e44a97ced81e0acd41a7f89227b4c05954bb86cad934c566d15d4435351aea16537a6e9409ff6d519b5992e2cae487f929ad1c5d5b6435adcccd19242adba4cf931819da41e7335bbc43b3606fceab93cd53d6736c6a627fb65da1c8e4bc92e1412f6c1a3f114dfdf3f211e866d7758dfe3e4db02a9f925cdbb4d5c2d7340c5b6b9a18986b846912ca49e62d9678792311b1", rules: { food_left: function() { 0 }, snake_odometer: function() {} }});
}

fs.open('generations.log', 'w', function(err, stream) {
    if (err) {
	throw err;
    }
    gen_generation(stream,  number_of_generations);
});
