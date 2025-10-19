const mongoose = require("mongoose");

// connection is async
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://your string"
  );
};

module.exports = connectDB;

