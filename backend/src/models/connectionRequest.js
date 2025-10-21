const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    // connection req there will be a user that send something with another user so we need both user id
    // the typoe of userId from mongoose is not string
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // enum is used for like if we want to user to restrict some values
      // ignore , interested , accepted , rejected
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        // if someone wanted to add something in this enum then error will be generated
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// indexing
// here 1 means ascenging order
// if we put -1 then it is decending order
// this is compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// in schema write normal function

// this is a middleware and this will ran everytime the connection will save
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
