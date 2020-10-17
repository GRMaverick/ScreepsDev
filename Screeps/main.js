var ServiceCreepConfig = require('role.service.config');
var ServiceCreep = require('role.service.creep');

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

		ServiceCreep.Update(creep);
    }
}

module.exports.loop = function ()
{
    ClearDead();

	ServiceCreep.Create(ServiceCreepConfig.Harvester, "Spawn1");

    UpdateCreeps();

    //stateMachine.Update();

    //RawMemory.set(JSON.stringify(Memory));
}
