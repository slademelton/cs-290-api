exports.getTeams = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "Get all teams"
    })
}
exports.getTeam = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `Get information about team with id of ${req.params.id}`
    })
}
exports.createTeam = (req, res, next) => {
    res.status(201).json({
        success: true,
        data: "Create new team"
    })
}
exports.updateTeam = (req, res, next) => {
    res.status(201).json({
        success: true,
        data: `Update team with id of ${req.params.id}`
    })
}
exports.deleteTeam = (req, res, next) => {
    res.status(201).json({
        success: true,
        data: `Delete team with id of ${req.params.id}`
    })
}
