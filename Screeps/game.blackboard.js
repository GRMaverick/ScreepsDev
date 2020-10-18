var ResourceArbiter = require('arbiter.resources');
var ControllerArbiter = require('arbiter.controller');
var ArchitectArbiter = require('arbiter.architect');

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

function ClearDead()
{
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name])
        {
			if(Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Harvest")
			{
				ResourceArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Upgrade")
			{
				ControllerArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Construction")
			{
				ArchitectArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Repair")
			{
				ArchitectArbiter.NotifyDeath(name);
			}

            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.Initialise = function()
{
	if(Memory.BlackboardInitialised != null && Memory.BlackboardInitialised == true)
	{
		return true;
	}

	Memory.RenderStats = true;

	ResourceArbiter.Initialise();
	ControllerArbiter.Initialise();
	ArchitectArbiter.Initialise();

    // let goals = _.map(Game.spawns["Spawn1"].room.find(FIND_SOURCES), function(source)
	// {
    //   return { pos: source.pos, range: 1 };
    // });
	// var controllerNode = {
	// 	pos: Game.spawns["Spawn1"].room.controller.pos,
	// 	range: 1,
	// };

	Memory.BlackboardInitialised = true;
};

module.exports.Update = function()
{
	ClearDead();
	SpawnCreeps();

	ResourceArbiter.Update();
	ControllerArbiter.Update();
	ArchitectArbiter.Update();

	var harvesters = _.filter(Game.creeps, { memory: { role:"Harvester"} });
	for(let idx = 0; idx < harvesters.length; idx++)
	{
		let harvester = harvesters[idx];
		if(harvester.memory.job == null)
		{
			ResourceArbiter.AssignCreepToJob(harvester);
		}
	}

	var upgraders = _.filter(Game.creeps, { memory: { role:"Upgrader"} });
	for(let idx = 0; idx < upgraders.length; idx++)
	{
		let upgrader = upgraders[idx];
		if(upgrader.memory.job == null)
		{
			ControllerArbiter.AssignCreepToJob(upgrader);
		}
	}

	var builders = _.filter(Game.creeps, { memory: { role:"Builder"} });
	for(let idx = 0; idx < builders.length; idx++)
	{
		let builder = builders[idx];
		if(builder.memory.job == null)
		{
			ArchitectArbiter.AssignCreepToJob(builder);
		}
	}

	UpdateCreeps();
};

function SpawnCreeps()
{
	if(ServiceCreep.Create(ServiceCreepConfig.Harvester, "Spawn1") === true)
	{
		return;
	}

	if(ServiceCreep.Create(ServiceCreepConfig.Upgrader, "Spawn1") === true)
	{
		return;
	}

	if(ServiceCreep.Create(ServiceCreepConfig.Builder, "Spawn1") === true)
	{
		return;
	}
}

function UpdateCreeps()
{
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
		if(creep.spawning === false)
		{
			ServiceCreep.Update(creep);
		}
    }
}
