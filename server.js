//Slade Melton - CS290 API
const express = require('express');
const dotenv = require('dotenv');

//load dotenv variables
dotenv.config({path: "./config/config.env"});

const app = express();
const PORT = process.env.PORT || 3000;

//middleware

//import routes
const teamsRoutes = require('./routes/teams');

//use routes
app.use('/api/v1/teams', teamsRoutes);

app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`);
});



