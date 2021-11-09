const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

//protect routes - require login
exports.protect = asyncHandler(async (req, res, next) => {
    //initialize token variable
    let token;

    //check if token was passed in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    //check if token was passed in cookies - LATER

    //verify the token
    if (!token) {
        return next(new ErrorResponse('You must log in to access that resource', 401));
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        req.user = await User.findById(decodedToken.id);
        next();
    } catch (err) {
        console.log("Error verifying token".red);
        console.error(err);
        return next(new ErrorResponse('Not authorized to access this resource', 401));
    }
})

//grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`Role ${req.user.role} is not authorized to access this resource`, 403));
        }
        next();
    }
}
