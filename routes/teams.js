const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Team = require('../models/team');

const {protect} = require('../middleware/auth');

const { getTeams,
    getTeam, 
    createTeam, 
    updateTeam, 
    deleteTeam,
    getTeamsInRadius,
    uploadTeamPhoto
} = require('../controllers/teams');

//include other resource routers
const playerRouter = require('./players');

//reroute into other resource routers
router.use('/:id/players', playerRouter);



router.route('/').get(advancedResults(Team, 'players'), getTeams).post(protect, createTeam);
router.route('/radius').get(getTeamsInRadius);
router.route('/:id').get(getTeam).put(protect, updateTeam).delete(protect, deleteTeam);
router.route('/:id/photo').put(protect, uploadTeamPhoto);

module.exports = router;
 
 
 