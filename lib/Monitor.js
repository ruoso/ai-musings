// The Monitor shows the action across the neurons
module.exports = function(i,j) {
    var write_buffer = [];
    var read_buffer = [];
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
    this.touch = function(i,j) {
	write_buffer[i][j] = "*";
    };
    // initialize write buffer...
    swap_buffers();
    // move it to read buffer and make a new write_buffer
    swap_buffers();
    this.output = function() {
	swap_buffers();
	console.log("state:");
	for (var jj = 0; jj < j; jj++) {
	    var l = [];
	    for (var ii = 0; ii < i; ii++) {
		l.push(read_buffer[ii][jj]);
	    }
	    console.log(l.join(""));
	}
    };
};

