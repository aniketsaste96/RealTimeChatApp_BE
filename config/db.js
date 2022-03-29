const mongoose = require('mongoose');
const colors = require("colors")

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB connected:${connect
            .connection.host}`.yellow.bold)
    } catch (error) {
        console.log(error.message.red.bold)
        process.exit();

    }
}
module.exports = connectDB;