var Services = require('role.service.actions');
var ServiceCreepConfig = require('role.service.config');
var Utilities = require('utilities');

module.exports.Create = function(_config, _spawn) {
	if( Game.spawns[_spawn].spawning )
        return true;

	let maxEnergyAvailable = Game.spawns[_spawn].room.energyAvailable;
	var creepCount = _.sum( Game.creeps, { memory: { role: _config.Role } } );
	if(creepCount < _config.Min) {
		// Attempt Biggest boy
	    let name = _config.Role+Game.time;
		let targetBody = Utilities.GetBestBodyParts(maxEnergyAvailable);
		let error = Game.spawns[_spawn].spawnCreep(targetBody, name);
		if(error == OK) {
			Game.creeps[name].memory = { role:_config.Role, job:null };
		    console.log("Spawning: " + name + " - Cost: " + Utilities.CalculateCost(targetBody) + " - Body: " + targetBody.toString());
			return true;
		}
		else if(error == ERR_NOT_ENOUGH_ENERGY) {
			// Attempt Default boy on Harvester role
			if(_config.Role == "Harvester") {
				let energyAvailable = Game.spawns[_spawn].store.getUsedCapacity();
				let defaultCost = Utilities.CalculateCost(_config.DefaultBody);
				if(energyAvailable > defaultCost) {
					Game.spawns[_spawn].spawnCreep(_config.DefaultBody, name);
				    Game.creeps[name].memory = { role:_config.Role, job:null };
				    console.log("Spawning: " + name + " - Cost: " + defaultCost + " - Body: " + _config.DefaultBody.toString());
					return true;
				}
			}
		}
		else {
			Utilities.LogError("[Spawn]", error);
		}
	}

	return false;
};

module.exports.Update = function(_creep) {
	if(_creep.spawning || !_creep.memory.job) {
		return;
	}

	if(_creep.memory.job.Type == "Builder") {
		if(_creep.memory.building && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.building = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.building && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.building = true;
			_creep.say('⚡ upgrade');
		}

		if(_creep.memory.building) {
			Services.Build(_creep);
		}
		else {
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Harvester") {
		if(_creep.store.getFreeCapacity() == 0) {
			Services.Deliver(_creep);
		}
		else {
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Upgrader") {
		if(_creep.memory.upgrading && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.upgrading = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.upgrading && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.upgrading = true;
			_creep.say('⚡ upgrade');
		}

		if(_creep.memory.upgrading) {
			Services.Upgrade(_creep);
		}
		else {
			Services.Harvest(_creep);
		}
	}
	else if (_creep.memory.job.Type == "Repairer") {
		if(_creep.memory.repairing && _creep.store[RESOURCE_ENERGY] == 0) {
			_creep.memory.repairing = false;
			_creep.say('🔄 harvest');
		}
		if(!_creep.memory.repairing && _creep.store.getFreeCapacity() == 0) {
			_creep.memory.repairing = true;
			_creep.say('⚡ repair');
		}

		if(_creep.memory.repairing) {
			Services.Repair(_creep);
		}
		else {
			Services.Harvest(_creep);
		}
	}
};
