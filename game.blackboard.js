var Tasks = require('role.service.actions');

var Utilities = require('utilities');

var Foreman = require('arbiter.foreman');
var Architect = require('arbiter.architect');
var Recruiter = require('arbiter.recruiter');

function Log(_string){
	if(Memory.LogBlackboard)
	{
		console.log("[Blackboard]: " + _string);
	}
}

module.exports.Initialise = function() {
    if(Memory.BlackboardInitialised != null && Memory.BlackboardInitialised == true) {
		return true;
	}
	
	Memory.ResourcePoints = Utilities.GetResourcePoints(Game.spawns["Spawn1"].room);
	
	Architect.Initialise();
	Recruiter.Initialise();
	Foreman.Initialise();
	
	Memory.BlackboardInitialised = true;
};

module.exports.Update = function() {
	Architect.Update();
	Recruiter.Recruit();
	Foreman.Work();
};