const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/review');

const { protect, authorize } = require('../middleware/auth');

const { getReviews, getReview, createReview } = require('../controllers/reviews');

// /api/v1/reviews
// /api/v1/teams/:id/reviews
router.route('/').get(advancedResults(Review, {
    path: 'team',
    select: 'name description'
    }), 
    getReviews
).post(protect, authorize('user', 'admin'), createReview);

router.route('/:id').get(getReview);

module.exports = router;