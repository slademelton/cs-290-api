//Slade Melton - CS290 API
//Import NPM/Node Packages
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

//Import Local Files
const connectToDb = require('./config/connectToDb');
const errorHandler = require('./middleware/errorHandler');

//load dotenv variables
dotenv.config({path: "./config/config.env"});

//Express Config
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Connect to DB
connectToDb();

//file uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//import routes
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const authRoutes = require('./routes/auth');

//use routes
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/auth', authRoutes);

//error handling middleware - must be last app.use()!!
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`);
});

//Handle any unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    //Log the problem to the console
    console.log(`Unhandled Promise Rejection: ${err.message}`.white.bgRed.bold.underline);
    console.log(err);
    //Stop the server and the process
    server.close(() => {
        process.exit(1);
    });

});
//done with 13.1, 13.2, 13.3