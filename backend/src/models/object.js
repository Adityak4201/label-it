const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const objectSchema = new Schema(
  {
    seq: {
      type: Number,
      default: 1,
    },
    objectName: {
      type: String,
      unique: true,
      required: true,
    },
    assignedTo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Unassigned",
      enum: ["Unassigned", "Assigned", "Labelled", "Rejected", "Accepted"],
    },
    images: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Object", objectSchema);
