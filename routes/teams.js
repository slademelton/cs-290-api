const express = require('express');
const router = express.Router();

//include other resource routers
const playerRouter = require('./players');

//reroute into other resource routers
router.use('/:id/players', playerRouter);

const { getTeams,
        getTeam, 
        createTeam, 
        updateTeam, 
        deleteTeam,
        getTeamsInRadius,
        uploadTeamPhoto
} = require('../controllers/teams');

router.route('/').get(getTeams).post(createTeam);
router.route('/radius').get(getTeamsInRadius);
router.route('/:id').get(getTeam).put(updateTeam).delete(deleteTeam);
router.route('/:id/photo').put(uploadTeamPhoto);

module.exports = router;
 
 
 