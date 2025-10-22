const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const validator = require("validator");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.js")



const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

// middleware that use to be read the json format
app.use(express.json());
// middleware for reading token
app.use(cookieParser());

// 1st it will check authRouter and go further line by line
app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter);

connectDB()
  .then(() => {
    console.log("Database connected success");

    // after connection the server should be connected
    app.listen(7777, () => {
      console.log("Server is listning to port 7777");
    });
  })
  .catch((err) => {
    console.error("Error");
  });
