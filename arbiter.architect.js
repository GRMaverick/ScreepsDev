var Utilities = require('utilities');
var Services = require('role.service.actions');

function Log(_string){
	if(Memory.ArchitectArbiterLogging)
	{
		console.log("[ArchitectArbiter]: " + _string);
	}
}

module.exports.NotifyDeath = function(_creepName){
	let found = Memory.ConstructionJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assigned = false;
		found.Assignee = null;
		Log("Notification of Death of " + _creepName + ": Reposting old job!");
		PostCreatedJob(found.Id, found.Type);
	}
}

module.exports.Initialise = function() {
	Memory.ConstructionJobs = [];
	Memory.RepairJobs = [];
	Memory.ArchitectArbiterLogging = false;
}

var PostCreatedJob = null;
var PostJobAssigned = null;
var PostPerptualJobAssigned = null;

module.exports.OnJobCreated = function(_callback) {
	PostCreatedJob = _callback;
}
module.exports.OnJobAssigned = function(_callback) {
	PostJobAssigned = _callback;
}
module.exports.OnPerpetualJobAssigned = function(_callback) {
	PostPerptualJobAssigned = _callback;
}

module.exports.AssignCreepToJob = function(_creep, _jobId) {
	// TODO: check for Repairer v Builder
	let found = Memory.ConstructionJobs.find(element => element.Id == _jobId);
	if(found != null) {
		if(found.Assigned) {
			Log("Job is already assigned: " + _jobId);
		}
		else{
			found.Assigned = true;
			found.Assignee = _creep.name;
			_creep.memory.job = found;
			Log("Resource Job Assigned: " + found.Assignee + " " + found.Id);
			PostJobAssigned(_creep, found.Id, found.Type);
		}
	}
	else{
		Log("Job does not exist: " + _jobId);
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
						Log("Job Completed: " + builders[idx].name + " - " + builders[idx].memory.job.Id);
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
						Log("Job Completed: " + creeps[idx].name + " - " + creeps[idx].memory.job.Id);
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
