const { default: mongoose } = require("mongoose");

const villagers = mongoose.Schema({
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
  image: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50581.jpg?w=740",
  },
  mobile : {
    type: String,
    required : true,
  },
  role : {
    type : String,
    default : "Villager"
  },
  createdAt : {
    type : String,
  },
  updatedAt : {
    type : String,
  }


});

const villager = mongoose.model("villagers",villagers)

module.exports = villager