var Utilities = require('utilities');
var Services = require('role.service.actions');

function Log(_string){
	if(Memory.LogArchitect)
	{
		console.log("[Architect]: " + _string);
	}
}

function RoadEndToEnd(_startNode, _endNode) {
	var result = Utilities.PathEndToEnd(_startNode, _endNode);
	if(result.incomplete == true){
	    Log("Pathing Failed");
	    return null;
	}
	
	var results = result.path.length;
	Log("Path Results: " + results);
	while(results--) {
		let node = result.path[results];
		let error = Game.rooms.sim.createConstructionSite(node.x, node.y, STRUCTURE_ROAD);
		if(error != OK) {
			Utilities.LogError("[RoadConstruction]", error);
		}
	}
}
function RoadAround(_node) {
    for(let j = _node.x - 1; j != _node.x + 2; j++) {
        for(let k = _node.y - 1; k != _node.y + 2; k++) {
            if(j == _node.x && k == _node.y) {
               continue;
            }
            let error = Game.rooms.sim.createConstructionSite(j, k, STRUCTURE_ROAD);
            if(error != OK) {
		        Utilities.LogError("[RoadConstruction]", error);
	        }
        }
    }
}

function GenerateRoadNetwork() {
    let spawn = Game.spawns["Spawn1"];
    let controller = Game.spawns["Spawn1"].room.controller;
    
    let rpPos = Game.getObjectById(Memory.ResourcePoints[0].ResourceId).pos;
    
    for(let i = 0; i < Memory.ResourcePoints.length; i++) {
    let rpPos = Game.getObjectById(Memory.ResourcePoints[i].ResourceId).pos;
        //RoadAround(rpPos);
        RoadEndToEnd(spawn, { pos: rpPos, range:1});
    }
    RoadEndToEnd(spawn, { pos: controller.pos, range:1});
}

module.exports.Initialise = function() {
	Memory.ConstructionJobs = [];
	Memory.RepairJobs = [];
	
	//GenerateRoadNetwork();
	
	return true;
}

module.exports.Update = function() {
	UpdateConstructionJobs();
	UpdateRepairJobs();
}

function UpdateConstructionJobs() {
	let constructionSites = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES);
	// Clear Completed Jobs
    Memory.ConstructionJobs = [];

	// Add New Jobs
	for(let idx = 0; idx < constructionSites.length; idx++){
		let site = constructionSites[idx];
		let found = Memory.ConstructionJobs.find(element => element.Id == "ConstructionSite_"+site.id);
		if(found == null) {
			var job = {
				Id: "ConstructionSite_"+site.id,
				Type: "Builder",
				Assigned: false,
				Assignee: null,
				ConstructionSiteId: site.id,
				ResourcePoints: Utilities.GetResourcePoints(Game.spawns["Spawn1"].room),
			};
			Memory.ConstructionJobs.push(job);
		}
	}
}

function UpdateRepairJobs()
{
	let structures = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES);

	// Clear Completed Jobs
    Memory.RepairJobs = [];

	// Add New Jobs
	const kRepairThreshold = 0.5;
	for(let idx = 0; idx < structures.length; idx++) {
		let structure = structures[idx];
		let found = Memory.RepairJobs.find(element => element.Id == "Repair_"+structure.id);
		if(found == null && structure.hits <= (structure.hitsMax * kRepairThreshold)) {
			var job = {
				Id: "Repair_"+structure.id,
				Type: "Repairer",
				Assigned: false,
				Assignee: null,
				StructureId: structure.id,
				ResourcePoints: Utilities.GetResourcePoints(Game.spawns["Spawn1"].room),
			};
			Memory.RepairJobs.push(job);
		}
	}
}
