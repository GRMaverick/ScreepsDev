var aResourcePoints = [];

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

module.exports.NotifyDeath = function(_creepName)
{
	let found = Memory.ResourceJobs.find(element => element.Assignee == _creepName);
	if(found != null)
	{
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function()
{
	Memory.ResourceJobs = [];
	Memory.EfficiencyRA = 0;
	Memory.EnergyPerTick = 0;

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
}

module.exports.AssignCreepToJob = function(_creep)
{
	let found = Memory.ResourceJobs.find(element => element.Assigned == false);
	if(found != null)
	{
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
	UpdateHarvesters();
	RenderStats();
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
				console.log("[ResourceArbiter]: Job Posted: "+job.Id);
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

function UpdateStats()
{
	// Energy Per Tick
	// var ept = 0;
	// var harvesters = _.filter(Game.creeps, { memory: { role:"Harvester"} });
	// for(var idx = 0; idx < harvesters.length; idx++)
	// {
	// 	var harvester = harvesters[idx];
	// 	if(harvester.memory.job != null)
	// 	{
	// 		let objTarget = Game.getObjectById(harvester.memory.job.ResourceId);
	// 		let objSource = Game.getObjectById(harvester.memory.job.DeliveryPoint);
	// 		let targetNode = {
	// 			pos: objTarget.pos,
	// 			range: 1,
	// 		};
	//
	// 		let path = Utilities.PathEndToEnd(objSource, targetNode);
	// 		let workParts = Utilities.GetNumOfParts(harvester.body, WORK);
	// 		let moveParts = Utilities.GetNumOfParts(harvester.body, MOVE);
	// 	}
	// }
}

function RenderStats()
{
	if(Memory.RenderStats)
	{
		new RoomVisual(Game.spawns["Spawn1"].room.name)
			.text("Efficiency: "+Memory.EfficiencyRA, 4, 2, {color:'white', font:0.8})
			.text("Energy Per Tick: "+Memory.EnergyPerTick, 5, 3, {color:'white', font:0.8});
	}
}
