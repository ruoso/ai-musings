module.exports = function(i,j,oo,m) {
    var listening = 0;
    var o = oo;
    if (o == null) {
	o = [];
    };
    
    this.message = function() {
	m.touch(i,j);
	if (listening) {
	    listening++;
	} else {
	    listening = 1;
	    setTimeout(function() {
		// first test, send all messages to all neighbors
		for (var ii = 0; ii < o.length; ii++) {
		    if (Math.random() > 0.75) {
			o[ii].message();
		    }
		}
		listening = 0;
	    }, 5);
	}
    };

    this.hijack = function(f) {
	var old_m = this.message;
	this.message = function () {
	    old_m();
	    f();
	}
    }
    
    this.rewire = function(to) {
	if (to == null) {
	    to = [];
	}
	o = to;
    }
    
    this.toString = function() {
	return "[N "+i+"."+j+"]";
    };
};

