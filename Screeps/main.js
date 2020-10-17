var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var stateMachine = require('manager.state');

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
        if(creep.memory.role == 'Harvester')
        {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'Upgrader')
        {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'Builder')
        {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'Repairer')
        {
            roleRepairer.run(creep);
        }
    }
}

module.exports.loop = function ()
{
    //Memory = JSON.parse(RawMemory.get());

    ClearDead();
    UpdateCreeps();
    stateMachine.Update();

    RawMemory.set(JSON.stringify(Memory));
}
