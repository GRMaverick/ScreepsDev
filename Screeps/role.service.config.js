var PRIORITY_BUILD 		= 1;
var PRIORITY_HARVEST 	= 2;
var PRIORITY_REPAIR 	= 3;
var PRIORITY_UPGRADE 	= 4;

module.exports.PRIORITY_BUILD = 1;
module.exports.PRIORITY_HARVEST = 2;
module.exports.PRIORITY_REPAIR = 3;
module.exports.PRIORITY_UPGRADE = 4;

module.exports.Builder = {
	SmallMax: 2,
    BigMax: 0,
    Role: "Builder",
    SmallBody: [
		WORK,
		CARRY,
		MOVE
	],
    BigBody: [
		WORK,
		WORK,
		WORK,
		WORK,
		CARRY,
		MOVE
	],
	Priorities: [
		PRIORITY_BUILD,
		PRIORITY_HARVEST,
		//PRIORITY_REPAIR,
		PRIORITY_UPGRADE
	]
};

module.exports.Harvester = {
	SmallMax: 2,
    BigMax: 1,
    Role: "Harvester",
    SmallBody: [
		WORK,
		CARRY,
		MOVE
	],
    BigBody: [
		WORK,
		WORK,
		WORK,
		WORK,
		CARRY,
		MOVE
	],
	Priorities: [
		PRIORITY_HARVEST,
		//PRIORITY_REPAIR,
		PRIORITY_UPGRADE
	]
};

module.exports.Upgrader = {
	SmallMax: 3,
    BigMax: 0,
    Role: "Upgrader",
    SmallBody: [
		WORK,
		CARRY,
		MOVE
	],
    BigBody: [
		WORK,
		WORK,
		WORK,
		WORK,
		CARRY,
		MOVE
	],
	Priorities: [
		//PRIORITY_REPAIR,
		PRIORITY_UPGRADE
	]
};
