var Harvest = require('action.harvest');
var Deliver = require('action.deliver');
var Idle = require('action.idle');
var Build = require('action.build');

var harvester = 
{
    /** @param {Creep} creep **/
    run: function(creep)
    {        
	    if(creep.store.getFreeCapacity() > 0) 
	    {
            Harvest.run(creep);
        }
        else
        {
            var resourceTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if(resourceTargets.length > 0)
            {
                Deliver.run(creep, resourceTargets[0]);
            }
            else
            {
                var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(constructionTargets.length > 0)
                {
                    Build.run(creep);
                }
                else
                {
                    Idle.run(creep);
                }
            }
        }
	}
};

module.exports = harvester;