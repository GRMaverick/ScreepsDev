var Utilities = require('utilities');
var Services = require('role.service.actions');

function Log(_string){
	if(Memory.ControllerArbiterLogging)
	{
		console.log("[ControllerArbiter]: " + _string);
	}
}

module.exports.NotifyDeath = function(_creepName) {
	let found = Memory.ControllerJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assignees.splice(found.Assignees.indexOf(_creepName), 1);
		Log("Notification of Death of " + _creepName + ": Room for one more!");
	}
}

module.exports.Initialise = function() {
	Memory.ControllerJobs = [];
	Memory.ControllerArbiterLogging = false;
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

	let found = Memory.ControllerJobs.find(element => element.Id == _jobId);
	if(found != null) {
		_creep.memory.job = found;
		found.Assignees.push(_creep.name);
		Log("Resource Job Assigned: "+found.Assignee+" "+found.Id);
		PostPerptualJobAssigned(_creep, found.Id, found.Type);
	}
	else{
		Log("[ResourceArbiter]: Job does not exist: "+_jobId);
	}
}

module.exports.Update = function() {
	// Perpetual Job
	let found = Memory.ControllerJobs.find(element => element.Id == "Upgrading");
	if(found == null) {
		var job = {
			Id:"Upgrading",
			Type:"Upgrader",
			ControllerId: Game.spawns["Spawn1"].room.controller.id,
			Assignees: []
		};

		Memory.ControllerJobs.push(job);
		PostCreatedJob(job.Id, job.Type);
	}
}
