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
    mobile : {
        type : String,
        required : true,
    },
    image : {
        type : String,
    },
    role : {
        type : String,
        default : 'user',
    }
})

const user = mongoose.model('user',userschema);
module.exports = user;