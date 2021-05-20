var Blackboard = require('game.blackboard');
const profiler = require('game.profiler');

profiler.enable();
module.exports.loop = function () {
	profiler.wrap(function() {
		Blackboard.Initialise();
		Blackboard.Update();
	});
}
