const Team = require('../models/team');

exports.getTeams = async (req, res, next) => {
    try {
        const teams = await Team.find()
        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        })
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
}
exports.getTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: team
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
}
exports.createTeam = async (req, res, next) => {
    try {
        const newTeam = await Team.create(req.body);
        res.status(201).json({
            success: true,
            data: newTeam
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
}
exports.updateTeam = async (req, res, next) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!team) {
            return res.status(404).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: team
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        })
    }
}
exports.deleteTeam = async (req, res, next) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        })
    }
}
