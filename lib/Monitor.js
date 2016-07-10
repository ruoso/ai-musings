// The Monitor shows the action across the neurons
module.exports = function( rules ) {
    this.output = function() {
	var read_map = rules.overlay();
	var lines = []
	console.log("\x1b[2J map:");
	for (var jj = 0; jj <= rules.height(); jj++) {
	    var l = [];
	    for (var ii = 0; ii <= rules.width(); ii++) {
		l.push(read_map[jj][ii]);
	    }
	    lines.push(l.join(""));
	}
	console.log(lines.join("\n"));
    };
};
