var Simulation = require("./Simulation.js");
var Monitor    = require("./Monitor.js");

var brain_r = 32;
var brain_c = 32;
module.exports = function( config ) {
    var sim = new Simulation(config);
    var rules = sim["rules"];
    var monitor = new Monitor(brain_r, brain_c, rules);

    monitor.start();
    var m_i = setInterval(function() {
	monitor.output();
    }, 1000/30);

    this.simulation = sim;
}
