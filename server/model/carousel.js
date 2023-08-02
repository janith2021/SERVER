const mongoose = require('mongoose')

const carousel = mongoose.Schema({
    image : {
        type : String,
        required : true,
    },
    caption : {
        type : String,
    },
    status : {
        type : String,
        required : true
    }
})

const slides = mongoose.model("carousels",carousel)

module.exports = slides