var configHarvester = require('config.role.harvester');
var SpawnAction = require('action.spawn');

module.exports.Name = "Phase1";
module.exports.StateConfig = require('config.state.phase1');

module.exports.OnExecute = function()
{
  debugger;
  console.log("State.Phase1: OnExecute");
  SpawnAction(configHarvester, "Spawn1");
};

module.exports.OnEnter = function()
{
  console.log("State.Phase1: OnEnter");
};

module.exports.OnExit = function()
{
  console.log("State.Phase1: OnEnter");
};
