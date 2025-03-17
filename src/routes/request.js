const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    res
      .status(200)
      .send(`${user.firstName} is trying to send connection request`);
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

module.exports = requestRouter;
