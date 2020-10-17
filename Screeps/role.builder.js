var Harvest = require('action.harvest');
var Build = require('action.build');

module.exports =
{
    /** @param {Creep} creep **/
    run: function(creep)
    {
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0)
	    {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0)
	    {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building)
	    {
          Build.run(creep);
	    }
	    else
	    {
    	    Harvest.run(creep);
	    }
	}
};
