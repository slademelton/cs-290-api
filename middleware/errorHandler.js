const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    //log the error to the console for debugging
    console.error(err);
    console.log(err.name);
    
    //initialize default error object
    let error = {};
    error.statusCode = err.statusCode;
    error.message = err.message;

    //mongoose bad _id format
    if (err.name === 'CastError') {
        const message = `Invalid resource id.`;
        error = new ErrorResponse(message, 400);
    }

    //mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
        error = new ErrorResponse(message, 400);
    }
    //mongoose validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors);
        error = new ErrorResponse(message, 400);
    }

    //send JSON response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
}

module.exports = errorHandler;