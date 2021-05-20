var Blackboard = require('game.blackboard');
const profiler = require('game.profiler');

profiler.enable();
module.exports.loop = function () {
    Memory.TaskLogging = true;
    Memory.BlackboardLogging = true;
    Memory.SpawnLogging = true;
    
	profiler.wrap(function() {
		Blackboard.Initialise();
		Blackboard.Update();
	});
}
