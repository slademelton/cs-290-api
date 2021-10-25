//Slade Melton - CS290 API
//Import NPM Packages
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

//Import Local Files
const connectToDb = require('./config/connectToDb');
const errorHandler = require('./middleware/errorHandler');

//load dotenv variables
dotenv.config({path: "./config/config.env"});

//Express Config
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

//Connect to DB
connectToDb();

//import routes
const teamsRoutes = require('./routes/teams');

//use routes
app.use('/api/v1/teams', teamsRoutes);

//error handling middleware - must be last app.use()!!
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`);
});

//Handle any unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    //Log the problem to the console
    console.log(`Unhandled Promise Rejection: ${err.message}`.white.bgRed.bold.underline);
    //Stop the server and the process
    server.close(() => {
        process.exit(1);
    })

})

//done with 10.1, 10.2, 10.3, 10.4, 
