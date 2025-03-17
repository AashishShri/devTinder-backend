const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const allowedStatus = ["ignored", "interested"];
      const fromUserId = req?.user._id;
      const status = req?.params?.status;
      const toUserId = req?.params?.toUserId;

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status types ${status}` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: `User Not found ` });
      }

      // check is any existing data

      const existingData = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingData) {
        return res
          .status(400)
          .json({ message: `Connection Requst already exist` });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.status(200).json({
        message: `${req?.user.firstName} ${status} to ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send(`Error : ${err?.message}`);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req?.user;
      const allowedStatus = ["accepted", "rejected"];
      const status = req?.params?.status;
      const requestId = req?.params?.requestId;

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status types ${status}` });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: `connection request not found` });
      }

      connectionRequest.status = status
      const data = await connectionRequest.save();
      res.status(200).json({
        message: `connection request ${status}`,
        data,
      });

    } catch (err) {
      res.status(400).send(`Error : ${err?.message}`);
    }
  }
);

module.exports = requestRouter;
