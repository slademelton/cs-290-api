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
    fee: {
        type: Number,
        required: true,
        min: [0, "Fee cannot be less than 0"]
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


//using this for fees
//=============
//statics
//=============
//static method to get avg of player fees
PlayerSchema.statics.getAverageFees = async function(id) {
    console.log(`Calculating average fees for team with id of ${id}`.lightBlue);

    //create aggregated array
    const aggregatedArray = await this.aggregate([
        //this array defines "pipeline" that will be executed in order
        {
            $match: {team: id}
        },
        {
            $group: {
                //get group that has team _id and the average of the fees
                _id: '$team',
                averageFee: {$avg: '$fee'}
            }
        }
    ])
    
    //update team with the average fee value
    try {
        await this.model("Team").findByIdAndUpdate(id, {
            averageFee: Math.ceil(aggregatedArray[0].averageFee)
        })
    } catch (err) {
        console.error(err);
    }
};

//=============
//middleware
//=============

//call getAverageFees after saving
PlayerSchema.post('save', async function() {
    await this.constructor.getAverageFees(this.team)
})

//call getAverageFees before removing
PlayerSchema.pre('remove', async function() {
    await this.constructor.getAverageFees(this.team)
})

module.exports = mongoose.model("Player", PlayerSchema);