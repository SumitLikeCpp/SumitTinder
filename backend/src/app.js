const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const validator = require("validator");
const { validSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

// middleware that use to be read the json format
app.use(express.json());

// POST API to add user in Schema
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    // for login we have 2 things mail and password
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is not present");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successfully");
    } else {
      res.status(400).send("ERROR : " + err.message);
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Get user by mail
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail }); // this is array of people with this mail
    if (user.length === 0) res.status(404).send("User not found");
    else {
      console.log(user);
      res.send("User found successfully");
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Feed API like to find all the user of your db
app.get("/feed", async (req, res) => {
  // this empty object we sending in {} is returning all the things for user
  const user = await User.find({});
  try {
    console.log(user);
    res.send("Data Fetched Successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Update Data
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    // okay now like we dont want to user to update their gmail or something
    // this will iterates over all the document
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    // humlog user.js me kisi schema me validate function use kar rhe the like in gender
    // so by default validator is not running in updating in db so we use runValidators
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    console.log(user);

    res.send("user update successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED " + err.message);
  }
});

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
