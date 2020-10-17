function CalculateCost(_body)
{
    var cost = 0;
    for(var i in _body)
    {
        switch(_body[i])
        {
            case MOVE:
                cost = cost + 50;
                break;
            case WORK:
                cost = cost + 100;
                break;
            case CARRY:
                cost = cost + 50;
                break;
            case ATTACK:
                cost = cost + 80;
                break
            case RANGED_ATTACK:
                cost = cost + 150;
                break;
            case HEAL:
                cost = cost + 250;
                break;
            case CLAIM:
                cost = cost + 600;
                break;
            case TOUGH:
                cost = cost + 10;
                break
        }
    }
    return cost;
}

module.exports = function(_config, _spawn)
{
    if( Game.spawns[_spawn].spawning )
        return;

    var vBigCreeps = _.filter(Game.creeps, {memory:{role:_config.Role, size:"big"}});
    console.log(_config.Role+"s: Count: "+vBigCreeps.length+" BigMax: "+_config.BigMax);
    if( _config.BigBody && (Game.spawns[_spawn].store.getUsedCapacity(RESOURCE_ENERGY) > CalculateCost(_config.BigBody)) && (vBigCreeps.length < _config.BigMax) )
    {
        var name = _config.Role+Game.time;
        console.log("Spawning: "+name+" - Cost: "+CalculateCost(_config.BigBody));
        Game.spawns[_spawn].spawnCreep(_config.BigBody, name);
        Game.creeps[name].memory = { role:_config.Role, size:"big", priorities:_config.Priorities };
    }

    var vSmallCreeps = _.filter(Game.creeps, {memory:{role:_config.Role, size:"small"}});
    console.log(_config.Role+"s: Count: "+vSmallCreeps.length+" SmallMax: "+_config.SmallMax);
    if( _config.SmallBody && (Game.spawns[_spawn].store.getUsedCapacity(RESOURCE_ENERGY) > CalculateCost(_config.SmallBody)) && (vSmallCreeps.length < _config.SmallMax) )
    {
        var name = _config.Role+Game.time;
        console.log("Spawning: "+name+" - Cost: "+CalculateCost(_config.SmallBody));
        Game.spawns[_spawn].spawnCreep(_config.SmallBody, name);
        Game.creeps[name].memory = { role:_config.Role, size:"small", priorities:_config.Priorities };
    }
};
