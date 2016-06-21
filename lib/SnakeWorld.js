module.exports = function(h,w,m) {
    var grounds = [];
    this.height = function() { return h };
    this.width = function() { return w };

    for (var i = 0; i < w; i++) {
	var row = [];
	for (var j = 0; j < h; j++) {
	    if (j == 0 || j == h - 1 ||
		i == 0 || i == w - 1) {
		row.push("W");
	    } else {
		row.push(" ");
	    }
	}
	grounds.push(row);
    }
    
    this.overlay = function(objects) {
	var overlay = [];
	for (var i = 0; i < h; i++) {
	    var row = [];
	    for (var j = 0; j < w; j++) {
		row.push(grounds[j][i]);
	    }
	    overlay.push(row);
	}
	for (var oi = 0; oi < objects.length; oi++) {
	    objects[oi].draw(overlay);
	}
	m.map_overlay(overlay);
	return overlay;
    }
    this.contents_of_cell = function(objects, x, y) {
	return this.overlay(objects)[x][y];
    }
};
