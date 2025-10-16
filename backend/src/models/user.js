const mongoose = require("mongoose");
const validator = require("validator");

// this is schema how our database should looks like
// like defining a schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required means this is must in collection
      required: true,
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

// creating a model
const User = mongoose.model("User", userSchema);

module.exports = User;
