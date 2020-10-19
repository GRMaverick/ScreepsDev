var Utilities = require('utilities');
var Services = require('role.service.actions');

module.exports.NotifyDeath = function(_creepName) {
	let found = Memory.ControllerJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assigned = false;
		found.Assignee = null;
		console.log("[ControllerArbiter]: Notification of Death of " + _creepName + ": Reposting old job!");
		PostCreatedJob(found.Id, found.Type);
	}
}

module.exports.Initialise = function() {
	Memory.ControllerJobs = [];
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
		if(found.Assigned) {
			console.log("[ControllerArbiter]: Job is already assigned: " + _jobId);
		}
		else{
			found.Assigned = true;
			found.Assignee = _creep.name;
			_creep.memory.job = found;
			console.log("[ControllerArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
			PostJobAssigned(_creep, found.Id, found.Type);
		}
	}
	else{
		console.log("[ControllerArbiter]: Job does not exist: "+_jobId);
	}
}

module.exports.Update = function()
{
	var closestResourceId = Game.spawns["Spawn1"].room.controller.pos.findClosestByPath(FIND_SOURCES).id;
	for(let idx = 0; idx < 3; idx++) {
		let found = Memory.ControllerJobs.find(element => element.Id == "Upgrade"+"_"+idx);
		if(found == null) {
			var job = {
				Id:"Upgrade"+"_"+idx,
				Type:"Upgrader",
				Assigned: false,
				ControllerId: Game.spawns["Spawn1"].room.controller.id,
				ResourcePoints: Utilities.GetResourcePoints(Game.spawns["Spawn1"].room),
			};
			Memory.ControllerJobs.push(job);
			PostCreatedJob(job.Id, job.Type);
		}
	}
}
