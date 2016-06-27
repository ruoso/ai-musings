module.exports = function(i,j,oo) {
    var m = null;
    var listening = 0;
    var o = oo;
    if (o == null) {
	o = [];
    };

    this.monitor = function(monitor) {
	m = monitor;
    };

    var mapping = [];
    var output_count = [];
    for (var oi = 0; oi < oo.length; oi++) {
	output_count.push(0);
    }
    var output_center = Math.floor(oo.length/2);
    //output_count[output_center] = 1;
    var activation_window = 20;
    var bits_per_pixel = 3;

    var quantized_to_hash = function(q) {
	// this number represents
	//debugger;
	var n = 0;
	for (var oi = 0; oi < q.length; oi++) {
	    n += q[oi]<<(bits_per_pixel*oi);
	}
	return n;
    }

   
    var collecting = [];
    this.message = function() {
	if (m) {
	    m.touch(i,j);
	}
	if (listening) {
	    var thisdate = new Date().getTime();
	    collecting.push(thisdate);
	} else {
	    listening = new Date().getTime();
	    collecting = [ listening ];
	    setTimeout(function() {
		// quantize the messages
		var q = [ 0, 0, 0, 0, 0, 0 ];
		for (var oi = 0; oi < collecting.length; oi++) {
		    var diff = collecting[oi] - listening;
		    var slot = Math.round((diff/activation_window)*q.length);
		    if (q[slot] < bits_per_pixel) {
			q[slot]++;
		    }
		}
		var n = quantized_to_hash(q);
		if (!mapping[n]) {
		    //debugger;
		    for (var x = output_center + 1; x < o.length; x++) {
			var xo = (output_center - (x - output_center));
			if (output_count[output_center] <= output_count[x] ||
			    output_count[output_center] <= output_count[xo]) {
			    mapping[n] = output_center;
			    output_count[output_center]++;
			    break;
			} else {
			    if (output_count[x] < output_count[xo]) {
				mapping[n] = x;
				output_count[x]++;
				break;
			    } else if (output_count[xo] < output_count[x]) {
				mapping[n] = xo;
				output_count[xo]++;
				break;
			    }
			    if (output_count[x] == 0 && output_count[xo] == 0) {
				if (x % 2) {
				    mapping[n] = xo;
				    output_count[xo]++;
				    break;
				} else {
				    mapping[n] = x;
				    output_count[x]++;
				    break;
				}
			    }
			}
		    }
		}
		listening = 0;
		if (o[mapping[n]]) {
		    o[mapping[n]].message();
		}
	    }, activation_window);
	}
    };

    this.hijack = function(f) {
	var old_m = this.message;
	var limit = 0;
	this.message = function () {
	    old_m();
	    if (!limit) {
		limit = 1;
		setTimeout(function() {
		    f();
		    limit = 0;
		}, 400);
	    }
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

