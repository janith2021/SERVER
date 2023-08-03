const mongoose = require('mongoose')

const campaign = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    division : {
        type : String,
        require : true,
    },
    expected : {
        type : String,
    },
    

})