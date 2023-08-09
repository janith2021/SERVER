const mongoose = require('mongoose');

const organization = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  division : {
    type : String,
    required : true,
  },
  member: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      mobile: {
        type: String,
      },
      role : {
        type: String,
        default : "Organization",
      }
    },
  ],
  createdAt : {
    type : String,
    required :true,
  },
  updatedAt : {
    type : String,
    required : true,
  }
});

const organizations = mongoose.model("organizations",organization)

module.exports = organizations




