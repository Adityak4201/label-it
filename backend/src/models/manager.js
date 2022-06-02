const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const managerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    isVerified: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("manger", managerSchema);
