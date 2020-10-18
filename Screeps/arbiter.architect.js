var Services = require('role.service.actions');

module.exports.NotifyDeath = function(_creepName)
{
	let found = Memory.ConstructionJobs.find(element => element.Assignee == _creepName);
	if(found != null)
	{
		found.Assigned = false;
		found.Assignee = null;
	}
}

module.exports.Initialise = function()
{
	Memory.ConstructionJobs = [];
}

module.exports.AssignCreepToJob = function(_creep)
{
	let found = Memory.ConstructionJobs.find(element => element.Assigned == false);
	if(found != null)
	{
		found.Assigned = true;
		found.Assignee = _creep.name;
		_creep.memory.job = found;
		console.log("[ArchitectArbiter]: Resource Job Assigned: "+found.Assignee+" "+found.Id);
		return;
	}
}

module.exports.Update = function()
{
	UpdateJobs();
	UpdateBuilders();
}

function UpdateJobs()
{
	let constructionSites = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES);
	// Clear Completed Jobs
	var builders = _.filter(Game.creeps, { memory: { role:"Builder"} });
	for(let idx = 0; idx < builders.length; idx++)
	{
		if(builders[idx].memory.job == undefined)
		{
			continue;
		}
		let found = constructionSites.find(element => element.id == builders[idx].memory.job.ConstructionSiteId);
		if(found == null)
		{
			for(let jdx = 0; jdx < Memory.ConstructionJobs.length; jdx++)
			{
				if(builders[idx].memory.job != undefined)
				{
					if(Memory.ConstructionJobs[jdx].ConstructionSiteId == builders[idx].memory.job.ConstructionSiteId)
					{
						console.log("[ArchitectArbiter]: Job Completed: " + builders[idx].name + " - " + builders[idx].memory.job.Id);
						delete builders[idx].memory.job;
						Memory.ConstructionJobs.splice(jdx, 1);
					}
				}
			}
		}
	}

	// Add New Jobs
	for(let idx = 0; idx < constructionSites.length; idx++)
	{
		let site = constructionSites[idx];
		let found = Memory.ConstructionJobs.find(element => element.Id == "ConstructionSite_"+site.id);
		if(found == null)
		{
			var closestResourceId = site.pos.findClosestByPath(FIND_SOURCES).id;
			var job = {
				Id: "ConstructionSite_"+site.id,
				Type: "Construction",
				Assigned: false,
				Assignee: null,
				ConstructionSiteId: site.id,
				ResourceId: closestResourceId
			};
			Memory.ConstructionJobs.push(job);
			console.log("[ArchitectArbiter]: Job Posted: "+job.Id);
		}
	}
}

function UpdateBuilders()
{
	var builders = _.filter(Game.creeps, { memory: { role:"Builder"} });
	for(let idx = 0; idx < builders.length; idx++)
	{
		var builder = builders[idx];
		if(builder.memory.job != null && builder.memory.job.Type == "Construction" && !builder.spawning)
		{
			if(builder.memory.building && builder.store[RESOURCE_ENERGY] == 0) {
				builder.memory.building = false;
				builder.say('🔄 harvest');
			}
			if(!builder.memory.building && builder.store.getFreeCapacity() == 0) {
				builder.memory.building = true;
				builder.say('⚡ upgrade');
			}

			if(builder.memory.building)
			{
				Services.Build(builder);
			}
			else
			{
				Services.Harvest(builder);
			}
		}
	}
}
