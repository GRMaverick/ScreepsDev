var ResourceArbiter = require('arbiter.resources');
var ControllerArbiter = require('arbiter.controller');
var ArchitectArbiter = require('arbiter.architect');

var ServiceCreep = require('role.service.creep');
var ServiceCreepConfig = require('role.service.config');
var Utilities = require('utilities');

function RoadEndToEnd(_startNode, _endNode) {
	var result = Utilities.PathEndToEnd(_startNode, _endNode);
	var results = result.path.length;
	while(results--) {
		let node = result.path[results];
		let error = Game.rooms.sim.createConstructionSite(node.x, node.y, STRUCTURE_ROAD);
		if(error != OK) {
			Utilities.LogError("[RoadConstruction]", error);
		}
	}
}

function ClearDead() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
			if(Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Harvest") {
				ResourceArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Upgrade") {
				ControllerArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Construction") {
				ArchitectArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Repair") {
				ArchitectArbiter.NotifyDeath(name);
			}

            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.Initialise = function() {
	if(Memory.BlackboardInitialised != null && Memory.BlackboardInitialised == true) {
		return true;
	}

	Memory.JobBoard = [];

	ResourceArbiter.Initialise();
	ResourceArbiter.OnJobCreated(function(_jobId, _jobType)
	{
		console.log(_jobType + "job posted: " + _jobId);
		Memory.JobBoard.push({JobId:_job.Id, JobType:_jobType});
	});

	ArchitectArbiter.Initialise();
	ArchitectArbiter.OnJobCreated(function(_jobId, _jobType)
	{
		console.log(_jobType + "job posted: " + _jobId);
		Memory.JobBoard.push({JobId:_job.Id, JobType:_jobType});
	});

	ControllerArbiter.Initialise();
	ControllerArbiter.OnJobCreated(function(_jobId, _jobType)
	{
		console.log(_jobType + "job posted: " + _jobId);
		Memory.JobBoard.push({JobId:_job.Id, JobType:_jobType});
	});

	Memory.BlackboardInitialised = true;
};

module.exports.Update = function()
{
	ClearDead();
	SpawnCreeps();

	ResourceArbiter.Update();
	ControllerArbiter.Update();
	ArchitectArbiter.Update();

	// var harvesters = _.filter(Game.creeps, { memory: { role:"Harvester"} });
	// for(let idx = 0; idx < harvesters.length; idx++) {
	// 	let harvester = harvesters[idx];
	// 	if(harvester.memory.job == null) {
	// 		ResourceArbiter.AssignCreepToJob(harvester);
	// 	}
	// }
	//
	// var upgraders = _.filter(Game.creeps, { memory: { role:"Upgrader"} });
	// for(let idx = 0; idx < upgraders.length; idx++) {
	// 	let upgrader = upgraders[idx];
	// 	if(upgrader.memory.job == null) {
	// 		ControllerArbiter.AssignCreepToJob(upgrader);
	// 	}
	// }
	//
	// var builders = _.filter(Game.creeps, { memory: { role:"Builder"} });
	// for(let idx = 0; idx < builders.length; idx++) {
	// 	let builder = builders[idx];
	// 	if(builder.memory.job == null) {
	// 		ArchitectArbiter.AssignCreepToJob(builder);
	// 	}
	// }

	UpdateCreeps();
};

function DistributeJobs()
{
	var unemployed = _.filter(Game.creeps, { memory: {job: null}});
	for(let idx = 0; idx < unemployed.length; idx++)
	{
		console.log(unemployed.name + "Has no job");
	}
}

function SpawnCreeps() {
	if(ServiceCreep.Create(ServiceCreepConfig.Harvester, "Spawn1") === true) {
		return;
	}
	if(ServiceCreep.Create(ServiceCreepConfig.Upgrader, "Spawn1") === true) {
		return;
	}
	if(ServiceCreep.Create(ServiceCreepConfig.Builder, "Spawn1") === true) {
		return;
	}
}

function UpdateCreeps() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		if(creep.spawning === false) {
			ServiceCreep.Update(creep);
		}
    }
}
