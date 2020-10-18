var ServiceCreep = require('role.service.creep');

var Blackboard = require('game.blackboard');
const profiler = require('game.profiler');

//var stateMachine = require('manager.state');

function UpdateCreeps()
{
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
		if(creep.spawning === false)
		{
			ServiceCreep.Update(creep);
		}
    }
}

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
