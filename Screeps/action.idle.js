module.exports = {
    run : function(creep)
    {            
        var sources = creep.room.find(FIND_MY_SPAWNS);
        creep.moveTo(sources[0]);
        //creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffAA00'}});
    }
};