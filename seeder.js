const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const colors = require('colors');

//load dotenv variables
dotenv.config({path: './config/config.env'});

//load models
const Team = require('./models/team');
const Player = require('./models/player');
const User = require('./models/user');
const Review = require('./models/review');

//connect to DB
mongoose.connect(process.env.DB_URI);

//load JSON files
const teams = JSON.parse(fs.readFileSync(`${__dirname}/data/team.json`, 'utf-8'));
const players = JSON.parse(fs.readFileSync(`${__dirname}/data/players.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'));

//import into DB

const importData = async () => {
    try {
        //await User.create(users);
        await Team.create(teams);
        await Player.create(players);
        await Review.create(reviews);
        console.log('Data imported...'.green.inverse);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

//delete from DB
const deleteData = async () => {
    try {
        await Review.deleteMany();
        await Team.deleteMany();
        await Player.deleteMany();
        //await User.deleteMany();
        console.log('Data deleted...'.red.inverse);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

//parse arguments from CLI
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
} else {
    console.log("You must pass an argument: -i or -d".yellow);
    process.exit(3);
}