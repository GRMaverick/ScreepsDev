module.exports.Build = function(_creep)
{
	var targets = _creep.room.find(FIND_CONSTRUCTION_SITES);
	if(targets.length)
	{
		if(_creep.build(targets[0]) == ERR_NOT_IN_RANGE)
		{
			_creep.moveTo(targets[0]);
			//_creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
};

module.exports.Deliver = function(_creep, _target)
{
	if(_creep.transfer(_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(_target);
		//creep.moveTo(_target, {visualizePathStyle: {stroke: '#ffffff'}});
	}
};

module.exports.Harvest = function(_creep)
{
	var sources = _creep.room.find(FIND_SOURCES);
    if(_creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
    {
        _creep.moveTo(sources[0]);
        //_creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffAA00'}});
    }
};

module.exports.Repair = function(_creep)
{
	var targets = _creep.room.find(FIND_STRUCTURES);
	if( targets.length && (targets[0].hits < ( targets[0].hitsMax * MaxHitsThreshold ) ) )
	{
		if(_creep.repair(targets[0]) == ERR_NOT_IN_RANGE)
		{
			_creep.moveTo(targets[0]);
			//_creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
};

module.exports.Upgrade = function(_creep)
{
	if(_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(_creep.room.controller);
		//_creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
};
