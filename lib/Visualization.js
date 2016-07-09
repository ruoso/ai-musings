var Rules      = require("./Rules.js");
var Monitor    = require("./Monitor.js");
var fs         = require('fs');

module.exports = function( config ) {
    fs.open('generations.log', 'w', function(err, stream) {
	if (err) {
	    throw err;
	}
	var rules = new Rules(config, stream);
	var monitor = new Monitor(rules);
	var m_i = setInterval(function() {
	    monitor.output();
	}, 1000/10);
    });
};
