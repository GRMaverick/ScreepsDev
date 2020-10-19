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
	Min: 4,
    Role: "Builder",
    DefaultBody: [
		WORK,
		CARRY,
		MOVE
	]
};

module.exports.Harvester = {
	Min: 5,
    Role: "Harvester",
	DefaultBody: [
		WORK,
		CARRY,
		MOVE
	]
};

module.exports.Upgrader = {
	Min: 3,
    Role: "Upgrader",
	DefaultBody: [
		WORK,
		CARRY,
		MOVE
	]
};
