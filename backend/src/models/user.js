const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * NOTES: Its not a good idea that we should put any connection request in user schema 
 * connection req bole to ek banda dusre ka connection accept or reject kare
 */

// this is schema how our database should looks like
// like defining a schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required means this is must in collection
      required: true,
      index:true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // trim will remove the sppace in front or back
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please enter valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // this validation only happened when new document is created like during signUp
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw24RDeYEe1Kx6sYeANhPtwv&ust=1760653773155000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMDL_cegp5ADFQAAAAAdAAAAABAE",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (data) {
          return Array.isArray(data) && new Set(data).size === data.length;
        },
        message: "Please don't repeat skills",
      },
    },
  },
  {
    // this will give createdAt and UpdatedAt for all the schema
    timestamps: true,
  }
);

// if we want to find the user using compound index
userSchema.index({firstName:1,lastName:1});

// for auth Create a JWT Token
// {} 1st option me jo daalange wo hide rahega
// arrow function will break here because this keyword will not work in arrow function

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "1d",
  });
  return token;
};

// for login check if password is correct
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

// creating a model
const User = mongoose.model("User", userSchema);

module.exports = User;
