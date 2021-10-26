const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Team = require('../models/team');

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



router.route('/').get(advancedResults(Team, 'players'), getTeams).post(createTeam);
router.route('/radius').get(getTeamsInRadius);
router.route('/:id').get(getTeam).put(updateTeam).delete(deleteTeam);
router.route('/:id/photo').put(uploadTeamPhoto);

module.exports = router;
 
 
 