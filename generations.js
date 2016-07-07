var Generations           = require("./lib/Generations.js");
var seed_config           = process.argv[2];
var fs                    = require('fs');
var number_of_generations = 2000000;
var g = new Generations( seed_config );

// evolve
fs.open('generations.log', 'w', function(err, stream) {
    if (err) {
	throw err;
    }
    g.gen_generation(stream, number_of_generations);
});
