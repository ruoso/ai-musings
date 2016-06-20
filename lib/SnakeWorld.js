module.exports = function(h,w,m) {
    var grounds = [];
    for (var i = 0; i < h; i++) {
	var row = [];
	for (var j = 0; j < w; j++) {
	    if (j == 0 || j == w - 1 ||
		i == 0 || i == h - 1) {
		row.push("W");
	    } else {
		row.push(" ");
	    }
	}
    }
    this.overlay = function(objects) {
	var overlay = [];
	if (j == 0 || j == w - 1 ||
	    i == 0 || i == h - 1) {
	    row.push("W");
	} else {
	    row.push(" ");
	}
	for (var oi = 0; oi < objects.length; oi++) {
	    objects[oi].draw(overlay);
	}
	return overlay;
    }
    this.contents_of_cell = function(objects, x, y) {
	return this.overlay(objects)[x][y];
    }
};
