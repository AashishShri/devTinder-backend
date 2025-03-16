const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validationSignUpInput } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("email is not valid");
    }
    const users = await User.findOne({ emailId });
    if (!users) {
      throw new Error("EmailId is not present is DB");
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

app.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    res
      .status(200)
      .send(`${user.firstName} is trying to send connection request`);
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("DataBase connected successfully... ");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000 ...");
    });
  })
  .catch(() => {
    console.log("DataBase can not be  connected ...");
  });
