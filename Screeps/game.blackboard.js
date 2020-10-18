var ResourceArbiter = require('arbiter.resources');

var ServiceCreep = require('role.service.creep');
var ServiceCreepConfig = require('role.service.config');
var Utilities = require('utilities');

function RoadEndToEnd(_startNode, _endNode)
{
	var result = Utilities.PathEndToEnd(_startNode, _endNode);

	var results = result.path.length;
	while(results--)
	{
		let node = result.path[results];
		switch(Game.rooms.sim.createConstructionSite(node.x, node.y, STRUCTURE_ROAD))
		{
			case ERR_NOT_OWNER:
				console.log("Creating Construction Site: ERROR: NOT_OWNER");
				break;
			case ERR_INVALID_TARGET:
			  	console.log("Creating Construction Site: ERROR: INVALID_TARGET");
			  	break;
			case ERR_FULL:
			  	console.log("Creating Construction Site: ERROR: FULL");
			  	break;
			case ERR_INVALID_ARGS:
			  	console.log("Creating Construction Site: ERROR: INVALID_ARGS");
			  	break;
			case ERR_RCL_NOT_ENOUGH:
			  	console.log("Creating Construction Site: ERROR: RCL_NOT_ENOUGH");
			  	break;
			case OK:
			  	//console.log("Creating Construction Site: X:"+x+" Y:"+y);
			  	break;
		}
	}
}

module.exports.Initialise = function()
{
	ResourceArbiter.Initialise();
	ResourceArbiter.OnJobPosted(function(_job)
	{
		console.log("Job Posted: "+_job.Id);
	});

    // let goals = _.map(Game.spawns["Spawn1"].room.find(FIND_SOURCES), function(source)
	// {
    //   return { pos: source.pos, range: 1 };
    // });
	// var controllerNode = {
	// 	pos: Game.spawns["Spawn1"].room.controller.pos,
	// 	range: 1,
	// };

	return true;
};

module.exports.Update = function()
{
	SpawnCreeps();

	ResourceArbiter.Update();

	var harvesters = _.filter(Game.creeps, { memory: { role:"Harvester"} });
	for(let idx = 0; idx < harvesters.length; idx++)
	{
		let harvester = harvesters[idx];
		if(harvester.memory.job == null)
		{
			ResourceArbiter.AssignCreepToJob(harvester);
		}
	}
};

function SpawnCreeps()
{
	if(ServiceCreep.Create(ServiceCreepConfig.Harvester, "Spawn1") === true)
	{
		return;
	}

	// if(ServiceCreep.Create(ServiceCreepConfig.Builder, "Spawn1") === true)
	// {
	// 	return;
	// }
	//
	// if(ServiceCreep.Create(ServiceCreepConfig.Upgrader, "Spawn1") === true)
	// {
	// 	return;
	// }
}
