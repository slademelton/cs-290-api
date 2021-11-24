const Review = require('../models/review');
const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');

//get /api/v1/players
//get /api/v1/teams/:id/players
exports.getReviews = asyncHandler(async (req, res, next) => {
    //check if team id was passed by user
    if (req.params.id) {
        const reviews = await Review.find({team: req.params.id});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//get /api/v1/reviews/:id
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'team',
        select: 'name description'
    })

    if (!review) {
        return next(new ErrorHandler(`No review found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

//POST /api/v1/teams/:id/reviews
exports.createReview = asyncHandler(async (req, res, next) => {
    //add team and user ids to the request body
    req.body.team = req.params.id;
    req.body.user = req.user.id;

    const team = await Team.findById(req.params.id);

    if (!team) {
        return next(new ErrorHandler(`No team found with id of ${req.params.id}`, 404))
    }

    const review = await Review.create(req.body) //contains submitted data, plus the team and user id we added

    res.status(201).json({
        success: true,
        data: review
    });
});
