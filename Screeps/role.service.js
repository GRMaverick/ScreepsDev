var HarvestAction = require('action.harvest');
var DeliverAction = require('action.deliver');
var BuildAction = require('action.build');
var SpawnAction = require('action.spawn');
var UpgradeAction = require('action.upgrade');
var RepairAction = require('action.repair');

var ServiceCreepConfig = require('config.role.service');

function Harvest(_creep)
{
	if(_creep.store.getFreeCapacity() > 0)
	{
		_creep.say("Harvesting");
		HarvestAction.run(_creep);
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
			DeliverAction.run(_creep, resourceTargets[0]);
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
		BuildAction.run(_creep);
		return true;
	}
	return false;
}

function Upgrade(_creep)
{
    if(!_creep.memory.upgrading && _creep.store.getFreeCapacity() == 0)
	{
		_creep.say("Upgrading");
        UpgradeAction.run(_creep);
		return true;
    }
	return false;
}

function Repair(_creep)
{
	if(!_creep.memory.repairing && _creep.store.getFreeCapacity() == 0)
	{
		_creep.say("Repairing");
		RepairAction.run(_creep);
		return true;
	}
	return false;
}

module.exports.Create = function(_config)
{
	SpawnAction(_config, "Spawn1");
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
