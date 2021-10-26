const Player = require('../models/player');
const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');

//get /api/v1/players
//get /api/v1/teams/:id/players
exports.getPlayers = asyncHandler(async (req, res, next) => {
    //check if team id was passed by user
    if (req.params.id) {
        const players = await Player.find({team: req.params.id});
        return res.status(200).json({
            success: true,
            count: players.length,
            data: players
        });
    } else {
        res.status(200).json(res.advancedResults);
    }

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

//put /api/v1/players/playerId
exports.updatePlayer = asyncHandler(async (req, res, next) => {
    
    let player = await Player.findById(req.params.playerId);

    if (!player) {
        return next(new ErrorHandler(`No team with ID of ${req.params.playerId}`, 404));
    }
    
    player = await Player.findByIdAndUpdate(req.params.playerId, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: player,
    })
});

//delete /api/v1/players/:playerId
exports.deletePlayer = asyncHandler(async (req, res, next) => {
    
    const player = await Player.findById(req.params.playerId);

    if (!player) {
        return next(new ErrorHandler(`No team with ID of ${req.params.playerId}`, 404));
    }
    
    await player.remove();

    res.status(200).json({
        success: true,
        data: {},
    })
});