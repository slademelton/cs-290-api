const Team = require('../models/team');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');
exports.getTeams = asyncHandler(async (req, res, next) => {
        const teams = await Team.find()
        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });

});
exports.getTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return next(new ErrorHandler(`University not found with id of ${req.params.id}`, 404));
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
            return next(new ErrorHandler(`University not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: team
        });
});
exports.deleteTeam = asyncHandler(async (req, res, next) => {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return next(new ErrorHandler(`University not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
});
