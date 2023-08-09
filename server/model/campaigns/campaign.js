const mongoose = require('mongoose')

const campaign = mongoose.Schema({
    _id : {
        type : String,
    },
    name : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true
    },
    organizationid : {
        type : String,
        required : true,
        // ref : "organizations"
    },
    division : {
        type : String,
        required : true,
    },
    createdAt : {
        type : String,
    },
    updatedAt : {
        type : String,
    }  

})

const campaigns = mongoose.model("campaigns",campaign)
module.exports = campaigns