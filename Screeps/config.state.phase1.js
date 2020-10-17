var Phase1ToPhase2 =
{
    Name: "Phase1",
    NextState: "Phase2",
    Rule: function ()
    {
        var harvesters = _.filter(Game.creeps, {memory:{role:"Harvester"}}).length;
        console.log("Harvesters: "+harvesters);
        debugger;
        return harvesters >= 2;
    }
};

module.exports = [Phase1ToPhase2];
