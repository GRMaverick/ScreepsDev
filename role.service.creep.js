var Tasks = require('role.service.actions');
var Config = require('role.service.config');
var Utilities = require('utilities');

function Log(_string){
	if(Memory.SpawnLogging)	{
		console.log("[Creep]: " + _string);
	}
}

module.exports.Create = function(_config, _spawn) {
	if( Game.spawns[_spawn].spawning ){ 
        return true;
	}

	let maxEnergyAvailable = Game.spawns[_spawn].room.energyCapacityAvailable;
	var creepCount = _.sum( Game.creeps, { memory: { role: _config.Role } } );
	if(creepCount < _config.Min) {
		// Attempt Biggest boy
	    let name = _config.Role+Game.time;
		let targetBody = Utilities.GetBestBodyParts(maxEnergyAvailable);
		let error = Game.spawns[_spawn].spawnCreep(targetBody, name);
		if(error == OK) {
			Game.creeps[name].memory = { role:_config.Role, tasks:[] };
		    Game.creeps[name].memory.tasks = [];
		    Log("Spawning: " + name + " - Cost: " + Utilities.CalculateCost(targetBody) + " - Body: " + targetBody.toString());
			return true;
		}
		else if(error == ERR_NOT_ENOUGH_ENERGY) {
			// Attempt Default boy on Harvester role
			if(_config.Role == "Harvester") {
				let energyAvailable = Game.spawns[_spawn].store.getUsedCapacity();
				let defaultCost = Utilities.CalculateCost(_config.DefaultBody);
				if(energyAvailable > defaultCost) {
					Game.spawns[_spawn].spawnCreep(_config.DefaultBody, name);
				    Game.creeps[name].memory = { role:_config.Role, tasks:[] };
				    Game.creeps[name].memory.tasks = [];
				    Log("Spawning: " + name + " - Cost: " + defaultCost + " - Body: " + _config.DefaultBody.toString());
					return true;
				}
			}
		}
		else {
			Utilities.LogError("[Spawn]", error);
		}
	}

	return false;
};

module.exports.Update = function(_creep) {
	if(_creep.spawning) {
	    Log("Update Skipped - Spawning!");
		return;
	}
	
    if(_creep.memory.tasks.length == 0) {
	    Log("Update Skipped - No Tasks!");
		return;
	}
	
    let task = _creep.memory.tasks[_creep.memory.tasks.length-1];
    if(task == undefined || task == null) {
        Log("Invalid Task!");
        return;
    }
    
    switch(task.Type) {
        case 'Harvest':{
            return Tasks.Harvest(_creep, task);
        }
        case 'Deliver':{
            return Tasks.Deliver(_creep, task);
        }
        case 'Upgrade': {
            return Tasks.Upgrade(_creep, task);
        }
        case 'Build': {
            return Tasks.Build(_creep, task);
        }
        case 'Repair': {
            return Tasks.Repair(_creep, task);
        }
        default: {
            Log("Unknown Work: "+task.Type);
            break;
        }
    }
};
