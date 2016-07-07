var population_size       = 40;
var gene_size             = 2;
var dna_size              = 400*gene_size;
var fs                    = require('fs');
var Simulation            = require("./Simulation.js");

function randomstring(size) {
    var char = ""
    var valid = [ '0', '1', '2', '3', '4', '5', '6', '7',
		  '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
    for (var i = 0; i < size; i++) {
	char += valid[Math.round(Math.random() * 15)];
    }
    return char;
}

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

function gen_children(configs) {
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
    return new_config;
}

module.exports = function( seed_config ) {
    var configs = [];
    for (var i = 0; i < population_size/2; i++) {
	configs.push({ config: seed_config,
		       rules: { food_left: function() { 0 },
				snake_odometer: function() {} }});
    }
    var gen_generation = null;
    
    gen_generation = function(stream, count) {
	console.log(count+" generations left");
	for (var j = 0; j < population_size; j++) {
	    if (configs[j] == null) {
		configs[j] = { config: randomstring(dna_size) };
	    }
	    configs[j] = new Simulation(configs[j]["config"]);
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
		configs = gen_children(configs);
		gen_generation(stream, count-1);
	    }
	}, 60000);
    }
    this.gen_generation = gen_generation;
}

