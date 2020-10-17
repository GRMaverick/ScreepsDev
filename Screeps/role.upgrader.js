var Harvest = require('action.harvest');
var Upgrade = require('action.upgrade');


module.exports = 
{
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) 
	    {
            Upgrade.run(creep);
        }
        else 
        {
            Harvest.run(creep);
        }
	}
}