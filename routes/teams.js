const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Team = require('../models/team');

const {protect, authorize} = require('../middleware/auth');

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
const reviewRouter = require('./reviews');


//reroute into other resource routers
router.use('/:id/players', playerRouter);
router.use('/:id/reviews', reviewRouter);



router.route('/').get(advancedResults(Team, 'players'), getTeams).post(protect, authorize('publisher', 'admin'), createTeam);
router.route('/radius').get(getTeamsInRadius);
router.route('/:id').get(getTeam).put(protect, authorize('publisher', 'admin'), updateTeam).delete(protect, authorize('publisher', 'admin'), deleteTeam);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadTeamPhoto);

module.exports = router;
 
 
 