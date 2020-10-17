module.exports.Initialise = function()
{
	if(Memory.RoadNetworkBuilt === true)
	{
		return true;
	}

	let spawn = Game.spawns["Spawn1"];
    let goals = _.map(spawn.room.find(FIND_SOURCES), function(source)
	{
      return { pos: source.pos, range: 1 };
    });

	for(var idx = 0; idx < goals.length; idx++)
	{
		let result = PathFinder.search(
			spawn.pos,
			goals[idx],
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

	Memory.RoadNetworkBuilt = true;
	return true;
};

module.exports.Update = function()
{

};
