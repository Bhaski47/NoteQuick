const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To DB")
    } catch (err) {
        console.log("Error Connecting To DB \n",err);
    }
}

module.exports = {connectDB};
