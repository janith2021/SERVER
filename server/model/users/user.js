const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    name : {
        type : String,
        required : true
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
    image : {
        type : String,
    },
    role : {
        type : String,
        default : 'user',
    },
    status : {
        type : Number,
        default : 0,
        required : true
    }
})

const user = mongoose.model('user',userschema);
module.exports = user;