const express = require('express');
const router = express.Router({ mergeParams: true });

const { 
    getPlayers,
    getPlayer,
    createPlayer
} = require('../controllers/players');

// /api/v1/players
// /api/v1/teams/:id/players
router.route('/').get(getPlayers).post(createPlayer);
router.route('/:playerId').get(getPlayer);

module.exports = router;