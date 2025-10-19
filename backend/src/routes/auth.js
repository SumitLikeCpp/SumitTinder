// express router for authentication
const express = require("express");
const authRouter = express.Router();
const { validSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// POST API to add user in Schema
authRouter.post("/signup", async (req, res) => {
  // req.body is now javascript object
  // console.log(req.body);
  // reading the request

  // const userObj = {
  //   firstName: "Sumit",
  //   lastName: "Kumar",
  //   emailId: "sumit@kumar.com",
  //   password: "sumitisbest",
  // };

  // adding this data in Schema
  // creating a new instance of User MOdel
  // we can change entite userObj to req.body because this is noe js object which can be done via express.json which is middleware

  try {
    // validation the data
    validSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // encryption of password -> we will using bcrypt
    // more the number of salt its more tough to dncrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    //console.log(passwordHash);
    const data = req.body;
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // for login we have 2 things mail and password
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is not present");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // this is for getting the user instances(in schema method in user.js)
      const token = await user.getJWT();

      // Add the token to cookie ans send the response back to the user
      // httponly means this will only work in http mode not on http
      // this cookie will expire in 8hr
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login successfully");
    } else {
      res.status(400).send("ERROR : " + err.message);
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      // just setting the expiry time just now this will work
      expires: new Date(Date.now()),
    })
    .send("logout success");
  // phle res.cookie hua and after this res.send hua this is called chain 
});

module.exports = authRouter;
