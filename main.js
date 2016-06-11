
var Monitor = function(i,j) {
    this.write_buffer = [];
    this.read_buffer = [];
    this.swap_buffers = function() {
	var new_buffer = [];
	for (var ii = 0; ii < i; ii++) {
	    var row = [];
	    for (var jj = 0; jj < j; jj++) {
		row.push("O");
	    }
	    new_buffer.push(row);
	};
	this.read_buffer = this.write_buffer;
	this.write_buffer = new_buffer;
    };
    this.touch = function(i,j) {
	this.write_buffer[i][j] = "*";
    };
    // initialize write buffer...
    this.swap_buffers();
    // move it to read buffer and make a new write_buffer
    this.swap_buffers();
    this.output = function() {
	this.swap_buffers();
	console.log("state:");
	for (var jj = 0; jj < j; jj++) {
	    var l = [];
	    for (var ii = 0; ii < i; ii++) {
		l.push(this.read_buffer[ii][jj]);
	    }
	    console.log(l.join(""));
	}
    };
}

var m;
var Neuron = function(i,j,o) {
    this.i = i;
    this.j = j;
    this.listening = 0;
    if (o == null) {
	o = [];
    };
    this.o = o;
};
Neuron.prototype.message = function() {
    m.touch(this.i,this.j);
    if (this.listening) {
	this.listening++;
    } else {
	this.listening = 1;
	var x = this;
	setTimeout(function() {
	    // first test, send all messages to all neighbors
	    for (var ii = 0; ii < x.o.length; ii++) {
		if (Math.random() > 0.96999999) {
		    x.o[ii].message();
		}
	    }
	    x.listening = 0;
	}, 20);
    }
};
Neuron.prototype.toString = function() {
    return "[N "+this.i+"."+this.j+"]";
};

var Output = function(j) {
    this.j = j;
}
Output.prototype.message = function() {
    m.touch(0,this.j);
};
Output.prototype.toString = function() {
    return "[O "+this.j+"]";
};

var i = 200;
var j = 50
m = new Monitor(i,j);
setInterval(function() { m.output() }, 20);

// let's make a row of 3 outputs
var outputs = [];
for (var jj = 0; jj < j; jj++) {
    outputs.push(new Output(jj));
};

// let's make rows of neurons in a chain
var current_output = outputs;
for (var ii = 1; ii < i; ii++) {
    // let's make each row with neurons, and connect each neuron in a
    // row with every neuron in the next row.
    var new_output = [];
    for (var jj = 0; jj < j; jj++) {
	new_output.push(new Neuron(ii, jj, current_output));
    }
    current_output = new_output;
}

// the inputs are the base of the chain
var inputs = current_output;

setInterval(function() { var x = Math.floor(Math.random() * j); inputs[x].message() }, 20);
