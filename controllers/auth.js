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
    
    //create JWT Token
    const token = user.getSignedJwtToken()

    res.status(201).json({
        success: true,
        data: user.username,
        token,
    });

});

// POST /api/v1/auth/login
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //ensure email and password were included
    if (!email || !password) {
        return next(new ErrorHandler('Please provide an email and password', 400));
    }
    
    //check for user
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    //check if the entered password matches the password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    //create JWT Token
    const token = user.getSignedJwtToken()

    res.status(201).json({
        success: true,
        token,
    });

});