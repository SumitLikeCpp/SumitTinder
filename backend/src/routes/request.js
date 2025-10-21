const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user.js");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // this fromUserId coming from logged in user
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // humlog sirf 2 chig hi isse kar skte ignore or interest
      // if other things are there nothing will be work eg accepted
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // ab jisko request bhej rhe hai wo db me hona bhi chaiye
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "user not found" });
      }

      // what if existing ConnectionRequest already there
      const existingConnectionRequest = await ConnectionRequest.findOne({
        // from to and vice versa is also true
        // we cal use mongoose or
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "connection Request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
