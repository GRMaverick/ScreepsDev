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
	if(_creep.spawning || !_creep.memory.job)
	{
		return;
	}

	if(_creep.memory.job.Type == "Construction")
	{
		if(_creep.memory.building && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.building = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.building && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.building = true;
			_creep.say('⚡ upgrade');
		}

		if(_creep.memory.building)
		{
			Services.Build(_creep);
		}
		else
		{
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Harvest")
	{
		if(_creep.store.getFreeCapacity() == 0)
		{
			Services.Deliver(_creep);
		}
		else
		{
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Upgrade")
	{
		if(_creep.memory.upgrading && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.upgrading = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.upgrading && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.upgrading = true;
			_creep.say('⚡ upgrade');
		}

		if(_creep.memory.upgrading)
		{
			Services.Upgrade(_creep);
		}
		else
		{
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Repair")
	{
		if(_creep.memory.repairing && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.repairing = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.repairing && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.repairing = true;
			_creep.say('⚡ repair');
		}

		if(_creep.memory.repairing)
		{
			Services.Repair(_creep);
		}
		else
		{
			Services.Harvest(_creep);
		}
	}
};
