var Blackboard = require('game.blackboard');
var DebugToggles = require('debug.toggles');

const profiler = require('game.profiler');

profiler.enable();
module.exports.loop = function () {
    Memory.LogCreep = DebugToggles.LogCreep;
    Memory.LogActions = DebugToggles.LogActions;
    Memory.LogForeman = DebugToggles.LogForeman;
    Memory.LogArchitect =DebugToggles.LogArchitect;
    Memory.LogRecruiter = DebugToggles.LogRecruiter;
    Memory.LogBlackboard = DebugToggles.LogBlackboard;
    
	profiler.wrap(function() {
		Blackboard.Initialise();
		Blackboard.Update();
	});
}
