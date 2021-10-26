const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

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
    wins: {
        type: Number,
        required: true,
    },
    averageFee: {
        type: Number
    },
    losses: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        default: "no-photo.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//==============
//middleware
//==============
//create slug from name
TeamSchema.pre("save", function(next) {
    this.slug = slugify(this.name, {
        lower: true,
        replacement: '_',
    });
    next();
});

//geocode and create location field
TeamSchema.pre("save", async function(next) {
    const query = await geocoder.geocode(this.address);
    const loc = query[0];
    this.location = {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
        formattedAddress: loc.formattedAddress,
        street: loc.stretName,
        city: loc.city,
        state: loc.stateCode,
        zipcode: loc.zipcode,
        country: loc.countryCode
    }
    //don't save address in DB, since we have better representation as a geocode
    this.address = undefined;
    next();
});

//cascade delete players when a team is deleted
TeamSchema.pre('remove', async function(next) {
    console.log(`Players being deleted from team ${this.name}`);
    await this.model("Player").deleteMany({ team: this._id });
    next();
}); 

//==============
//virtuals
//==============
//reverse populate with virtuals
TeamSchema.virtual('players', {
    ref: 'Player',
    localField: '_id',
    foreignField: 'team',
    justOne: false
});

module.exports = mongoose.model("Team", TeamSchema);