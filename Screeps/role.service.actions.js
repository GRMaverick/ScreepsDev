var Utilities = require('utilities');

function UnassignFromResourcePoint(_creep){
	for(let i = 0; i < Memory.ResourcePoints.length; i++){
		let found = Memory.ResourcePoints[i].AssignedCreeps.find(element => element == _creep.name);
		if(found != null && found != undefined){
			//debugger;
			Memory.ResourcePoints[i].AssignedCreeps.splice(found, 1);
		}
	}
}

module.exports.Build = function(_creep) {
	UnassignFromResourcePoint(_creep);

	let jobData = _creep.memory.job;
	let target = Game.getObjectById(jobData.ConstructionSiteId);
	let result = _creep.build(target);
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) {
		Utilities.LogError("[Build]", result);
		return false;
	}
};

module.exports.Deliver = function(_creep, _data) {
	UnassignFromResourcePoint(_creep);

	let resourceTargets = _creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
			   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
		}
	});

	if(resourceTargets.length > 0)
	{
		let result = _creep.transfer(resourceTargets[0], RESOURCE_ENERGY);
		if(result == ERR_NOT_IN_RANGE) {
			_creep.moveTo(resourceTargets[0]);
			return true;
		}
		else if(result != OK) {
			Utilities.LogError("[Deliver]", result);
			return false;
		}
	}
};

module.exports.Harvest = function(_creep) {
	let jobData = _creep.memory.job;
	let targetResource = Memory.ResourcePoints.find(element => element.AssignedCreeps.length < 8);
	let target = Game.getObjectById(targetResource.ResourceId);
	let result = _creep.harvest(target);
	if(result == ERR_NOT_IN_RANGE) {
		let found = targetResource.AssignedCreeps.find(element => element == _creep.name);
		if(found == null || found == undefined){
			UnassignFromResourcePoint(_creep);
			targetResource.AssignedCreeps.push(_creep.name);
		}
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) {
		Utilities.LogError("[Harvest]", result);
		return false;
	}
};

module.exports.Repair = function(_creep, _data) {
	UnassignFromResourcePoint(_creep);

	let target = Game.getObjectById(_data.targetId);
	let result = _creep.repair(target);
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) 	{
		Utilities.LogError("[Repair]", result);
		return false;
	}
};

module.exports.Upgrade = function(_creep) {
	UnassignFromResourcePoint(_creep);

	let jobData = _creep.memory.job;
	let target = Game.getObjectById(jobData.ControllerId);
	let result = _creep.upgradeController(target);
	if(result === ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) {
		Utilities.LogError("[Upgrade]", result);
		return false;
	}
};
