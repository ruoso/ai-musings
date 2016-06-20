var Monitor       = require("./lib/Monitor.js");
var Neuron        = require("./lib/Neuron.js");
var Output        = require("./lib/Output.js");
var SnakeWorld    = require("./lib/SnakeWorld.js");
var Snake         = require("./lib/Snake.js");


var i = 100;
var j = 40
var m = new Monitor(i,j);
var s = new Snake(i,j,Neuron,Output,m);

setInterval(function() { m.output() }, 20);

