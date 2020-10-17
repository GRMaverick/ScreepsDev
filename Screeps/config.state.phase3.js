/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config.state.phase3');
 * mod.thing == 'a thing'; // true
 */

var Phase2ToPhase3 =
{
    Name: "Phase3",
    NextState: "Phase4",
    Rule: function ()
    {
        return false;
    }
};

module.exports = [Phase2ToPhase3];