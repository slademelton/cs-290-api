const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const Player = require('../models/player');


const {protect} = require('../middleware/auth');

const { 
    getPlayers,
    getPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer
} = require('../controllers/players');

// /api/v1/players
// /api/v1/teams/:id/players
router.route('/').get(advancedResults(Player, {
    path: 'team',
    select: 'name description'
    }), 
    getPlayers
    )
    .post(protect, createPlayer);
router.route('/:playerId').get(getPlayer).put(protect, updatePlayer).delete(protect, deletePlayer);

module.exports = router;