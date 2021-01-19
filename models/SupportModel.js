const mongoose = require("mongoose");
const validator = require("validator");

const supportSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Subject is required"],
    enum: [
      "airtime",
      "data_bundle",
      "cable_tv",
      "electric_bill",
      "wallet_funding",
      "fund_transfer",
      "others",
    ],
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: String,
  query: {
    type: String,
    trim: true,
    required: [true, "Query is required"],
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Support = mongoose.model("Support", supportSchema);

module.exports = Support;
