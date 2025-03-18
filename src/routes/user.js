const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const User = require("../models/user");

const user_safe_data = "firstName lastName age photoUrl about skills";

// Get all pending connection request for loggdin user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggdinUser = req?.user;

    const data = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggdinUser._id,
    }).populate("fromUserId", "firstName lastName age");
    //.populate("fromUserId",['firstName','lastName','age']); // both way the same sthings

    res.status(200).json({
      message: `List of connection request `,
      data,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err?.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggdinUser = req?.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggdinUser._id, status: "accepted" },
        { fromUserId: loggdinUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age")
      .populate("toUserId", "firstName lastName age");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggdinUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({
      message: `List of connection request `,
      data,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err?.message}`);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggdinUser = req?.user;
    const page = parseInt(req?.query.page) || 1;
    const limit = parseInt(req?.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggdinUser._id }, { fromUserId: loggdinUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggdinUser._id } },
      ],
    })
      .select(user_safe_data)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: `List of connection request `,
      data,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err?.message}`);
  }
});
module.exports = userRouter;
