var gene_size     = 2;
var dna_size      = 400*gene_size;
var start_food    = 10;
var start_snakes  = 10;
var map_w         = 260;
var map_h         = 60;
var fs            = require('fs');
var Snake         = require("./Snake.js");
var symbol        = { W: "←",
		      N: "↑",
		      E: "→",
		      S: "↓" };
var food_size = 2;

function randomstring(size) {
    var char = ""
    var valid = [ '0', '1', '2', '3', '4', '5', '6', '7',
		  '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
    for (var i = 0; i < size; i++) {
	char += valid[Math.round(Math.random() * 15)];
    }
    return char;
}

function gen_child(parent) {
    var sr = randomstring(dna_size);
    var new_dna = "";
    for (var i = 0; i <= dna_size/gene_size; i++) {
	var s;
	if (Math.random() > 0.999) { // mutation
	    s = sr
	} else {
	    s = parent
	}
	new_dna += s.substring(i*gene_size, (i*gene_size)+gene_size);
    }
    return new_dna;
}

module.exports = function(seed_config, stream) {
    var walls =
	[
	    { start: { x: 0, y: 0},
	      end:   { x: map_w-1, y: 0},
	    },
	    { start: { x: 0, y: 0},
	      end:   { x: 0, y: map_h-1},
	    },
	    { start: { x: map_w-1, y: 0},
	      end:   { x: map_w-1, y: map_h-1},
	    },
	    { start: { x: 0, y: map_h},
	      end:   { x: map_w-1, y: map_h-1},
	    },
	];
    
    var food = [];
    for (var oi = 0; oi < start_food; oi++) {
	food.push({
	    x: Math.floor(Math.random()*(map_w-6))+3,
	    y: Math.floor(Math.random()*(map_h-6))+3
	});
    }
    
    var ts  = [];
    var snakes = [];

    for (var oi = 0; oi < start_snakes; oi++) {
	snakes.push({
	    s: new Snake(seed_config),
	    x: 1,
	    y: 1,
	});
    }
    
    var f_stop = function() {
	for (var oi = 0; oi < ts.length; oi++) {
	    clearTimeout(ts[oi]);
	}
	for (var oi = 0; oi < snakes.length; oi++) {
	    snakes[oi]["s"].stop();
	}
    };
    
    this.stop = f_stop;
    this.height = function() { return map_h };
    this.width = function() { return map_w };

    var overlay;
    var gen_overlay = function() {
	var new_overlay = [];
	for (var i = 0; i <= map_h; i++) {
	    for (var j = 0; j <= map_w; j++) {
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
	    for (var aaa = 0; aaa < food_size; aaa++) {
		for (var bbb = 0; bbb < food_size; bbb++) {
		    if (f.y - (food_size/2) + aaa > 0 &&
			f.y - (food_size/2) + aaa < map_h &&
			f.x - (food_size/2) + bbb > 0 &&
			f.x - (food_size/2) + bbb < map_w) { 
			new_overlay
			[Math.floor(f.y-(food_size/2)+aaa)]
			[Math.floor(f.x-(food_size/2)+bbb)] = "F";
		    }
		}
	    }
	}
	for (var oi = 0; oi < snakes.length; oi++) {
	    var s = snakes[oi];
	    new_overlay[s["y"]][s["x"]] = symbol[s["s"].pointing_to()];
	}
	overlay = new_overlay;
	return new_overlay;
    }
    this.overlay = gen_overlay;
    gen_overlay();
    
    this.contents_of_cell = function(objects, x, y) {
	return this.overlay(objects)[x][y];
    }

    // movement
    ts.push(setInterval(function() {
	for (var soi = 0; soi < snakes.length; soi++) {
	    if (snakes[soi]["s"].is_dead()) {
		if (food.length < start_food * 2) {
		    food.push({ x: snakes[soi]["x"],
				y: snakes[soi]["y"] });
		}
		snakes.splice(soi,1);
		soi--;
	    }
	}
	while (snakes.length < start_snakes) {
	    // introduce a random snake if the population gets too low.
	    snakes.push({
		s: new Snake(randomstring(dna_size)),
		x: 1,
		y: 1
	    });
	}
	for (var soi = 0; soi < snakes.length; soi++) {
	    var s = snakes[soi];
	    var snake = s["s"];
	    if (snake.is_moving()) {
		switch (snake.pointing_to()) {
		case "N": {
		    if (overlay[s["y"]-1][s["x"]] != "W") {
			s["y"]--;
		    }
		    break;
		}
		case "E": {
		    if (overlay[s["y"]][s["x"]+1] != "W") {
			s["x"]++;
		    }
		    break;
		}
		case "S": {
		    if (overlay[s["y"]+1][s["x"]] != "W") {
			s["y"]++;
		    }
		    break;
		}
		case "W": {
		    if (overlay[s["y"]][s["x"]-1] != "W") {
			s["x"]--;
		    }
		    break;
		}
		}
	    }
	    for (var oi = 0; oi < food.length; oi++) {
		var f = food[oi];
		if (f.x <= (s["x"]+(food_size/2)) &&
		    f.x >= (s["x"]-(food_size/2)) &&
		    f.y <= (s["y"]+(food_size/2)) &&
		    f.y >= (s["y"]-(food_size/2))) {
		    food.splice(oi, 1);
		    oi--;
		    snake.food_in_mouth();
		    fs.write(stream, snake.config() + "\n");

		    snakes.push({
			s: new Snake(gen_child(snake.config())),
			x: 1,
			y: 1
		    });
		    
		    break;
		}
	    }
	}
    }, 100));
    
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
    ts.push(setInterval(function() {
	for (var soi = 0; soi < snakes.length; soi++) {
	    var s = snakes[soi];
	    var snake = s["s"];
	    var d = snake.pointing_to();
	
	    // ahead means a 90-degree-angle cone from the snake's head,
	    // open forward.
	    var ahead = null;
	    var left  = null;
	    var right = null;
	    for (var oi = 0; oi < food.length; oi++) {
		var f = food[oi];
		var angle = angle_to_direction(d,s["x"],s["y"],f.x,f.y);
		var distance = distance_between_two_points(s["x"], s["y"], f.x, f.y);
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
	    // left and right are other 90-degree-angle cones, poiting to
	    // each side.
	    snake.distance_of_head_from_food(ahead, right, left);
	}
    }, 100));

    // sense of sight
    ts.push(setInterval(function() {
	for (var soi = 0; soi < snakes.length; soi++) {
	    var s = snakes[soi];
	    var snake = s["s"];
	    var d = snake.pointing_to();
	    var w_ahead = null;
	    var w_right = null;
	    var w_left  = null;
	    for (var oi = 0; oi < walls.length; oi++) {
		var wa = walls[oi];
		var d1 = distance_between_two_points(s["x"], s["y"],
						     wa.start.x, wa.start.y);
		var a1 = angle_to_direction(d,
					    s["x"],s["y"],
					    wa.start.x,wa.start.y);
		var d2 = distance_between_two_points(s["x"], s["y"],
						     wa.end.x, wa.end.y);
		var a2 = angle_to_direction(d,
					    s["x"],s["y"],
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
			    (s["x"], s["y"], s["x"], wa.start.y); break;
			case "E": case "W":
			    w_ahead = distance_between_two_points
			    (s["x"], s["y"], wa.start.x, s["y"]); break;
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
	}
    }, 20));
};
