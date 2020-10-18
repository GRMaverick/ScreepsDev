var Services = require('role.service.actions');
var ServiceCreepConfig = require('role.service.config');
var Utilities = require('utilities');

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

function GetBestBodyParts(_energy)
{
	let totalParts = Math.floor(_energy / CalculateCost([WORK, MOVE, CARRY]));
	var body = [];
	for(let i = 0; i < totalParts; i++)
	{
		body.push(WORK);
	}
	for(let i = 0; i < totalParts; i++)
	{
		body.push(CARRY);
	}
	for(let i = 0; i < totalParts; i++)
	{
		body.push(MOVE);
	}
	return body;
}

module.exports.Create = function(_config, _spawn)
{
	if( Game.spawns[_spawn].spawning )
        return true;

	let maxEnergyAvailable = Game.spawns[_spawn].store.getCapacity(RESOURCE_ENERGY);
	var creepCount = _.sum( Game.creeps, { memory: { role: _config.Role } } );
	if(creepCount < _config.Min)
	{
		// Attempt Biggest boy
	    let name = _config.Role+Game.time;
		let targetBody = GetBestBodyParts(maxEnergyAvailable);
		let error = Game.spawns[_spawn].spawnCreep(targetBody, name);
		if(error == OK)
		{
			Game.creeps[name].memory = { role:_config.Role };
		    console.log("Spawning: " + name + " - Cost: " + CalculateCost(targetBody) + " - Body: " + targetBody.toString());
			return true;
		}
		else if(error == ERR_NOT_ENOUGH_ENERGY)
		{
			// Attempt Default boy on Harvester role
			if(_config.Role == "Harvester")
			{
				let energyAvailable = Game.spawns[_spawn].store.getUsedCapacity();
				let defaultCost = CalculateCost(_config.DefaultBody);
				if(energyAvailable > defaultCost)
				{
					Game.spawns[_spawn].spawnCreep(_config.DefaultBody, name);
				    Game.creeps[name].memory = { role:_config.Role };
				    console.log("Spawning: " + name + " - Cost: " + defaultCost + " - Body: " + _config.DefaultBody.toString());
					return true;
				}
			}
		}
		else
		{
			Utilities.LogError("[Spawn]", error);
		}
	}

	return false;
};

module.exports.Update = function(_creep)
{
	return;

	let task = 0;
	if(_creep.memory.tasks.length > 0)
	{
		task = _creep.memory.tasks[_creep.memory.tasks.length-1];
	}

	// Pop Task
	switch(task.id)
	{
		case ServiceCreepConfig.PRIORITY_BUILD:
		{
			let targets = _creep.room.find(FIND_CONSTRUCTION_SITES);
			let target = targets.find(element => element.id == task.data.targetId);
			if(_creep.store.getUsedCapacity() == 0 || targets.length == 0 || target === "undefined")
			{
				delete _creep.memory.tasks[_creep.memory.tasks.length];
				_creep.memory.tasks.pop();
			}
			break;
		}
		case ServiceCreepConfig.PRIORITY_HARVEST:
			if(_creep.store.getFreeCapacity() == 0)
			{
				delete _creep.memory.tasks[_creep.memory.tasks.length];
				_creep.memory.tasks.pop();
			}
			break;
		case ServiceCreepConfig.PRIORITY_REPAIR:
			break;
		case ServiceCreepConfig.PRIORITY_UPGRADE:
			if(_creep.store.getUsedCapacity() == 0)
			{
				delete _creep.memory.tasks[_creep.memory.tasks.length];
				_creep.memory.tasks.pop();
			}
			break;
		case ServiceCreepConfig.PRIORITY_DELIVER:
		{
			let targets = _creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
					   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});

			if(_creep.store.getUsedCapacity() == 0 || targets.length == 0)
			{
				delete _creep.memory.tasks[_creep.memory.tasks.length];
				_creep.memory.tasks.pop();
			}
			break;
		}
	}

	// Push Task
	let bTaskAdded = false;
	for(var prioIdx = 0; prioIdx < _creep.memory.priorities.length; prioIdx++)
	{
		switch(_creep.memory.priorities[prioIdx])
		{
			case ServiceCreepConfig.PRIORITY_BUILD:
			{
				let targets = _creep.room.find(FIND_CONSTRUCTION_SITES);
				if(task.id != ServiceCreepConfig.PRIORITY_BUILD && _creep.store.getFreeCapacity() == 0 && targets.length != 0)
				{
					var taskdata = {
						id: ServiceCreepConfig.PRIORITY_BUILD,
						data: {
							targetId: targets[0].id
						}
					};

					bTaskAdded = true;
					_creep.say("Building");
					_creep.memory.tasks.push(taskdata);
				}
				break;
			}
			case ServiceCreepConfig.PRIORITY_HARVEST:
			{
				let targets = _creep.room.find(FIND_SOURCES);
				if(task.id != ServiceCreepConfig.PRIORITY_HARVEST && _creep.store.getUsedCapacity() == 0 && targets.length != 0)
				{
					var taskdata = {
						id: ServiceCreepConfig.PRIORITY_HARVEST,
						data: {
							targetId: targets[0].id
						}
					};

					bTaskAdded = true;
					_creep.say("Harvesting");
					_creep.memory.tasks.push(taskdata);
				}
				break;
			}
			case ServiceCreepConfig.PRIORITY_DELIVER:
			{
				let targets = _creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
						   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});

				if(task.id != ServiceCreepConfig.PRIORITY_DELIVER && _creep.store.getFreeCapacity() == 0 && targets.length != 0)
				{
					var taskdata = {
						id: ServiceCreepConfig.PRIORITY_DELIVER,
						data: {
							targetId: targets[0].id
						}
					};

					bTaskAdded = true;
					_creep.say("Delivering");
					_creep.memory.tasks.push(taskdata);
				}
				break;
			}
			case ServiceCreepConfig.PRIORITY_UPGRADE:
			{
				let targets = [];
				if(_creep.memory.role != 'Upgrader')
				{
					targets = _creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
							   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					});
				}

				if(task.id != ServiceCreepConfig.PRIORITY_UPGRADE && _creep.store.getFreeCapacity() == 0 && targets.length == 0)
				{
					var taskdata = {
						id: ServiceCreepConfig.PRIORITY_UPGRADE,
						data: {
							targetId: _creep.room.controller.id
						}
					};

					bTaskAdded = true;
					_creep.say("Upgrading");
					_creep.memory.tasks.push(taskdata);
				}
				break;
			}
			case ServiceCreepConfig.PRIORITY_REPAIR:
			{
				break;
			}
		}

		if(bTaskAdded === true)
		{
			break;
		}
	}

	// Perform Task
	if(_creep.memory.tasks.length > 0)
	{
		task = _creep.memory.tasks[_creep.memory.tasks.length-1];
	}

	if(task === "undefined")
	{
		_creep.say("No Task Assigned");
		return;
	}

	switch(task.id)
	{
		case ServiceCreepConfig.PRIORITY_BUILD:
			Services.Build(_creep, task.data);
			break;
		case ServiceCreepConfig.PRIORITY_HARVEST:
			Services.Harvest(_creep, task.data);
			break;
		case ServiceCreepConfig.PRIORITY_REPAIR:
			Services.Repair(_creep, task.data);
			break;
		case ServiceCreepConfig.PRIORITY_UPGRADE:
	        Services.Upgrade(_creep, task.data);
			break;
		case ServiceCreepConfig.PRIORITY_DELIVER:
			Services.Deliver(_creep, task.data);
			break;
	}
};
