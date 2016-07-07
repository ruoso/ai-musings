var brain_r = 32;
var brain_c = 32;
var map_w = 130;
var map_h = 40;
var Neuron        = require("./Neuron.js");
var Output        = require("./Output.js");
var Snake         = require("./Snake.js");
var Rules         = require("./Rules.js");

module.exports = function( config ) {
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
    for (var ffx = 5; ffx < map_w; ffx += 10) {
	for (var ffy = 5; ffy < map_h; ffy += 10) {
	    food.push({ x: ffx+Math.floor(Math.random()*8)-4,
			y: ffy+Math.floor(Math.random()*8)-4 });
	}
    }
    
    var snake = new Snake(brain_r, brain_c, Neuron, Output, config);
    this.rules = new Rules(map_h, map_w, snake, walls, food);
    this.config = config;
}
