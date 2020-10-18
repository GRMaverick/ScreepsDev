function HandleError(_funcName, _result)
{
	switch(_result)
	{
		case ERR_NOT_OWNER:
			console.log(_funcName+": ERROR_NOT_OWNER");
			break;
		case ERR_BUSY:
			console.log(_funcName+": ERR_BUSY");
			break;
		case ERR_NOT_FOUND:
			console.log(_funcName+": ERR_NOT_FOUND");
			break;
		case ERR_NOT_ENOUGH_RESOURCES:
			console.log(_funcName+": ERR_NOT_ENOUGH_RESOURCES");
			break;
		case ERR_INVALID_TARGET:
			console.log(_funcName+": ERR_INVALID_TARGET");
			break;
		case ERR_NOT_IN_RANGE:
			console.log(_funcName+": ERR_NOT_IN_RANGE");
			break;
		case ERR_TIRED:
			console.log(_funcName+": ERR_TIRED");
			break;
		case ERR_NO_BODYPART:
			console.log(_funcName+": ERR_NO_BODYPART");
			break;
	}
}

module.exports.Build = function(_creep, _data)
{
	let target = Game.getObjectById(_data.targetId);
	let result = _creep.build(target);
	if(result == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(target);
		//creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		return true;
	}
	else if(result != OK)
	{
		debugger;
		HandleError("Build", result);
		return false;
	}
};

module.exports.Deliver = function(_creep, _data)
{
	let jobData = _creep.memory.job;

	let target = Game.getObjectById(jobData.DeliveryPoint);
	let result = _creep.transfer(target, RESOURCE_ENERGY);
	if(result == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(target);
		//creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		return true;
	}
	else if(result != OK)
	{
		HandleError("Deliver", result);
		return false;
	}
};

module.exports.Harvest = function(_creep)
{
	let jobData = _creep.memory.job;

	let target = Game.getObjectById(jobData.ResourceId);
	let result = _creep.harvest(target);
	if(result == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(jobData.AccessPoint.x, jobData.AccessPoint.y);
		//creep.moveTo(jobData.AccessPoint.x, jobData.AccessPoint.y, {visualizePathStyle: {stroke: '#ffffff'}});
		return true;
	}
	else if(result != OK)
	{
		HandleError("Harvest", result);
		return false;
	}
};

module.exports.Repair = function(_creep, _data)
{
	let target = Game.getObjectById(_data.targetId);
	let result = _creep.repair(target);
	if(result == ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(target);
		//creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		return true;
	}
	else if(result != OK)
	{
		HandleError("Repair", result);
		return false;
	}
};

module.exports.Upgrade = function(_creep, _data)
{
	let target = Game.getObjectById(_data.targetId);
	let result = _creep.upgradeController(target);
	if(result === ERR_NOT_IN_RANGE)
	{
		_creep.moveTo(target);
		//creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		return true;
	}
	else if(result != OK)
	{
		HandleError("Upgrade", result);
		return false;
	}
};
