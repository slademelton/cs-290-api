const Player = require('../models/player');
const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');

//get /api/v1/players
//get /api/v1/teams/:id/players
exports.getPlayers = asyncHandler(async (req, res, next) => {
    let query;

    //check if team id was passed by user
    if (req.params.id) {
        query = Player.find({team: req.params.id});
    } else {
        query = Player.find().populate({
            path: 'team',
            select: 'name description'
        });
    }

    const players = await query;
    res.status(200).json({
        success: true,
        count: players.length,
        data: players,
    });
});

exports.getPlayer = asyncHandler(async (req, res, next) => {
   const player = await Player.findById(req.params.playerId).populate({
       path: 'team',
       select: 'name description'
   })

   if (!player) {
       return next(new ErrorHandler(`No player with ID of ${req.params.playerId}`, 404));
   }



    res.status(200).json({
        success: true,
        data: player,
    });
});

// POST /api/v1/teams/:id/players
exports.createPlayer = asyncHandler(async (req, res, next) => {
    //update req.body to add team _id
    req.body.team = req.params.id;


    //get the team
    const team = await Team.findById(req.params.id);

    //make sure team exists
    if (!team) {
        return next (new ErrorHandler(`No team with ID of ${req.params.id}`, 404));
    }
    //create player, assigning it to team
    const player = await Player.create(req.body); //will include the team _id we added

    //send response
    res.status(201).json({
        success: true,
        data: player
    })
});