const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies

    const { token } = req.cookies;
    if(!token){
      throw new Error("Token is not valid");
    }
    // Validate the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

    // find the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    // if i find out the user then this user will get into req
    req.user = user;
    // next is called to move to the request handler
    // jab tak ye userAuth run nhi karega aage wale me jayega hi nhi
    // error de dega
    next();
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};

// this userAuth can be add to any req handler and make that handler auth