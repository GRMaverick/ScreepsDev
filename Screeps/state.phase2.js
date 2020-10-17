var configUpgrader = require('config.role.upgrader');
var spawnAction = require('action.spawn');

module.exports.Name = "Phase2";
module.exports.StateConfig = require('config.state.phase2');

module.exports.OnExecute = function()
{
  console.log("State.Phase2: OnExecute");
  spawnAction.run(configUpgrader, "Spawn1");
};

module.exports.OnEnter = function()
{
  console.log("State.Phase2: OnEnter");
};

module.exports.OnExit = function()
{
  console.log("State.Phase2: OnEnter");
};
