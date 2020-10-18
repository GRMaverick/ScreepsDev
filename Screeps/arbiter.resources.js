var aResourcePoints = [];

var Services = require('role.service.actions');

function GetAccessPoints(_resource) {
	var position = _resource.pos;
	const found = _resource.room.lookForAtArea(LOOK_TERRAIN,
		position.y-1, position.x-1,
		position.y+1, position.x+1,
		true
	);

	var aps = [];
	for(var idx = 0; idx < found.length; idx++) {
		if(found[idx].type == "terrain" && (found[idx].terrain == "plain" ||
			found[idx].terrain == "swamp")) {
			aps.push({x:found[idx].x, y:found[idx].y});
		}
	}

	return aps;
}

module.exports.NotifyDeath = function(_creepName) {
	let found = Memory.ResourceJobs.find(element => element.Assignee == _creepName);
	if(found != null) {
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function() {
	Memory.ResourceJobs = [];
	Memory.EfficiencyRA = 0;
	Memory.EnergyPerTick = 0;

	const resources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
	for(var idx = 0; idx < resources.length; idx++) {
		var ap = GetAccessPoints(resources[idx]);
		var oResourcePoint = {
			AccessPoints: ap,
			ResourceId: resources[idx].id,
			AssignedCreeps: []
		};
		aResourcePoints.push(oResourcePoint);
	}
}

var PostCreatedJob = null;
module.exports.OnJobCreated = function(_callback)
{
	PostCreatedJob = _callback;
}

module.exports.AssignCreepToJob = function(_creep) {
	let found = Memory.ResourceJobs.find(element => element.Assigned == false);
	if(found != null) {
		found.Assigned = true;
		found.Assignee = _creep.name;
		_creep.memory.job = found;
		console.log("[ResourceArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
		return;
	}
}

module.exports.Update = function()
{
	UpdateJobs();
}

function UpdateJobs()
{
	for(var idx = 0; idx < aResourcePoints.length; idx++)
	{
		for(var jdx = 0; jdx < aResourcePoints[idx].AccessPoints.length; jdx++)
		{
			let resourcePoint = aResourcePoints[idx];
			let accessPoint = aResourcePoints[idx].AccessPoints[jdx];

			let found = Memory.ResourceJobs.find(element => element.Id == resourcePoint.ResourceId+"_"+jdx);
			if(found == null)
			{
				var job = {
					Id:resourcePoint.ResourceId+"_"+jdx,
					Type:"Harvest",
					ResourceId: resourcePoint.ResourceId,
					AccessPoint: accessPoint,
					DeliveryPoint: Game.spawns["Spawn1"].id,
					Assigned: false,
					Assignee: null,
				};

				Memory.ResourceJobs.push(job);
				PostCreatedJob(job.Id, job.Type);
			}
		}
	}
}
