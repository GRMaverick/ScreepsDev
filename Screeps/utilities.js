module.exports.LogError = function(_funcName, _error) {
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
