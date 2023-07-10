const mongoose = require('mongoose')

async function connect(){
    const database = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
    return database;
}

module.exports = connect;