const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const Player = require('../models/player');


const { protect, authorize } = require('../middleware/auth');

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
    .post(protect, authorize('publisher', 'admin'), createPlayer);
router.route('/:playerId').get(getPlayer).put(protect, authorize('publisher', 'admin'), updatePlayer).delete(protect, authorize('publisher', 'admin'), deletePlayer);

module.exports = router;