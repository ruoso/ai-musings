// The Monitor shows the action across the neurons
module.exports = function(i,j,h,w) {
    var write_buffer = [];
    var read_buffer = [];

    var map = [];
    var read_map = [];
    for (var x = 0; x < h; x++) {
	var row = [];
	for (var y = 0; y < w; y++) {
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

    this.map_overlay = function(overlay) {
	var new_map = [];
	for (var x = 0; x < h; x++) {
	    var row = [];
	    for (var y = 0; y < w; y++) {
		row.push(overlay[x][y]);
	    }
	    new_map.push(row);
	}
	read_map = new_map;
    };
    
    this.touch = function(i,j) {
	write_buffer[i][j] = "*";
    };
    // initialize write buffer...
    swap_buffers();
    // move it to read buffer and make a new write_buffer
    swap_buffers();
    this.output = function() {
	swap_buffers();
	console.log("state x map:");
	for (var jj = 0; (jj < j || jj < h); jj++) {
	    var l = [];
	    for (var ii = 0; (ii < i || ii < w); ii++) {
		if (jj < j && ii < i) {
		    l.push(read_buffer[ii][jj]);
		} else {
		    l.push(" ");
		}
	    }
	    l.push("     ");
	    for (var ii = 0; (ii < i || ii < w); ii++) {
		if (jj < h && ii < w) {
		    l.push(read_map[jj][ii]);
		} else {
		    l.push(" ");
		}
	    }
	    console.log(l.join(""));
	}
    };
};

