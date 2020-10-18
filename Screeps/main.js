var ServiceCreepConfig = require('role.service.config');
var ServiceCreep = require('role.service.creep');

var Blackboard = require('game.blackboard');
var Profiler = require('game.profiler');

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

function SpawnCreeps()
{
	if(ServiceCreep.Create(ServiceCreepConfig.Harvester, "Spawn1") === true)
	{
		return;
	}

	if(ServiceCreep.Create(ServiceCreepConfig.Builder, "Spawn1") === true)
	{
		return;
	}

	if(ServiceCreep.Create(ServiceCreepConfig.Upgrader, "Spawn1") === true)
	{
		return;
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

module.exports.loop = function ()
{
	Blackboard.Initialise();

    ClearDead();

	//SpawnCreeps();
    UpdateCreeps();

    //stateMachine.Update();

    RawMemory.set(JSON.stringify(Memory));
}
