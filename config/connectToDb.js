const mongoose = require('mongoose');
const connectToDb = async () => {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`.green);
}

module.exports = connectToDb;
