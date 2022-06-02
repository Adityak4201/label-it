require("dotenv").config();
const mongoose = require("mongoose");

const connectMongoDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database 🌱"));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = { connectMongoDB };
