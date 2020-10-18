var Services = require('role.service.actions');

module.exports.NotifyDeath = function(_creepName) {
	let found = Memory.ControllerJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function() {
	Memory.ControllerJobs = [];
}

var PostCreatedJob = null;
module.exports.OnJobCreated = function(_callback)
{
	PostCreatedJob = _callback;
}

module.exports.AssignCreepToJob = function(_creep) {
	let found = Memory.ControllerJobs.find(element => element.Assigned == false);
	if(found != null) {
		found.Assigned = true;
		found.Assignee = _creep.name;
		_creep.memory.job = found;
		console.log("[ControllerArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
		return;
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
				Type:"Upgrade",
				Assigned: false,
				ResourceId: closestResourceId,
				ControllerId: Game.spawns["Spawn1"].room.controller.id,
			};
			Memory.ControllerJobs.push(job);
			PostCreatedJob(job.Id, job.Type);
		}
	}
}
