var PostCreatedJob = null;
var PostJobAssigned = null;
var PostPerptualJobAssigned = null;

var Utilities = require('utilities');
var Services = require('role.service.actions');

function Log(_string){
	if(Memory.ResourceArbiterLogging)
	{
		console.log("[ResourceArbiter]: " + _string);
	}
}

function Initialise() {
	Memory.ResourceJobs = [];
	Memory.ResourcePoints = Utilities.GetResourcePoints(Game.spawns["Spawn1"].room);
	Memory.ResourceArbiterDebug = false;
	Memory.ResourceArbiterLogging = false;
}

function AssignCreepToJob(_creep, _jobId) {
	let found = Memory.ResourceJobs.find(element => element.Id == _jobId);
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

function Update() {
	if(Memory.ResourceArbiterDebug)
	{
		for(let i = 0; i < Memory.ResourcePoints.length; i++){
			if(Memory.ResourcePoints[i].AssignedCreeps.length > 0){
				Log("Resource: " + Memory.ResourcePoints[i].ResourceId);
				for(let j = 0; j < Memory.ResourcePoints[i].AssignedCreeps.length; j++){
					Log("\tCreep: " + Memory.ResourcePoints[i].AssignedCreeps[j]);
				}
			}
		}
	}

	// Perpetual Job
	let found = Memory.ResourceJobs.find(element => element.Id == "Harvesting");
	if(found == null) {
		var job = {
			Id:"Harvesting",
			Type:"Harvester",
			Assignees: []
		};

		Memory.ResourceJobs.push(job);
		PostCreatedJob(job.Id, job.Type);
	}
}

function NotifyDeath(_creepName) {
	let found = Memory.ResourceJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assignees.splice(found.Assignees.indexOf(_creepName), 1);
		Log("Notification of Death of " + _creepName + ": Room for one more!");
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
