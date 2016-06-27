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
    
    // movement
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

    

    function angle_between_points(a_x, a_y, b_x, b_y) {
	var dx = a_x - b_x;
	var dy = a_y - b_y;
	return Math.atan2(dx,dy) * 180 / Math.PI;
    }

    function angle_to_direction(dir, a_x, a_y, b_x, b_y) {
	var angle = angle_between_points(a_x, a_y, b_x, b_y);
	switch(dir) {
	case "N": angle += 0  ; break;
	case "E": angle += 90 ; break;
	case "S": angle += 180; break;
	case "W": angle += 270; break;
	}
	if (angle > 180) {
	    angle = angle - 360;
	}
	if (angle < -180) {
	    angle = angle + 360;
	}
	return angle;
    }

    function distance_between_two_points(a_x, a_y, b_x, b_y) {
	var dx = a_x - b_x;
	var dy = a_y - b_y;
	return Math.sqrt(dx*dx + dy*dy);
    }
    
    // sense of smell
    setInterval(function() {
	var d = snake.pointing_to();
	
	// ahead means a 90-degree-angle cone from the snake's head,
	// open forward.
	var ahead = null;
	var left  = null;
	var right = null;
	for (var oi = 0; oi < food.length; oi++) {
	    var f = food[oi];
	    var angle = angle_to_direction(d,s_x,s_y,f.x,f.y);
	    var distance = distance_between_two_points(s_x, s_y, f.x, f.y);
	    if (angle <= 45 && angle >= -45) {
		if (ahead == null || distance < ahead) {
		    ahead = distance;
		}
	    }
	    if (angle >= 45 && angle <= 135) {
		if (left == null || distance < left) {
		    left  = distance;
		}
	    }
	    if (angle <= -45 && angle >= -135) {	
		if (right == null || distance < right) {
		    right = distance;
		}
	    }
	}
	snake.distance_of_head_from_food(ahead, right, left);

	// left and right are other 90-degree-angle cones, poiting to
	// each side.
	
    }, 100);

    // sense of sight
    setInterval(function() {
	var d = snake.pointing_to();
	var w_ahead = null;
	var w_right = null;
	var w_left  = null;
	for (var oi = 0; oi < walls.length; oi++) {
	    var wa = walls[oi];
	    var d1 = distance_between_two_points(s_x, s_y,
						 wa.start.x, wa.start.y);
	    var a1 = angle_to_direction(d,
					s_x,s_y,
					wa.start.x,wa.start.y);
	    var d2 = distance_between_two_points(s_x, s_y,
						 wa.end.x, wa.end.y);
	    var a2 = angle_to_direction(d,
					s_x,s_y,
					wa.end.x,wa.end.y);
	    if (a1 >= 0 && a2 <= 0 ||
		a1 <= 0 && a2 >= 0) {
		if (Math.abs(a1) < 180 &&
		    Math.abs(a2) < 180) {
		    // there is a wall ahead.  We know that all lines are
		    // either vertical or horizontal, so let's cheat and
		    // find out the distance in a cheaper way.
		    switch (d) {
		    case "N": case "W":
			w_ahead = distance_between_two_points
			(s_x, s_y, s_x, wa.start.y); break;
		    case "E": case "W":
			w_ahead = distance_between_two_points
			(s_x, s_y, wa.start.x, s_y); break;
		    }
		}
	    } else {
		if (a1 > 0 && a2 > 0) {
		    // there is a wall to the right
		    w_right = 1;
		} else {
		    // there is a wall to the left
		    w_left  = 1;
		}
	    }
	}
	snake.distance_of_head_from_obstacles(w_ahead, w_right, w_left);
    }, 20);
};
