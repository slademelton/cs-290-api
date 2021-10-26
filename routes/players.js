const express = require('express');
const router = express.Router({ mergeParams: true });

const { 
    getPlayers
} = require('../controllers/players');

router.route('/').get(getPlayers);

module.exports = router;