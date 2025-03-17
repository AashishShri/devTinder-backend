const express = require("express");
const User = require("../models/user");
const { validationSignUpInput } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignUpInput(req);
    const { firstName, lastName, emailId, password } = req.body;
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.status(200).send("User added successfully");
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).send("Email already exists.");
    }
    res.status(400).send(`Error while saving user: ${err?.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("email is not valid");
    }
    const users = await User.findOne({ emailId });
    if (!users) {
      throw new Error("Invalid creddentaials");
    }
    const isPasswordValid = await users.validatePassword(password);
    if (isPasswordValid) {
      // const token = await jwt.sign({ _id: users._id }, "Dev@Tinder$799",  { expiresIn: '1h' });

      const token = await users.getJWT();

      res.cookie("token", token);
      res.status(200).send("Login Successfully");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send(`Error while login user: ${err?.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie('token',null,{
        expires : new Date(Date.now())
      }).send("Logout successfull")
  });

module.exports = authRouter;
