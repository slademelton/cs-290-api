const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

//POST /api/v1/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    
    const user = await User.create({
        username,
        email,
        password,
        role
    })
    
    sendTokenResponse(user, 201, res);

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

    sendTokenResponse(user, 200, res);

});

//GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});
//POST /api/v1/auth/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email});

    if (!user) {
        return next(new ErrorResponse('No user found with that email', 404));
    }

    //get a reset token
    const resetToken = user.getResetPasswordToken();
    //save that token to the user
    await user.save({ validateBeforeSave: false });

    //create reset url
    //Format: https://localhost:3000/api/v1/auth/resetpassword/:resettoken
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    
    //create message
    const message = `You are receiving this email because someone has requested the rest of a password at NBA API. Please make a PUT request to: \n\n ${resetUrl}`;

    //send email
    try {
        await sendEmail({
            recipient: user.email,
            subject: "Password Reset Token",
            message
        })
        res.status(200).json({
            success: true,
            data: "Email sent",
        });
    } catch (err) {
        console.log(err);

        //clear reset password fields from the DB
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('Problem sending email', 500));
    }

    
});

//=====================
//utility functions
//=====================
//get token from model, create cookie, and send response
const sendTokenResponse = (user, status, res) => {
    //create JWT token
    const token = user.getSignedJwtToken();

    //cookie options
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(status)
        .cookie("token", token, options)
        .json({
            success: true,
            token,
        });
}