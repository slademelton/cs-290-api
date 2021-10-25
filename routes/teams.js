const express = require('express');
const router = express.Router();

const { getTeams,
        getTeam, 
        createTeam, 
        updateTeam, 
        deleteTeam,
        getTeamsInRadius
} = require('../controllers/teams');

router.route('/').get(getTeams).post(createTeam);
router.route('/radius').get(getTeamsInRadius);
router.route('/:id').get(getTeam).put(updateTeam).delete(deleteTeam);


module.exports = router;
//done with 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7,
 
 
 