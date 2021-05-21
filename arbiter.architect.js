var Utilities = require('utilities');
var Services = require('role.service.actions');

function Log(_string){
	if(Memory.LogArchitect)
	{
		console.log("[ArchitectArbiter]: " + _string);
	}
}

function RoadEndToEnd(_startNode, _endNode) {
	var result = Utilities.PathEndToEnd(_startNode, _endNode);
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

function GenerateRoadNetwork() {
    let spawn = Game.spawns["Spawn1"];
    let controller = Game.spawns["Spawn1"].room.controller;
    
    RoadEndToEnd(spawn, { pos: controller.pos, range:0});
    RoadEndToEnd(spawn, { pos: Game.getObjectById(Memory.ResourcePoints[0].ResourceId).pos, range:0});
    //RoadEndToEnd(spawn, { pos: Game.getObjectById(Memory.ResourcePoints[1].ResourceId).pos, range:0});
}

module.exports.Initialise = function() {
	Memory.ConstructionJobs = [];
	Memory.RepairJobs = [];
	
	GenerateRoadNetwork();
	
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
