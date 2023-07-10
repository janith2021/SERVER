const mongoose = require('mongoose')

const OTP = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: { type: Date, default: Date.now(), index: { expires: 1800 } },
  },
  { timestamps: true }
);


const otp = mongoose.model('otp',OTP)
module.exports = otp