const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    //generate salt
    const salt = await bcrypt.genSalt(10)

    //hash password
    this.password = await bcrypt.hash(this.password, salt);

});

module.exports = mongoose.model('User', UserSchema);