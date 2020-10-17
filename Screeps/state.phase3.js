var configBuilder = require('config.role.builder');
var spawnAction = require('action.spawn');

function BuildResourceRoadNetwork()
{
  // Build Source Network
  let spawn = Game.spawns["Spawn1"];
  let goals = _.map(spawn.room.find(FIND_SOURCES), function(source) {
    // We can't actually walk on sources-- set `range` to 1
    // so we path next to it.
    return { pos: source.pos, range: 1 };
  });

  let result = PathFinder.search(
    spawn.pos,
    goals,
    {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: 2,
      swampCost: 10,
      roomCallback: function(roomName)
      {
        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since
        // PathFinder supports searches which span multiple rooms
        // you should be careful!
        if (!room) return;
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function(struct)
        {
          if (struct.structureType === STRUCTURE_ROAD)
          {
            // Favor roads over plain tiles
            costs.set(struct.pos.x, struct.pos.y, 1);
          }
          else if (struct.structureType !== STRUCTURE_CONTAINER &&
                     (struct.structureType !== STRUCTURE_RAMPART ||
                      !struct.my))
          {
            // Can't walk through non-walkable buildings
            costs.set(struct.pos.x, struct.pos.y, 0xff);
          }
        });

        // Avoid creeps in the room
        room.find(FIND_CREEPS).forEach(function(creep)
        {
          costs.set(creep.pos.x, creep.pos.y, 0xff);
        });

        return costs;
      },
    }
  );

  var results = result.path.length;
  while(results--)
  {
    let x = result.path[results].x;
    let y = result.path[results].y;

    //debugger;
    switch(Game.rooms.sim.createConstructionSite(x, y, STRUCTURE_ROAD))
    {
      case ERR_NOT_OWNER:
        console.log("Creating Construction Site: ERROR: NOT_OWNER");
        break;
      case ERR_INVALID_TARGET:
        console.log("Creating Construction Site: ERROR: INVALID_TARGET");
        break;
      case ERR_FULL:
        console.log("Creating Construction Site: ERROR: FULL");
        break;
      case ERR_INVALID_ARGS:
        console.log("Creating Construction Site: ERROR: INVALID_ARGS");
        break;
      case ERR_RCL_NOT_ENOUGH:
        console.log("Creating Construction Site: ERROR: RCL_NOT_ENOUGH");
        break;
      case OK:
        //console.log("Creating Construction Site: X:"+x+" Y:"+y);
        break;
    }
  }
}

module.exports.Name = "Phase3";
module.exports.StateConfig = require('config.state.phase3');

module.exports.OnExecute = function()
{
  console.log("State.Phase3: OnExecute");
  spawnAction.run(configBuilder, "Spawn1");
};

module.exports.OnEnter = function()
{
  console.log("State.Phase3: OnEnter");
  BuildResourceRoadNetwork();
};

module.exports.OnExit = function()
{
  console.log("State.Phase3: OnExit");
};
