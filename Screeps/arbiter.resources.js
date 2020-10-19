var PostCreatedJob = null;
var PostJobAssigned = null;
var PostPerptualJobAssigned = null;

var Utilities = require('utilities');
var Services = require('role.service.actions');

function Initialise() {
	Memory.ResourceJobs = [];
}

function AssignCreepToJob(_creep, _jobId) {
	let found = Memory.ResourceJobs.find(element => element.Id == _jobId);
	if(found != null) {
		_creep.memory.job = found;
		found.Assignees.push(_creep.name);
		console.log("[ResourceArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
		PostPerptualJobAssigned(_creep, found.Id, found.Type);
	}
	else{
		console.log("[ResourceArbiter]: Job does not exist: "+_jobId);
	}
}

function Update() {
	// Perpetual Job
	let found = Memory.ResourceJobs.find(element => element.Id == "Harvesting");
	if(found == null) {
		var job = {
			Id:"Harvesting",
			Type:"Harvester",
			Assignees: [],
			DeliveryPoint: Game.spawns["Spawn1"].id,
			ResourcePoints: Utilities.GetResourcePoints(Game.spawns["Spawn1"].room),
		};

		Memory.ResourceJobs.push(job);
		PostCreatedJob(job.Id, job.Type);
	}
}

function NotifyDeath(_creepName) {
	let found = Memory.ResourceJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assignees.splice(found.Assignees.indexOf(_creepName), 1);
		console.log("[ResourceArbiter]: Notification of Death of " + _creepName + ": Room for one more!");
	}
}

function OnJobCreated(_callback) {
	PostCreatedJob = _callback;
}

function OnJobAssigned(_callback) {
	PostJobAssigned = _callback;
}

function OnPerpetualJobAssigned(_callback) {
	PostPerptualJobAssigned = _callback;
}

module.exports.Initialise = Initialise;
module.exports.Update = Update;
module.exports.AssignCreepToJob = AssignCreepToJob;

module.exports.NotifyDeath = NotifyDeath;
module.exports.OnJobCreated = OnJobCreated;
module.exports.OnJobAssigned = OnJobAssigned;
module.exports.OnPerpetualJobAssigned = OnPerpetualJobAssigned;
