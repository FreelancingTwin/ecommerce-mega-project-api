const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const JWT_SECRET = process.env.JWT_SECRET;

const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

//handle errors
const handleErrors = err => {
  console.log(err, err.code);
  const errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  //duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  //validation errors
  if (
    err.message.includes("User validation failed" || "user validation failed")
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//CREATE JSON WEB TOKEN

//three days
const maxAge = 3 * 24 * 60 * 60;
const createToken = id => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};

//controller actions
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await UserModel.create({ email, password });
    const token = createToken(newUser._id);
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ newUser, jwt: token });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // console.log('fetching users')
    const user = await UserModel.staticLogin(email, password);
    // console.log("authController68 USER:",user);
    const token = createToken(user._id);
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user, jwt: token });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (_, res) => {
  res.status(200).json({jwt: ''})
  res.redirect("http://localhost:5173/");
};

