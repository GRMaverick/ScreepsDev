var PRIORITY_BUILD 		= 1;
var PRIORITY_HARVEST 	= 2;
var PRIORITY_REPAIR 	= 3;
var PRIORITY_UPGRADE 	= 4;
var PRIORITY_DELIVER 	= 5;

module.exports.PRIORITY_BUILD		= PRIORITY_BUILD;
module.exports.PRIORITY_HARVEST 	= PRIORITY_HARVEST;
module.exports.PRIORITY_REPAIR 		= PRIORITY_REPAIR;
module.exports.PRIORITY_UPGRADE 	= PRIORITY_UPGRADE;
module.exports.PRIORITY_DELIVER 	= PRIORITY_DELIVER;

module.exports.Builder = {
	SmallMax: 0,
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
		PRIORITY_UPGRADE
	]
};

module.exports.Harvester = {
	SmallMax: 3,
    BigMax: 0,
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
		PRIORITY_DELIVER,
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
		PRIORITY_HARVEST,
		PRIORITY_UPGRADE
	]
};
