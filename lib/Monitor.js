// The Monitor shows the action across the neurons
module.exports = function( i, j, rules ) {
    var write_buffer = [];
    var read_buffer = [];

    var swap_buffers = function() {
	var new_buffer = [];
	for (var ii = 0; ii < i; ii++) {
	    var row = [];
	    for (var jj = 0; jj < j; jj++) {
		row.push(" ");
	    }
	    new_buffer.push(row);
	};
	read_buffer = write_buffer;
	write_buffer = new_buffer;
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
	var read_map = rules.overlay();
	console.log("state x map:");
	for (var jj = 0; (jj < j || jj < rules.height()); jj++) {
	    var l = [];
	    for (var ii = 0; (ii < i || ii < rules.width()); ii++) {
		if (jj < j && ii < i) {
		    l.push(read_buffer[ii][jj]);
		} else {
		    l.push(" ");
		}
	    }
	    l.push("     ");
	    for (var ii = 0; (ii < i || ii < rules.width()); ii++) {
		if (jj < rules.height() && ii < rules.width()) {
		    l.push(read_map[jj][ii]);
		} else {
		    l.push(" ");
		}
	    }
	    console.log(l.join(""));
	}
    };

    this.start = function() {
	rules.monitor(this);
    };

};
