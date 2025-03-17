const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchma = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // This adds a unique constraint
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email id : ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Enter a strong Password : ${value}`);
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://akshaysaini.in/img/akshay.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`Invalid photo url : ${value}`);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default for all the users",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchma.methods.getJWT = async function () {
  const users = this;
  const token = await jwt.sign({ _id: users._id }, "Dev@Tinder$799", {
    expiresIn: "1h",
  });
  return token;
};

userSchma.methods.validatePassword = async function (passwordInputByUser) {
  const users = this;
  const passwordHanshed = users.password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHanshed );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchma);

module.exports = User;
