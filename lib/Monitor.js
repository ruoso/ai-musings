// The Monitor shows the action across the neurons
module.exports = function( i, j, world, objects ) {
    var write_buffer = [];
    var read_buffer = [];

    var map = [];
    var read_map = [];
    for (var x = 0; x < world.height(); x++) {
	var row = [];
	for (var y = 0; y < world.width(); y++) {
	    row.push(" ");
	}
	read_map.push(row);
    }

    var swap_buffers = function() {
	var new_buffer = [];
	for (var ii = 0; ii < i; ii++) {
	    var row = [];
	    for (var jj = 0; jj < j; jj++) {
		row.push("O");
	    }
	    new_buffer.push(row);
	};
	read_buffer = write_buffer;
	write_buffer = new_buffer;
    };

    var map_overlay = function() {
	read_map = world.overlay(objects);
    };
    
    // initialize write buffer...
    swap_buffers();
    // move it to read buffer and make a new write_buffer
    swap_buffers();

    this.touch = function(i,j) {
	if (write_buffer[i]) {
	    write_buffer[i][j] = "*";
	}
    };

    this.output = function() {
	swap_buffers();
	map_overlay();
	console.log("state x map:");
	for (var jj = 0; (jj < j || jj < world.height()); jj++) {
	    var l = [];
	    for (var ii = 0; (ii < i || ii < world.width()); ii++) {
		if (jj < j && ii < i) {
		    l.push(read_buffer[ii][jj]);
		} else {
		    l.push(" ");
		}
	    }
	    l.push("     ");
	    for (var ii = 0; (ii < i || ii < world.width()); ii++) {
		if (jj < world.height() && ii < world.width()) {
		    l.push(read_map[jj][ii]);
		} else {
		    l.push(" ");
		}
	    }
	    console.log(l.join(""));
	}
    };

    this.start = function() {
	for (var i = 0; i < objects.length; i++) {
	    objects[i].monitor(this);
	}
    };

};
