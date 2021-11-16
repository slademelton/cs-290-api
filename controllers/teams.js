const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const path = require('path');

//ex {{url}}/api/v1/teams?wins[lte]=2
exports.getTeams = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
exports.getTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: team
        });
});
exports.createTeam = asyncHandler(async (req, res, next) => {
    //check if user has already created a team
    const publishedTeam = await Team.findOne({ user: req.user.id })
    if (publishedTeam && req.user.role !== 'admin') {
        return next(new ErrorHandler("This user has already created a team", 400));
    }
    req.body.user = req.user.id;    
    const newTeam = await Team.create(req.body);
        res.status(201).json({
            success: true,
            data: newTeam
        });

});
exports.updateTeam = asyncHandler(async (req, res, next) => {
    let team = await Team.findById(req.params.id);    
    
    if (!team) {
            return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
    }

    //ensure user is team owner
    if (team.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler(`User ${req.user.id} not authorized to update this resource`, 403));
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: team
    });
});
exports.deleteTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
        }

        if (team.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler(`User ${req.user.id} not authorized to delete this resource`, 403));
        }

        team.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
});

// /api/v1/teams/radius?zipcode=12345&distanceInMiles=100
exports.getTeamsInRadius = asyncHandler(async (req, res, next) => {
    //get data from req.query
    //object destructuring
    const {zipcode, distanceInMiles} = req.query;

    //get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    console.log(lat, lng);
    
    //calculate radius using radians
    const earthRadiusInMiles = 3959;
    const radius = distanceInMiles / earthRadiusInMiles;


    //query DB and return response
    const teams = await Team.find({
        location: {$geoWithin: { $centerSphere: [ [ lng, lat], radius] }}
    })
    
    res.status(200).json({
        success: true,
        count: teams.length,
        data: teams
    })
});

exports.uploadTeamPhoto = asyncHandler(async (req, res, next) => {
    //find team
    const team = await Team.findById(req.params.id);
    if (!team) {
        return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
    }
    if (team.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler(`User ${req.user.id} not authorized to update this resource`, 403));
    }
    //validate image
    if (!req.files) {
        return next(new ErrorHandler('Please upload a file', 400)); 
    }
    const file = req.files.file;

    //make sure file is an image
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorHandler('Please upload an image file', 404)); 
    }

    //check filesize
    if (file.size > process.env.FILE_UPLOAD_MAX_SIZE) {
        return next(new ErrorHandler(`Please upload an image file smaller than ${process.env.FILE_UPLOAD_MAX_SIZE}`, 400))
    }
    //change filename: photo_teamid
    file.name = `photo_${team._id}${path.parse(file.name).ext}`;
    
    //move image to the proper location
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if (err) {
            console.error(err.red);
            return next(new ErrorHandler(`Problem uploading file`, 500));
        }
    })

    //update team with new image filename
    await Team.findByIdAndUpdate(req.params.id, { photo: file.name});

    res.status(200).json({
        success: true,
        data: {
            team: team._id,
            file: file.name
        }
    })
});