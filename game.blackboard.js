var ServiceCreep = require('role.service.creep');
var Tasks = require('role.service.actions');
var ServiceCreepConfig = require('role.service.config');
var Utilities = require('utilities');

var ArchitectArbiter = require('arbiter.architect');

function Log(_string){
	if(Memory.BlackboardLogging)
	{
		console.log("[Blackboard]: " + _string);
	}
}

function RoadEndToEnd(_startNode, _endNode) {
	var result = Utilities.PathEndToEnd(_startNode, _endNode);
	var results = result.path.length;
	while(results--) {
		let node = result.path[results];
		let error = Game.rooms.sim.createConstructionSite(node.x, node.y, STRUCTURE_ROAD);
		if(error != OK) {
			Utilities.LogError("[RoadConstruction]", error);
		}
	}
}

function ClearDead() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Log('Clearing non-existing creep memory:', name);
        }
    }
}

function GenerateRoadNetwork() {
    
}

module.exports.Initialise = function() {
    if(Memory.BlackboardInitialised != null && Memory.BlackboardInitialised == true) {
		return true;
	}
	
	Memory.ResourcePoints = Utilities.GetResourcePoints(Game.spawns["Spawn1"].room);
	Memory.SpawnLogging = false;
	Memory.BlackboardLogging = false;
	
	GenerateRoadNetwork();
	
	ArchitectArbiter.Initialise();
	
	Memory.BlackboardInitialised = true;
};

module.exports.Update = function() {
	ArchitectArbiter.Update();
	
    ClearDead();
    SpawnCreeps();
    DistributeJobs();
    
    UpdateCreeps();
};

function GetBestResourcePoint(){
    for(let i = 0; i < Memory.ResourcePoints.length; i++){
        
    }
}

function GenerateHarvestingWork(_creep) {
    Log("Generate Harvesting Work!");
    var task = new Tasks.HarvestTask(Memory.ResourcePoints[0].ResourceId);
    _creep.memory.tasks.push(task);
}
function GenerateConstructionJob(_creep){
    Log("Generate Construction Work!");
    if(Memory.ConstructionJobs.length > 0){
        var task = new Tasks.BuildTask(Memory.ConstructionJobs[0].ConstructionSiteId);
        _creep.memory.tasks.push(task);
    }
}
function GenerateRepairJob(_creep){
    Log("Generate Repairing Work!");
    if(Memory.RepairJobs.length > 0){
        var task = new Tasks.RepairTask(Memory.RepairJobs[0].StructureId);
        _creep.memory.tasks.push(task);
    }
}
function GenerateDeliveryJob(_creep, _target){
    Log("Generate Delivery Work!" + _target);
    var task = new Tasks.DeliverTask(_target);
    _creep.memory.tasks.push(task);
}
function GenerateUpgradeJob(_creep){
    var task = new Tasks.UpgradeTask(Game.spawns["Spawn1"].room.controller.id);
    _creep.memory.tasks.push(task);
}

function DistributeJobs() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.tasks == null)  {
            continue;
        }
        
        if(creep.memory.tasks.length == 0) {
            Log(name + " is unemployed");
            if(creep.store.getFreeCapacity() > 0) {
                GenerateHarvestingWork(creep);
            }
            else {
                // Check for pop count
                if(Game.creeps.length > 4) {
                    // high
                    if(Memory.ConstructionJobs.length > 0) {
                        // Check for construction
                        GenerateConstructionJob(creep);
                        continue;
                    }
                    else if(Memory.RepairJobs.length > 0) {
                        // Check for repair
                        GenerateRepairJob(creep);
                        continue;
                    }
                    else {
                        // Check for maxed storage// low
                    	let resourceTargets = creep.room.find(FIND_STRUCTURES, {
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
                    	
                    	if(resourceTargets.length > 0) {
                    	    GenerateDeliveryJob(creep, resourceTargets[0].id);  
                            continue;
                    	}
                    	else {
                    	    Log("No Delivery Target");
                    	}
                    }
                }
                else {
                    // low
                	let resourceTargets = creep.room.find(FIND_STRUCTURES, {
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
                	
                	if(resourceTargets.length > 0) {
                	    GenerateDeliveryJob(creep, resourceTargets[0].id); 
                        continue; 
                	}
                	else {
                        if(Memory.ConstructionJobs.length > 0) {
                            // Check for construction
                            GenerateConstructionJob(creep);
                            continue;
                        }
                        else if(Memory.RepairJobs.length > 0) {
                            // Check for repair
                            GenerateRepairJob(creep);
                            continue;
                        }
                	}
                }

                // Upgrade
                GenerateUpgradeJob(creep);
                continue;
            }
        }
    }
}

function SpawnCreeps() {
	if(ServiceCreep.Create(ServiceCreepConfig.Handyman, "Spawn1") === true) {
		return;
	}
}

function UpdateCreeps() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
		let bAdvance = ServiceCreep.Update(creep);
        if(bAdvance) {
            creep.memory.tasks.pop();
        }
    }
}
