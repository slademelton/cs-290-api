const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/review');

const { protect, authorize } = require('../middleware/auth');

const { getReviews } = require('../controllers/reviews');

// /api/v1/reviews
// /api/v1/teams/:id/reviews
router.route('/').get(advancedResults(Review, {
    path: 'team',
    select: 'name description'
    }), 
    getReviews
);

module.exports = router;