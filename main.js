var Monitor       = require("./lib/Monitor.js");
var Neuron        = require("./lib/Neuron.js");
var Output        = require("./lib/Output.js");
var SnakeWorld    = require("./lib/SnakeWorld.js");
var Snake         = require("./lib/Snake.js");
var SnakePosition = require("./lib/SnakePosition.js");

var brain_r = 120;
var brain_c = 40;
var map_w = 40;
var map_h = 130;

var m = new Monitor(brain_r,brain_c,map_w,map_h);
var s = new Snake(brain_r,brain_c,Neuron,Output, m);
var w = new SnakeWorld(map_w, map_h, m);
var p = new SnakePosition(w,m,s);

w.overlay([ p ]);

setInterval(function() {
    m.output();
}, 40);

