const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  console.log("admin auth checked");
  const token = "xyz1";
  const authToken = token === "xyz";
  if (!authToken) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    // read the token from request
    const { token } = req.cookies;
    // validate token
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodeMsg = await jwt.verify(token, "Dev@Tinder$799");
    const { _id } = decodeMsg;

    // find user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(`Error : ${err?.message}`);
  }
};

module.exports = {
  userAuth,
};
