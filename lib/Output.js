module.exports = function(j,m,oo) {
    var o = oo;
    if (o == null) {
	o = [];
    };
    
    this.message = function() {
	m.touch(0,j);
	for (var ii = 0; ii < o.length; ii++) {
	    o[ii].message();
	}
    };

    this.rewire = function(to) {
	if (to == null) {
	    to = [];
	}
	o = to;
    }

    this.toString = function() {
	return "[O "+j+"]";
    };
}
