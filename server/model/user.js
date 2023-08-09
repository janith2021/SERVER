const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    _id : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
    },
    status : {
        type : Number,
        default : 0,
        required : true,
    },
    createdAt : {
        type : String,
        // required : true,
    },
    updatedAt : {
        type : String,
        // required : true,
    }
})

const user = mongoose.model('user',userschema);
module.exports = user;