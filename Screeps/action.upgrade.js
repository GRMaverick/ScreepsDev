module.exports = {
    run : function(creep)
    {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(creep.room.controller);
            //creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};