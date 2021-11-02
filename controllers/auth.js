const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');

//POST /api/v1/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    
    const user = await User.create({
        username,
        email,
        password,
        role
    })

    res.status(201).json({
        success: true,
        data: user.username,
    });

});