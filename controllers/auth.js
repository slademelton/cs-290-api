const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');

//POST /api/v1/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    res.status(201).json({
        success: true,
    });

});