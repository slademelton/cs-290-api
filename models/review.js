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

//add index so user can only add one review per team
ReviewSchema.index({ team: 1, user: 1 }, {unique: true})


ReviewSchema.statics.getAverageRating = async function(id) {
    console.log(`Calculating average fees for team with id of ${id}`.lightBlue);

    //create aggregated array
    const aggregatedArray = await this.aggregate([
        //this array defines "pipeline" that will be executed in order
        {
            $match: {team: id}
        },
        {
            $group: {
                //get group that has team _id and the average of the ratings
                _id: '$team',
                averageRating: {$avg: '$rating'}
            }
        }
    ])
    
    //update team with the average fee value
    try {
        await this.model("Team").findByIdAndUpdate(id, {
            averageRating: aggregatedArray[0].averageRating
        })
    } catch (err) {
        console.error(err);
    }
};

//=============
//middleware
//=============

//call getAverageFees after saving
ReviewSchema.post('save', async function() {
    await this.constructor.getAverageRating(this.team)
})

//call getAverageFees before removing
ReviewSchema.pre('remove', async function() {
    await this.constructor.getAverageRating(this.team)
})

module.exports = mongoose.model("Review", ReviewSchema);