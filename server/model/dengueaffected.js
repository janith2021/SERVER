const mongoose = require('mongoose')

const maps = mongoose.Schema({
    _id : {
        type : String,
        required : true,
    },
    area : {
        type : String,
        required : true
    },
    count : {
        type : Number,
        required : true,
        default : 0,
    }
})

const Map = mongoose.model('affects',maps)

module.exports = Map