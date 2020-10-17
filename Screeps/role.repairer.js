var Harvest = require('action.harvest');
var Repair = require('action.repair');

module.exports = 
{
    /** @param {Creep} creep **/
    run: function(creep) 
    {
	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) 
	    {
            creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) 
	    {
	        creep.memory.repairing = true;
	    }

	    if(creep.memory.repairing) 
	    {
            Repair.run(creep);
	    }  
	    else 
	    {
    	    Harvest.run(creep);
	    }
	}
};