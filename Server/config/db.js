const mongoose = require('mongoose');
const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;