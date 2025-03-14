const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    //await user.create({ "emailId": 1 }, { unique: true });
    await user.save();
    

    res.status(200).send("User added successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("Email already exists.");
    }
    res.status(400).send(`Error while saving user: ${err.message}`);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true
    });

    res.status(200).send("user updated successfully");
  } catch (err) {
    res.status(400).send("Error while deleteing user : ", +err.message);
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
