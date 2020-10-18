var Services = require('role.service.actions');

var PostJobsCallback = null;

module.exports.OnJobPosted = function(_callback)
{
	PostJobsCallback = _callback;
}

module.exports.NotifyDeath = function(_creepName)
{
	let found = Memory.ControllerJobs.find(element => element.Assignee == _creepName);
	if(found != null)
	{
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function()
{
	Memory.ControllerJobs = [];

	var closestResourceId = Game.spawns["Spawn1"].room.controller.pos.findClosestByPath(FIND_SOURCES).id;
	for(let idx = 0; idx < 3; idx++)
	{
		let found = Memory.ControllerJobs.find(element => element.Id == "Upgrade"+"_"+idx);
		if(found == null)
		{
			var job = {
				Id:"Upgrade"+"_"+idx,
				Type:"Upgrade",
				Assigned: false,
				ResourceId: closestResourceId,
				ControllerId: Game.spawns["Spawn1"].room.controller.id,
			};
			Memory.ControllerJobs.push(job);
			PostJobsCallback(job);
		}
	}
}

module.exports.AssignCreepToJob = function(_creep)
{
	let found = Memory.ControllerJobs.find(element => element.Assigned == false);
	if(found != null)
	{
		found.Assigned = true;
		found.Assignee = _creep.name;
		_creep.memory.job = found;
		console.log("Resource Job assigned: "+found.Assignee+" "+found.Id);
		return;
	}
}

module.exports.Update = function()
{
	UpdateUpgraders();
}

function UpdateUpgraders()
{
	var upgraders = _.filter(Game.creeps, { memory: { role:"Upgrader"} });
	for(let idx = 0; idx < upgraders.length; idx++)
	{
		var upgrader = upgraders[idx];
		if(upgrader.memory.job != null && upgrader.memory.job.Type == "Upgrade" && !upgrader.spawning)
		{
			if(upgrader.memory.upgrading && upgrader.store[RESOURCE_ENERGY] == 0) {
				upgrader.memory.upgrading = false;
				upgrader.say('🔄 harvest');
			}
			if(!upgrader.memory.upgrading && upgrader.store.getFreeCapacity() == 0) {
				upgrader.memory.upgrading = true;
				upgrader.say('⚡ upgrade');
			}

			if(upgrader.memory.upgrading)
			{
				Services.Upgrade(upgrader);
			}
			else
			{
				Services.Harvest(upgrader);
			}
		}
	}
}
