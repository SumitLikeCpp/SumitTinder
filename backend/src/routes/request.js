const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user.js");
const { userAuth } = require("../middlewares/auth.js");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // Sending a connection req
    console.log(`${user.firstName} sending connection Request`);
    res.send(`${user.firstName} sending connection Request`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = requestRouter;