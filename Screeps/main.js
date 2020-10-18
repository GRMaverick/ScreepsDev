var ServiceCreep = require('role.service.creep');

var Blackboard = require('game.blackboard');
const profiler = require('game.profiler');

//var stateMachine = require('manager.state');

profiler.enable();
module.exports.loop = function ()
{
	profiler.wrap(function()
	{
		Blackboard.Initialise();
		Blackboard.Update();

		//SpawnCreeps();
		//UpdateCreeps();
	});
}
