var ServiceCreepConfig = require('config.role.service');
var ServiceCreep = require('role.service');

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

	ServiceCreep.Create(ServiceCreepConfig.Harvester);

    UpdateCreeps();

    //stateMachine.Update();

    //RawMemory.set(JSON.stringify(Memory));
}
