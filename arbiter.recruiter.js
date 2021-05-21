var ServiceCreep = require('role.service.creep');
var CreepConfig = require('role.service.config');

function Log(_string){
	if(Memory.LogRecruiter)
	{
		console.log("[Foreman]: " + _string);
	}
}

function Hire() {
    // Hire
	if(ServiceCreep.Create(CreepConfig.Handyman, "Spawn1") === true) {
		return;
	}
	
	if(ServiceCreep.Create(CreepConfig.Upgrader, "Spawn1") === true) {
		return;
	}
}

function Fire() {
    // Fire
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.Initialise = function() {
    
};

module.exports.Recruit = function() {
    Fire();
    Hire();
};