// The Monitor shows the action across the neurons
module.exports = function( rules ) {
    this.output = function() {
	var read_map = rules.overlay();
	console.log(" map:");
	for (var jj = 0; jj <= rules.height(); jj++) {
	    var l = [];
	    for (var ii = 0; ii <= rules.width(); ii++) {
		l.push(read_map[jj][ii]);
	    }
	    console.log(l.join(""));
	}
    };
};
