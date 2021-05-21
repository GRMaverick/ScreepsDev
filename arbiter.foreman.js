var ServiceCreep = require('role.service.creep');
var Tasks = require('role.service.actions');

function Log(_string) {
	if(Memory.LogForeman) {
		console.log("[Foreman]: " + _string);
	}
}

function FindStoragePoint(_creep) {
    return _creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_CONTAINER ||
					structure.structureType == STRUCTURE_STORAGE ||
					structure.structureType == STRUCTURE_TOWER) &&
			   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
		}
	});
}

function GenerateHarvestTask(_creep) {
    Log("Generate Harvesting Work!");
    var task = new Tasks.HarvestTask(Memory.ResourcePoints[0].ResourceId);
    _creep.memory.tasks.push(task);
}

function AssignConstructionTask(_creep) {
    Log("Assign Construction Work!");
    if(Memory.ConstructionJobs.length > 0) {
        Log("Task: "+Memory.ConstructionJobs[0].ConstructionSiteId);
        var task = new Tasks.BuildTask(Memory.ConstructionJobs[0].ConstructionSiteId);
        _creep.memory.tasks.push(task);
    }
}

function AssignRepairTask(_creep) {
    Log("Assign Repairing Work!");
    if(Memory.RepairJobs.length > 0) {
        var task = new Tasks.RepairTask(Memory.RepairJobs[0].StructureId);
        _creep.memory.tasks.push(task);
    }
}

function GenerateDeliveryTask(_creep, _target) {
    Log("Generate Delivery Work!");
    var task = new Tasks.DeliverTask(_target);
    _creep.memory.tasks.push(task);
}

function GenerateUpgradeTask(_creep) {
    Log("Generate Update Work!");
    var task = new Tasks.UpgradeTask(Game.spawns["Spawn1"].room.controller.id);
    _creep.memory.tasks.push(task);
}

function TaskUpgrader(_creep) {
    if(_creep.store.getFreeCapacity() > 0) {
        GenerateHarvestTask(_creep);
    }
    else {
        GenerateUpgradeTask(_creep);
    }
}

function TaskHandyman(_creep){
    if(_creep.store.getFreeCapacity() > 0) {
        GenerateHarvestTask(_creep);
    }
    else {
        if(Game.creeps.length > 4) {
            if(Memory.ConstructionJobs.length > 0) {
                AssignConstructionTask(_creep);
                return;
            }
            else if(Memory.RepairJobs.length > 0) {
                AssignRepairTask(_creep);
                return;
            }
            else {
            	let resourceTargets = FindStoragePoint(_creep);
            	if(resourceTargets.length > 0) {
            	    GenerateDeliveryTask(_creep, resourceTargets[0].id);  
                    return;
            	}
            	else {
            	    Log("No Delivery Target");
            	}
            }
        }
        else {
            let resourceTargets = FindStoragePoint(_creep);
        	if(resourceTargets.length > 0) {
        	    GenerateDeliveryTask(_creep, resourceTargets[0].id); 
                return; 
        	}
        	else {
                if(Memory.ConstructionJobs.length > 0) {
                    AssignConstructionTask(_creep);
                    return;
                }
                else if(Memory.RepairJobs.length > 0) {
                    AssignRepairTask(_creep);
                    return;
                }
        	}
        }

        GenerateUpgradeTask(_creep);
        return;
    }
}

module.exports.Initialise = function() {
    
};

module.exports.Work = function() {
     for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.tasks == null) {
            continue;
        }
        if(creep.memory.tasks.length == 0) {
            Log(name + " is unemployed");
            switch(creep.memory.role) {
                case 'Handyman': {
                    TaskHandyman(creep);
                    break;
                }
                case 'Upgrader': {
                    TaskUpgrader(creep);
                    break;
                }
            }
        }
        
        let bAdvance = ServiceCreep.Update(creep);
        if(bAdvance) {
            creep.memory.tasks.pop();
        }
    }
};