const mongoose = require("mongoose");

// connection is async
const connectDB = async () => {
  await mongoose.connect(
    "Your Sting"
  );
};

module.exports = connectDB;

