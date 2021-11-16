const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            "Please enter a valid email address"
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'], //admin will be directly assigned in DB
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 12,
        select: false, //whenever api GETs a user, this field will not be returned
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//=============
//middleware
//=============
//hash password when registering user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    //generate salt
    const salt = await bcrypt.genSalt(10)

    //hash password
    this.password = await bcrypt.hash(this.password, salt);

});

//============
//method
//============
//sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

// match user-entered password to hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

//generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    //generate token
    const resetToken = crypto.randomBytes(25).toString('hex');

    //hash token and set resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set expiration
    this.resetPasswordExpire = Date.now() + 10*60*1000;
    
    //return token
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);