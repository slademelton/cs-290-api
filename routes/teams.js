const express = require('express');
const router = express.Router();

const { getTeams,
        getTeam, 
        createTeam, 
        updateTeam, 
        deleteTeam 
} = require('../controllers/teams');

router.route('/').get(getTeams).post(createTeam);
router.route('/:id').get(getTeam).put(updateTeam).delete(deleteTeam);


module.exports = router;
//done with 7.1 
 
 
 