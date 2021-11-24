const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title for the review"],
        trim: true,
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, "Please add some text"]
    },
    rating: {
        type: Number,
        required: [true, "Please add a rating"],
        min: 1,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
})




module.exports = mongoose.model("Review", ReviewSchema);