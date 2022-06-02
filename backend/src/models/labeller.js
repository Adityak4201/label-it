const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labellerSchema = new Schema(
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
    obj_assigned:{
      type:String,
      default:""
    },
    obj_submitted:{
      type:Number,
      default:0
    },
    images:[{
      type : String
    }],
    file: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("labeller", labellerSchema);
