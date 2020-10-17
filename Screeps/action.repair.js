var MaxHitsThreshold = 0.4;

module.exports = 
{
    run: function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES);
        if( targets.length && (targets[0].hits < ( targets[0].hitsMax * MaxHitsThreshold ) ) ) 
        {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(targets[0]);
                //creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};