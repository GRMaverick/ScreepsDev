var ResourceArbiter = require('arbiter.resources');

var ServiceCreep = require('role.service.creep');
var ServiceCreepConfig = require('role.service.config');

function RoadEndToEnd(_startNode, _endNode)
{
	let result = PathFinder.search(
		_startNode.pos,
		_endNode,
		{
			// We need to set the defaults costs higher so that we
			// can set the road cost lower in `roomCallback`
			plainCost: 2,
			swampCost: 10,
			roomCallback: function(roomName)
			{
				let room = Game.rooms[roomName];
				// In this example `room` will always exist, but since
				// PathFinder supports searches which span multiple rooms
				// you should be careful!
				if (!room) return;
				let costs = new PathFinder.CostMatrix;

				room.find(FIND_STRUCTURES).forEach(function(struct)
				{
					if (struct.structureType === STRUCTURE_ROAD)
					{
					  // Favor roads over plain tiles
					  costs.set(struct.pos.x, struct.pos.y, 1);
					}
					else if (struct.structureType !== STRUCTURE_CONTAINER &&
							   (struct.structureType !== STRUCTURE_RAMPART ||
								!struct.my))
					{
					  // Can't walk through non-walkable buildings
					  costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});

				// Avoid creeps in the room
				room.find(FIND_CREEPS).forEach(function(creep)
				{
					costs.set(creep.pos.x, creep.pos.y, 0xff);
				});

				return costs;
			},
		}
	);

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
