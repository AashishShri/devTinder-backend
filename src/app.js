const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validationSignUpInput } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

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
    const isPasswordValid = await bcrypt.compare(password, users.password);
    if (isPasswordValid) {
      res.status(200).send("Login Successfully");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send(`Error while saving user: ${err?.message}`);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("Error User not found : ");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error while getting user : ", +err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error while getting user : ", +error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete({ _id: userId });
    //const users =  await User.findByIdAndDelete({userId})
    console.log("users", users);

    res.status(200).send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Error while deleteing user : ", +err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req?.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((e) =>
      ALLOWED_UPDATES.includes(e)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updated not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills can not be more then 10");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });

    res.status(200).send("user updated successfully");
  } catch (err) {
    res.status(400).send("Update failed : " + err.message);
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
