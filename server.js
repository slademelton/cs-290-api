//Slade Melton - CS290 API
//Import NPM/Node Packages
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//Import Local Files
const connectToDb = require('./config/connectToDb');
const errorHandler = require('./middleware/errorHandler');

//load dotenv variables
dotenv.config({path: "./config/config.env"});

//Express Config
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

//Allow CORS
app.use(cors());

//Cookie Parser
app.use(cookieParser());

//Connect to DB
connectToDb();

//file uploading
app.use(fileupload());

//sanitize input
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent xss attacks
app.use(xssClean());

//rate limiter
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_MINUTES * 60 * 1000,
    max: process.env.RATE_LIMIT_REQUESTS,
    message: `Too many requests. You are only allowed ${process.env.RATE_LIMIT_REQUESTS} request per ${process.env.RATE_LIMIT_MINUTES} minutes`
})
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//import routes
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

//use routes
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

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