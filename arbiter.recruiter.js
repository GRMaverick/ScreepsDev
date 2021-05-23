var ServiceCreep = require('role.service.creep');
var CreepConfig = require('role.service.config');

function Log(_string){
	if(Memory.LogRecruiter)
	{
		console.log("[Recruiter]: " + _string);
	}
}

function Hire() {
    if(Memory.RecruitQueue.length > 0){
        switch(Memory.RecruitQueue[0]) {
            case 'Harvester': {
            	if(ServiceCreep.Create(CreepConfig.Harvester, "Spawn1") === true) {
            	    Memory.RecruitQueue.shift();
            		return;
            	}
            	else{
            	    Log("Harvester Recruit Failed!");
            	    return;
            	}
            }
            case 'Upgrader': {        	
                if(ServiceCreep.Create(CreepConfig.Upgrader, "Spawn1") === true) {
            	    Memory.RecruitQueue.shift();
            		return;
            	}
            	else{
            	    Log("Upgrader Recruit Failed!");
            	    return;
            	}
            }
            case 'Handyman': {
                if(ServiceCreep.Create(CreepConfig.Handyman, "Spawn1") === true) {
            	    Memory.RecruitQueue.shift();
            		return;
            	}
            	else{
            	    Log("Handyman Recruit Failed!");
            	    return;
            	}
            }
        }
    }
}

function Fire() {
    // Fire
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            Memory.RecruitQueue.push(Game.creeps[name].memory.role);
            delete Memory.creeps[name];
            Log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.Initialise = function() {
    Memory.RecruitQueue = [];
    
    Log("Recruiting "+CreepConfig.Harvester.Min+" Harvesters!");
    for(let i = 0; i < CreepConfig.Harvester.Min; i++) {
        Memory.RecruitQueue.push(CreepConfig.Harvester.Role);
    }
    
    Log("Recruiting "+CreepConfig.Upgrader.Min+" Upgrader!");
    for(let i = 0; i < CreepConfig.Upgrader.Min; i++) {
        Memory.RecruitQueue.push(CreepConfig.Upgrader.Role);
    }
    
    //for(let i = 0; i < CreepConfig.Handyman.Min; i++) {
    //    Memory.RecruitQueue.push(CreepConfig.Handyman.Role);
    //}
};

module.exports.Recruit = function() {
    Fire();
    Hire();
};