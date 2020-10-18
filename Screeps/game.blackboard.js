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
			if(Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Harvester") {
				ResourceArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Upgrader") {
				ControllerArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Builder") {
				ArchitectArbiter.NotifyDeath(name);
			}
			else if (Memory.creeps[name].job != undefined && Memory.creeps[name].job.Type == "Repairer") {
				ArchitectArbiter.NotifyDeath(name);
			}

            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function OnJobCreated(_jobId, _jobType) {
	console.log(_jobType + " job posted: " + _jobId);
	Memory.JobBoard.push({
		JobId:_jobId, JobType:_jobType
	});
}

module.exports.Initialise = function() {
	if(Memory.BlackboardInitialised != null && Memory.BlackboardInitialised == true) {
		return true;
	}

	Memory.JobBoard = [];

	ResourceArbiter.Initialise();
	ControllerArbiter.Initialise();
	ArchitectArbiter.Initialise();

	Memory.BlackboardInitialised = true;
};

module.exports.Update = function()
{
	ResourceArbiter.OnJobCreated(OnJobCreated);
	ControllerArbiter.OnJobCreated(OnJobCreated);
	ArchitectArbiter.OnJobCreated(OnJobCreated);

	ClearDead();
	SpawnCreeps();

	ResourceArbiter.Update();
	ControllerArbiter.Update();
	ArchitectArbiter.Update();

	DistributeJobs();
	UpdateCreeps();
};

function DistributeJobs()
{
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		if(creep.memory.job != null && creep.memory.job != undefined) {
			continue;
		}

		let role = creep.memory.role;
		let compatibleJob = Memory.JobBoard.find(element => element.JobType == role);

		if(compatibleJob == null || compatibleJob == undefined){
			continue;
		}

		if(compatibleJob.JobType == "Harvester"){
			ResourceArbiter.AssignCreepToJob(creep, compatibleJob.JobId);
			Memory.JobBoard.splice(Memory.JobBoard.indexOf(compatibleJob), 1);
			continue;
		}
		else if(compatibleJob.JobType == "Upgrader"){
			ControllerArbiter.AssignCreepToJob(creep, compatibleJob.JobId);
			Memory.JobBoard.splice(Memory.JobBoard.indexOf(compatibleJob), 1);
			continue;
		}
		else if(compatibleJob.JobType == "Builder"){
			ArchitectArbiter.AssignCreepToJob(creep, compatibleJob.JobId);
			Memory.JobBoard.splice(Memory.JobBoard.indexOf(compatibleJob), 1);
			continue;
		}
		else if(compatibleJob.JobType == "Repairer"){
			ArchitectArbiter.AssignCreepToJob(creep, compatibleJob.JobId);
			Memory.JobBoard.splice(Memory.JobBoard.indexOf(compatibleJob), 1);
			continue;
		}

		console.log(name + " is unemployed!");
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
