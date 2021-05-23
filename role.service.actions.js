//
// Definition of Creep Tasks
//  Each task will return a boolean as to determine if the task is finished (true)
//  or if the task is on going (false).
//

var Utilities = require('utilities');

function Log(_string){
	if(Memory.LogActions) {
		console.log("[Creep.Tasks]: " + _string);
	}
}

//
// Build
//
module.exports.BuildTask = function(_target){
    this.Type = "Build";
    this.Target = _target;
}

module.exports.Build = function(_creep, _data) {
    if(_creep.store.getCapacity() == 0){
	    Log("Expended Energy!");
	    return true;
    }
    
	let target = Game.getObjectById(_data.Target);
	let result = _creep.build(target);
	if(result == OK){
	    Log("Building..");
	    return false;
	}
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return false;
	}
	else {
		Utilities.LogError("[Build]", result);
		return true;
	}
};

//
// Repair
//
module.exports.RepairTask = function(_target){
    this.Type = "Repair";
    this.Target = _target;
}

module.exports.Repair = function(_creep, _data) {
    if(_creep.store.getCapacity() == 0){
	    Log("Expended Energy!");
	    return true;
    }
    
	let target = Game.getObjectById(_data.Target);
	let result = _creep.repair(target);
	if(result == OK){
	    Log("Repairing..");
	    return false;
	}
	if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return false;
	}
	else {
		Utilities.LogError("[Build]", result);
		return true;
	}
};

//
// Upgrade
//
module.exports.UpgradeTask = function(_target){
    this.Type = "Upgrade";
    this.Target = _target;
}

module.exports.Upgrade = function(_creep, _data) {
	let target = Game.getObjectById(_data.Target);
	let result = _creep.upgradeController(target);
	if(_creep.store.getCapacity() == 0) {
	    Log("Expended Energy!");
	    return true;
	}
	
	if(result == OK) {
	    return false;
	}
	else if(result === ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return false;
	}
	else {
		Utilities.LogError("[Upgrade]", result);
		return true;
	}
};

//
// Delivery
//
module.exports.DeliverTask = function(_target){
    this.Type = "Deliver";
    this.Target = _target;
}

module.exports.Deliver = function(_creep, _data) {
    let target = Game.getObjectById(_data.Target);
    let result = _creep.transfer(target, RESOURCE_ENERGY);
	if(result == OK) {
	    return true;
	}
	else if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return false;
	}
	else {
		Utilities.LogError("[Deliver]", result);
		return true;
	}
}

//
// Harvest
//
module.exports.HarvestTask = function(_target) {
    this.Type = "Harvest";
    this.Target = _target;
}

module.exports.Harvest = function(_creep, _data) {
    if(_creep.store.getFreeCapacity() == 0)
    {
        Log("Carry Capacity Exceeded");
        return true;
    }
    
    let target = Game.getObjectById(_data.Target);
	let result = _creep.harvest(target);
	if(result == OK) {
	    Log("Harvesting");
		return false;
	}
	else if(result == ERR_NOT_IN_RANGE) {
		_creep.moveTo(target);
		return false;
	}
	else {
		Utilities.LogError("[Harvest]", result);
		return true;
	}
}