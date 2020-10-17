/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.state');
 * mod.thing == 'a thing'; // true
 */

var phase1State = require('state.phase1');
var phase2State = require('state.phase2');
var phase3State = require('state.phase3');

var CurrentState = null;
var gStateList = [phase1State, phase2State, phase3State];

function ChangeState(_state)
{
    if(_state === "undefined" || _state == null)
    {
      return;
    }

    if(Memory.CurrentState != null)
    {
      CurrentState.OnExit();
    }

    CurrentState = _state;
    CurrentState.OnEnter();
}
function GetState(_stateName)
{
  var states = _.filter(gStateList, {Name:_stateName});
  if(states.length != 1)
  {
      console.log("No valid state to transition too - States found: "+states);
      return null;
  }
  return states[0];
}

function LoadState(_state)
{
  if(typeof _state === "undefined")
  {
    return null;
  }

  var obj = JSON.parse(_state);
  if(obj == '')
  {
    return null;
  }

  obj.OnEnter = new Function(`return ${obj.OnEnter.toString()}`)();
  obj.OnExit = new Function(`return ${obj.OnExit.toString()}`)();
  obj.OnExecute = new Function(`return ${obj.OnExecute.toString()}`)();

  var transitions = obj.StateConfig.length;
  while(transitions--)
  {
    obj.StateConfig[transitions].Rule = new Function(`return ${obj.StateConfig[transitions].Rule.toString()}`)();
  }

  return obj;
}

function SaveState(_state)
{
  if(_state === "undefined" || _state == null)
  {
    return;
  }

  Memory.CurrentState = JSON.stringify(_state, function(key, val)
  {
    return (typeof val === 'function') ? ''+val : val;
  });
}
module.exports =
{
    Update: function()
    {
        CurrentState = LoadState(Memory.CurrentState);
        if(CurrentState == null)
        {
            console.log("State Init");
            ChangeState(phase1State);
        }
        
        console.log("Executing: " + CurrentState.Name);
        CurrentState.OnExecute();

        var transitions = CurrentState.StateConfig.length;
        while(transitions--)
        {
            var transition = CurrentState.StateConfig[transitions];
            if(transition.Rule() === true)
            {
                console.log("Transition Ready, Next State: " + CurrentState.StateConfig[transitions].NextState);
                ChangeState(GetState(CurrentState.StateConfig[transitions].NextState));
            }
        }

        SaveState(CurrentState);
    }
};
