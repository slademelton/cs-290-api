const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a team name"],
        unique: [true, "That name is already taken"],
        trim: true,
        maxLength: [50, "Name must be 50 characters or less"]
    },
    slug: String, // A url-friendly version of the name
    description: {
        type: String,
        required: [true, "Please add a team description"],
        maxLength: [500, "Description must be 500 characters or less"]
    },
    website: {
        type: String,
        required: true,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please add a valid URL with HTTP or HTTPS"
        ]
    },
    email: {
        type: String,
        required: true,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            "Please enter a valid email address"
        ]
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number must be 20 characters or less"]
    },
    address: {
        type: String,
        required: [true, "Please add an address"],     
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          //required: true
        },
        coordinates: {
          type: [Number], // [10, 20]
          required: true
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        Country: String
    },
    coach: {
        type: String,
        trim: true,
        maxlength: [50, "Coach must be 50 characters or less"]
    },
    record: {
        type: String,
        required: [true, "Please enter a team record."],
        maxlength: [7, "Record must be 7 characters or less"]
    },
    photo: {
        type: String,
        default: "no-photo.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Will be adding mongoose middleware later that calculates lots of these fields

module.exports = mongoose.model("Team", TeamSchema);