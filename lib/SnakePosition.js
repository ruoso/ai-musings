module.exports = function(w,s) {
    var s_x = 10;
    var s_y = 10;

    this.monitor = function(monitor) {
	s.monitor(monitor);
    }
    
    this.new_position = function() {
	w.overlay([ this ]);
    };
    this.draw = function(overlay) {
	overlay[s_x][s_y] = "S";
    };

    var p = this;
    setInterval(function() {
	if (s.is_moving()) {
	    switch (s.pointing_to()) {
	    case "N": s_x++; break;
	    case "E": s_y++; break;
	    case "S": s_x--; break;
	    case "W": s_y--; break;
	    }
	    p.new_position();
	}
	
    }, 100);
};