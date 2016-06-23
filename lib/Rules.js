module.exports = function(h, w, snake, walls, food) {
    var s_x = 10;
    var s_y = 10;
    
    this.height = function() { return h };
    this.width = function() { return w };

    var overlay;
    
    this.overlay = function() {
	var new_overlay = [];
	for (var i = 0; i <= h; i++) {
	    for (var j = 0; j <= w; j++) {
		if (new_overlay[i] == null) {
		    new_overlay[i] = [];
		}
		new_overlay[i][j] = " ";
	    }
	}
	for (var oi = 0; oi < walls.length; oi++) {
	    var wall = walls[oi];
	    // really dumb implementation, only supports perpendicular
	    // lines
	    for (var i = wall.start.x; i <= wall.end.x; i++) {
		new_overlay[wall.start.y][i] = "W";
	    }
	    for (var i = wall.start.y; i <= wall.end.y; i++) {
		new_overlay[i][wall.end.x] = "W";
	    }
	}
	for (var oi = 0; oi < food.length; oi++) {
	    var f = food[oi];
	    new_overlay[f.y][f.x] = "F";
	}
	
	var symbol =
	    { W: "←",
	      N: "↑",
	      E: "→",
	      S: "↓" };
	new_overlay[s_y][s_x] = symbol[snake.pointing_to()];
	overlay = new_overlay;
	return new_overlay;
    }

    this.contents_of_cell = function(objects, x, y) {
	return this.overlay(objects)[x][y];
    }

    this.monitor = function(monitor) {
	snake.monitor(monitor);
    }
    
    setInterval(function() {
	if (overlay != null) {
	    if (snake.is_moving()) {
		switch (snake.pointing_to()) {
		case "N": {
		    if (overlay[s_y-1][s_x] != "W")
			s_y--;
		    break;
		}
		case "E": {
		    if (overlay[s_y][s_x+1] != "W")
			s_x++;
		    break;
		}
		case "S": {
		    if (overlay[s_y+1][s_x] != "W")
			s_y++;
		    break;
		}
		case "W": {
		    if (overlay[s_y][s_x-1] != "W")
			s_x--;
		    break;
		}
		}
	    }
	    for (var oi = 0; oi < food.length; oi++) {
		var f = food[oi];
		if (f.x == s_x && f.y == s_y) {
		    food.splice(oi, 1);
		    snake.food_in_mouth();
		    break;
		}
	    }
	}
    }, 100);
};
