var Services = require('role.service.actions');
var ServiceCreepConfig = require('role.service.config');

function CalculateCost(_body)
{
    var cost = 0;
    for(var i in _body)
    {
        switch(_body[i])
        {
            case MOVE:
                cost = cost + 50;
                break;
            case WORK:
                cost = cost + 100;
                break;
            case CARRY:
                cost = cost + 50;
                break;
            case ATTACK:
                cost = cost + 80;
                break
            case RANGED_ATTACK:
                cost = cost + 150;
                break;
            case HEAL:
                cost = cost + 250;
                break;
            case CLAIM:
                cost = cost + 600;
                break;
            case TOUGH:
                cost = cost + 10;
                break
        }
    }
    return cost;
}

function Harvest(_creep)
{
	if(_creep.store.getFreeCapacity() > 0)
	{
		_creep.say("Harvesting");
		Services.Harvest(_creep);
		return true;
	}
	else
	{
		var resourceTargets = _creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
				   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});

		if(resourceTargets.length > 0)
		{
			_creep.say("Delivering");
			Services.Deliver(_creep, resourceTargets[0]);
			return true;
		}
	}
	return false;
}

function Build(_creep)
{
	var constructionTargets = _creep.room.find(FIND_CONSTRUCTION_SITES);
	if(constructionTargets.length > 0)
	{
		_creep.say("Building");
		Services.Build(_creep);
		return true;
	}
	return false;
}

function Upgrade(_creep)
{
    if(!_creep.memory.upgrading && _creep.store.getFreeCapacity() == 0)
	{
		_creep.say("Upgrading");
        Services.Upgrade(_creep);
		return true;
    }
	return false;
}

function Repair(_creep)
{
	if(!_creep.memory.repairing && _creep.store.getFreeCapacity() == 0)
	{
		_creep.say("Repairing");
		Services.Repair(_creep);
		return true;
	}
	return false;
}

module.exports.Create = function(_config, _spawn)
{
	if( Game.spawns[_spawn].spawning )
        return;

    var vBigCreeps = _.filter(Game.creeps, {memory:{role:_config.Role, size:"big"}});
    console.log(_config.Role+"s: Count: "+vBigCreeps.length+" BigMax: "+_config.BigMax);
    if( _config.BigBody && (Game.spawns[_spawn].store.getUsedCapacity(RESOURCE_ENERGY) > CalculateCost(_config.BigBody)) && (vBigCreeps.length < _config.BigMax) )
    {
        var name = _config.Role+Game.time;
        console.log("Spawning: "+name+" - Cost: "+CalculateCost(_config.BigBody));
        Game.spawns[_spawn].spawnCreep(_config.BigBody, name);
        Game.creeps[name].memory = { role:_config.Role, size:"big", priorities:_config.Priorities };
    }

    var vSmallCreeps = _.filter(Game.creeps, {memory:{role:_config.Role, size:"small"}});
    console.log(_config.Role+"s: Count: "+vSmallCreeps.length+" SmallMax: "+_config.SmallMax);
    if( _config.SmallBody && (Game.spawns[_spawn].store.getUsedCapacity(RESOURCE_ENERGY) > CalculateCost(_config.SmallBody)) && (vSmallCreeps.length < _config.SmallMax) )
    {
        var name = _config.Role+Game.time;
        console.log("Spawning: "+name+" - Cost: "+CalculateCost(_config.SmallBody));
        Game.spawns[_spawn].spawnCreep(_config.SmallBody, name);
        Game.creeps[name].memory = { role:_config.Role, size:"small", priorities:_config.Priorities };
    }
};

module.exports.Update = function(_creep)
{
	for(var prioIdx = 0; prioIdx < _creep.memory.priorities.length; prioIdx++)
	{
		let priority = _creep.memory.priorities[prioIdx];
		switch(priority)
		{
			case ServiceCreepConfig.PRIORITY_BUILD:
				if(Build(_creep) === true)
				{
					return;
				}
				break;
			case ServiceCreepConfig.PRIORITY_HARVEST:
				if(Harvest(_creep) === true)
				{
					return;
				}
				break;
			case ServiceCreepConfig.PRIORITY_REPAIR:
				if(Repair(_creep) === true)
				{
					return;
				}
				break;
			case ServiceCreepConfig.PRIORITY_UPGRADE:
				if(Upgrade(_creep) === true)
				{
					return;
				}
				break;
		}
	}
};
