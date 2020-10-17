/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config.state.phase2');
 * mod.thing == 'a thing'; // true
 */

var Phase2ToPhase3 =
{
    Name: "Phase2",
    NextState: "Phase3",
    Rule: function ()
    {        
        var upgraders = _.filter(Game.creeps, {memory:{role:"Upgrader"}}).length;
        console.log("Upgraders: "+upgraders);
        return upgraders >= 2;
    }
};

module.exports = [Phase2ToPhase3];