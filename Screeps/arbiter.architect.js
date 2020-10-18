var Services = require('role.service.actions');

module.exports.NotifyDeath = function(_creepName){
	let found = Memory.ConstructionJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function() {
	Memory.ConstructionJobs = [];
	Memory.RepairJobs = [];
}

var PostCreatedJob = null;
module.exports.OnJobCreated = function(_callback)
{
	PostCreatedJob = _callback;
}

module.exports.AssignCreepToJob = function(_creep) {
	let found = Memory.ConstructionJobs.find(element => element.Assigned == false);
	if(found != null) {
		found.Assigned = true;
		found.Assignee = _creep.name;
		_creep.memory.job = found;
		console.log("[ArchitectArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
		return;
	}
}

module.exports.Update = function() {
	UpdateConstructionJobs();
	UpdateRepairJobs();
}

function UpdateConstructionJobs() {
	let constructionSites = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES);
	// Clear Completed Jobs
	var builders = _.filter(Game.creeps, { memory: { role:"Builder"} });
	for(let idx = 0; idx < builders.length; idx++) {
		if(builders[idx].memory.job == undefined) {
			continue;
		}
		let found = constructionSites.find(element => element.id == builders[idx].memory.job.ConstructionSiteId);
		if(found == null) {
			for(let jdx = 0; jdx < Memory.ConstructionJobs.length; jdx++) {
				if(builders[idx].memory.job != undefined) {
					if(Memory.ConstructionJobs[jdx].ConstructionSiteId == builders[idx].memory.job.ConstructionSiteId) {
						console.log("[ArchitectArbiter]: Job Completed: " + builders[idx].name + " - " + builders[idx].memory.job.Id);
						delete builders[idx].memory.job;
						Memory.ConstructionJobs.splice(jdx, 1);
					}
				}
			}
		}
	}

	// Add New Jobs
	for(let idx = 0; idx < constructionSites.length; idx++){
		let site = constructionSites[idx];
		let found = Memory.ConstructionJobs.find(element => element.Id == "ConstructionSite_"+site.id);
		if(found == null) {
			var closestResourceId = site.pos.findClosestByPath(FIND_SOURCES).id;
			var job = {
				Id: "ConstructionSite_"+site.id,
				Type: "Construction",
				Assigned: false,
				Assignee: null,
				ConstructionSiteId: site.id,
				ResourceId: closestResourceId
			};
			Memory.ConstructionJobs.push(job);
			PostCreatedJob(job.Id, job.Type);
		}
	}
}

function UpdateRepairJobs()
{
	let structures = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES);

	// Clear Completed Jobs
	var creeps = _.filter(Game.creeps, { memory: { role:"Repairer"} });
	for(let idx = 0; idx < creeps.length; idx++) {
		if(creeps[idx].memory.job == undefined) {
			continue;
		}

		let found = structures.find(element => element.id == creeps[idx].memory.job.StructureId);
		if(found == null) {
			for(let jdx = 0; jdx < Memory.RepairJobs.length; jdx++) {
				if(creeps[idx].memory.job != undefined) {
					if(Memory.RepairJobs[jdx].StructureId == creeps[idx].memory.job.StructureId) {
						console.log("[ArchitectArbiter]: Job Completed: " + creeps[idx].name + " - " + creeps[idx].memory.job.Id);
						delete creeps[idx].memory.job;
						Memory.RepairJobs.splice(jdx, 1);
					}
				}
			}
		}
	}

	// Add New Jobs
	const kRepairThreshold = 0.5;
	for(let idx = 0; idx < structures.length; idx++) {
		let structure = structures[idx];
		let found = Memory.RepairJobs.find(element => element.Id == "Repair_"+structure.id);
		if(found == null && structure.hits <= (structure.hitsMax * kRepairThreshold)) {
			var closestResourceId = structure.pos.findClosestByPath(FIND_SOURCES).id;
			var job = {
				Id: "Repair_"+structure.id,
				Type: "Repair",
				Assigned: false,
				Assignee: null,
				StructureId: structure.id,
				ResourceId: closestResourceId
			};
			Memory.RepairJobs.push(job);
			PostCreatedJob(job.Id, job.Type);
		}
	}
}
