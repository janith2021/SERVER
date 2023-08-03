const mongoose = require('mongoose');

const organization = mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
})