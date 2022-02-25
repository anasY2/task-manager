const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const auth = require("../middleware/auth");
const route = new express.Router();
//GET Login
route.get("/", (req, res) => {
  res.render("index", {
    title: "LogIn",
  });
});
//GET Signup
route.get("/signup", (req, res) => {
  res.render("signup", {
    title: "SignUp",
    name:"Create an account"
  });
});

//Create User
route.post("/users", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  try {
    await user.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//Login User
route.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error();
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      throw new Error("Incorrect Credentials");
    }
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.redirect("/tasks");
  } catch (e) {
   res.redirect("/signup")
  }
});
//Logout User
route.get("/user/logout", auth, async (req, res) => {
  try {
    const token = req.token;

    req.user.tokens = req.user.tokens.filter((item) => {
      return item.token != token;
    });
    await req.user.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = route;
