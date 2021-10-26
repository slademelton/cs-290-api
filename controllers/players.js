const Player = require('../models/player');
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
    })
})