const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Aashish",
    lastName: "Aashish",
    emailId: "Aashish",
    password: "Aashish",
    age: 30,
    gender: "male",
  });
  try {
    await user.save();
    res.send("user added sucessfully")
  } catch (err) {
    res.status(400).send("Error while saving user : ", + err.message)
    console.log();
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
