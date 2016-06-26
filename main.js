var Monitor       = require("./lib/Monitor.js");
var Neuron        = require("./lib/Neuron.js");
var Output        = require("./lib/Output.js");
var Snake         = require("./lib/Snake.js");
var Rules         = require("./lib/Rules.js");

var brain_r = 20;
var brain_c = 40;
var map_w = 130;
var map_h = 40;

var snake = new Snake(brain_r, brain_c, Neuron, Output);
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
    [
	{ x: 10, y: 5 },
	{ x: 55, y: 5 },
    ];
var rules = new Rules(map_h, map_w, snake, walls, food);
var monitor = new Monitor(brain_r, brain_c, rules);
monitor.start();
setInterval(function() {
    monitor.output();
}, 1000/30);

