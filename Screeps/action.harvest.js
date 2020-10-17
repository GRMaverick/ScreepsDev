module.exports = {
    run : function(creep)
    {            
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(sources[0]);
            //creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffAA00'}});
        }
    }
};