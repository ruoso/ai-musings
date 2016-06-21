module.exports = function(j,oo) {
    var m = null;
    var o = oo;
    if (o == null) {
	o = [];
    };

    this.monitor = function(monitor) {
	m = monitor;
    };
    
    this.message = function() {
	if (m) {
	    m.touch(0,j);
	}
	for (var ii = 0; ii < o.length; ii++) {
	    o[ii].message();
	}
    };

    this.rewire = function(to) {
	if (to == null) {
	    to = [];
	}
	o = to;
    };

    this.toString = function() {
	return "[O "+j+"]";
    };
}
