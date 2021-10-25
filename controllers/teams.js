const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

//ex {{url}}/api/v1/teams?wins[lte]=2
exports.getTeams = asyncHandler(async (req, res, next) => {
    //initialize query
    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const fieldsToRemove = ["select", "sort"]

    //loop over fieldsToRemove and delete them from reqQuery
    fieldsToRemove.forEach((param) => {
        delete reqQuery[param];
    })
    //create custom query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
        return "$" + match;
    });
    //console.log(queryStr);
    query = Team.find(JSON.parse(queryStr));
    
    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(' ');
        query = query.select(fields);
    }
    
    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('createdAt');
    }

    // run query and return results
    
    const teams = await query;
        
    res.status(200).json({
        success: true,
        count: teams.length,
        data: teams
    });

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
        const newTeam = await Team.create(req.body);
        res.status(201).json({
            success: true,
            data: newTeam
        });

});
exports.updateTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!team) {
            return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: team
        });
});
exports.deleteTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return next(new ErrorHandler(`Team not found with id of ${req.params.id}`, 404));
        }
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
