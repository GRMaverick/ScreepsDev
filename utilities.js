module.exports.LogError = function(_funcName, _error) {
    if(!Memory.LogErrors){
        return;
    }
	switch(_error) {
		case ERR_NOT_OWNER: {
			console.log(_funcName+": ERROR_NOT_OWNER");
			break;
		}
		case ERR_BUSY: {
			console.log(_funcName+": ERR_BUSY");
			break;
		}
		case ERR_NOT_FOUND: {
			console.log(_funcName+": ERR_NOT_FOUND");
			break;
		}
		case ERR_NOT_ENOUGH_RESOURCES: {
			console.log(_funcName+": ERR_NOT_ENOUGH_RESOURCES");
			break;
		}
		case ERR_INVALID_TARGET: {
			console.log(_funcName+": ERR_INVALID_TARGET");
			break;
		}
		case ERR_NOT_IN_RANGE: {
			console.log(_funcName+": ERR_NOT_IN_RANGE");
			break;
		}
		case ERR_TIRED: {
			console.log(_funcName+": ERR_TIRED");
			break;
		}
		case ERR_NO_BODYPART: {
			console.log(_funcName+": ERR_NO_BODYPART");
			break;
		}
		case ERR_FULL: {
		    console.log(_funcName+": ERR_FULL");
			break;
		}
	}
}

module.exports.PathEndToEnd = function(_startNode, _endNode) {
	let result = PathFinder.search(
		_startNode.pos,
		_endNode, {
			// We need to set the defaults costs higher so that we
			// can set the road cost lower in `roomCallback`
			plainCost: 2,
			swampCost: 10,
			roomCallback: function(roomName) {
				let room = Game.rooms[roomName];
				if (!room) return;
				let costs = new PathFinder.CostMatrix;

				room.find(FIND_STRUCTURES).forEach(function(struct) {
					if (struct.structureType === STRUCTURE_ROAD) {
					  costs.set(struct.pos.x, struct.pos.y, 1);
					}
					else if (struct.structureType !== STRUCTURE_CONTAINER &&
							   (struct.structureType !== STRUCTURE_RAMPART ||
								!struct.my)){
					  costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});

				// Avoid creeps in the room
				room.find(FIND_CREEPS).forEach(function(creep){
					costs.set(creep.pos.x, creep.pos.y, 0xff);
				});

				return costs;
			},
		}
	);
	return result;
}

module.exports.GetNumOfParts = function(_creepBody, _targetBodyPart) {
	var amount;
	for(let idx = 0; idx < _creepBody.length; idx++) {
		if(_creepBody[idx] == _targetBodyPart) {
			amount++;
		}
	}
	return amount;
}


module.exports.CalculateCost = function(_body) {
    var cost = 0;
    for(var i in _body) {
        switch(_body[i]) {
            case MOVE:
                cost = cost + 50;
                break;
            case WORK:
                cost = cost + 100;
                break;
            case CARRY:
                cost = cost + 50;
                break;
            case ATTACK:
                cost = cost + 80;
                break;
            case RANGED_ATTACK:
                cost = cost + 150;
                break;
            case HEAL:
                cost = cost + 250;
                break;
            case CLAIM:
                cost = cost + 600;
                break;
            case TOUGH:
                cost = cost + 10;
                break;
        }
    }
    return cost;
}

module.exports.GetBestBodyParts = function(_energy) {
	let totalParts = Math.floor(_energy / this.CalculateCost([WORK, MOVE, CARRY]));
	var body = [];
	for(let i = 0; i < totalParts; i++) {
		body.push(WORK);
	}
	for(let i = 0; i < totalParts; i++) {
		body.push(CARRY);
	}
	for(let i = 0; i < totalParts; i++) {
		body.push(MOVE);
	}
	return body;
}

module.exports.GetResourcePoints = function(_room)
{
	const resources = _room.find(FIND_SOURCES);
	var aResourcePoints = [];
	for(let idx = 0; idx < resources.length; idx++) {
		var oResourcePoint = {
			ResourceId: resources[idx].id,
			AssignedCreeps: [],
			Entrypoints: 0,
		};
		
		const res = Game.getObjectById(oResourcePoint.ResourceId);
		const reslook = _room.lookForAtArea(LOOK_TERRAIN, res.pos.y-1, res.pos.x-1, res.pos.y+1, res.pos.x+1, true);
		for(let i = 0; i < reslook.length; i++) {
	        if(reslook[i].terrain == "wall") {
	            const found = _room.lookForAt(LOOK_STRUCTURES, reslook[i].x, reslook[i].y);
	            if(found.length > 0) {
	                for(let k = 0; k < found.length; k++) {
	                    if(found[k].structure == "road"){
	                        oResourcePoint.Entrypoints++;
	                    }
	                }
	            }
	        }
	        else {
	            oResourcePoint.Entrypoints++;
	        }
		}
		aResourcePoints.push(oResourcePoint);
	}
	return aResourcePoints;
}
