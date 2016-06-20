var Monitor       = require("./lib/Monitor.js");
var Neuron        = require("./lib/Neuron.js");
var Output        = require("./lib/Output.js");
var SnakeWorld    = require("./lib/SnakeWorld.js");
var Snake         = require("./lib/Snake.js");

var i = 200;
var j = 50
var m = new Monitor(i,j);
setInterval(function() { m.output() }, 20);

// let's make a row of j outputs
var outputs = [];
for (var jj = 0; jj < j; jj++) {
    outputs.push(new Output(jj, m));
};

// let's make rows of neurons in a chain
var current_output = outputs;
var a = 2;
for (var ii = 1; ii < i; ii++) {
    // let's make each row with neurons, and connect each neuron in a
    // row with every neuron in the next row.
    var new_output = [];
    for (var jj = 0; jj < j; jj++) {
	var part_of_output = [];
	for (var jjj = (jj-a<0?0:jj-a);
	     ((jjj <= (jj+a)) && (jjj < j));
	     jjj++) {
	    part_of_output.push(current_output[jjj]);
	}
	new_output.push(new Neuron(ii, jj, part_of_output, m));
    }
    current_output = new_output;
}

// the inputs are the base of the chain
var inputs = current_output;
setInterval(function() {
    var x = Math.floor(Math.random() * j);
    inputs[x].message();
}, 10);
