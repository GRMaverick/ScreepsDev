var aResourcePoints = [];

var PostJobsCallback = null;

var Services = require('role.service.actions');

function GetAccessPoints(_resource)
{
	var position = _resource.pos;
	const found = _resource.room.lookForAtArea(LOOK_TERRAIN,
		position.y-1, position.x-1,
		position.y+1, position.x+1,
		true
	);

	var aps = [];
	for(var idx = 0; idx < found.length; idx++)
	{
		if(found[idx].type == "terrain" &&
			(found[idx].terrain == "plain" ||
			found[idx].terrain == "swamp"))
		{
			aps.push({x:found[idx].x, y:found[idx].y});
		}
	}

	return aps;
}

module.exports.OnJobPosted = function(_callback)
{
	PostJobsCallback = _callback;
}

module.exports.Initialise = function()
{
	if(Memory.ResourceArbiterInitialised != null && Memory.ResourceArbiterInitialised == true)
	{
		return true;
	}

	Memory.ResourceJobs = [];

	const resources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
	for(var idx = 0; idx < resources.length; idx++)
	{
		var ap = GetAccessPoints(resources[idx]);
		var oResourcePoint = {
			AccessPoints: ap,
			ResourceId: resources[idx].id,
			AssignedCreeps: []
		};
		aResourcePoints.push(oResourcePoint);
	}

	Memory.ResourceArbiterInitialised = true;
}

module.exports.Update = function()
{
	UpdateJobs();
	UpdateHarvesters();
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
				};

				Memory.ResourceJobs.push(job);
				PostJobsCallback(job);
			}
		}
	}
}

function UpdateHarvesters()
{
	var harvesters = _.filter(Game.creeps, { memory: { role:"Harvester"} });
	for(var idx = 0; idx < harvesters.length; idx++)
	{
		var harvester = harvesters[idx];
		if(harvester.memory.job != null && harvester.memory.job.Type == "Harvest" && !harvester.spawning)
		{
			if(harvester.store.getFreeCapacity() == 0)
			{
				Services.Deliver(harvester);
			}
			else
			{
				Services.Harvest(harvester);
			}
		}
	}
}

module.exports.AssignCreepToJob = function(_creep)
{
	for(let idx = 0; idx < Memory.ResourceJobs.length; idx++)
	{
		if(!Memory.ResourceJobs[idx].Assigned)
		{
			_creep.memory.job = Memory.ResourceJobs[idx];
			Memory.ResourceJobs[idx].Assigned = true;
			console.log("Resource Job assigned: "+_creep.name+" "+_creep.memory.job.Id);
			return;
		}
	}
}
