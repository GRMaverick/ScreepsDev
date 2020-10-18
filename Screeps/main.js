var ServiceCreep = require('role.service.creep');

var Blackboard = require('game.blackboard');
const profiler = require('game.profiler');

//var stateMachine = require('manager.state');

function ClearDead()
{
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name])
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}


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

		ClearDead();

		//SpawnCreeps();
		//UpdateCreeps();
	});
}
