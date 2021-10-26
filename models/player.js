const mongoose = require('mongoose');
const PlayerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a player name"],
        trim: true
    },
    position: {
        type: String,
        required: [true, "Please add a player position"],
        trim: true
    },
    jerseyNum: {
        type: Number,
        required: [true, "Please add the player's jersey number"]
    },
    height: {
        type: String,
        required: [true, "Please add a player height"]
    },
    weight: {
        type: Number,
        required: [true, "Please add a player weight"]
    },
    collegeEtc: {
        type: String,
        required: [true, "Please add the player's college or where they played basketball before entering the NBA"]
    },
    injured: {
        type: Boolean,
        required: [true, "Please add whether or not the player is currently injured"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        required: true
    }
})

module.exports = mongoose.model("Player", PlayerSchema);