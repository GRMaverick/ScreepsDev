module.exports = 
{
    run : function(creep, target)
    {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(target);
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};