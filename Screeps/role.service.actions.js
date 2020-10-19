var Utilities = require('utilities');

module.exports.Build = function(_creep) {
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
	let jobData = _creep.memory.job;

	let target = Game.getObjectById(jobData.DeliveryPoint);
	let result = _creep.transfer(target, RESOURCE_ENERGY);
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) {
		Utilities.LogError("[Deliver]", result);
		return false;
	}
};

module.exports.Harvest = function(_creep) {
	let jobData = _creep.memory.job;
	let targetResource = _creep.memory.job.ResourcePoints.find(element =>
		element.AssignedCreeps.length < 8);
	let target = Game.getObjectById(targetResource.ResourceId);

	let result = _creep.harvest(target);
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return true;
	}
	else if(result != OK) {
		Utilities.LogError("[Harvest]", result);
		return false;
	}
};

module.exports.Repair = function(_creep, _data) {
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
