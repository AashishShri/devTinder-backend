const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const {
  validateEditProfileData,
  validateEditProfilePasswordData,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }

    const logdinUser = req?.user;

    Object.keys(req.body).forEach((key) => {
      logdinUser[key] = req.body[key];
    });
    await logdinUser.save();
    res.status(200).json({
      message: `${logdinUser.firstName} profile updated successfully`,
      data: logdinUser,
    });
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateEditProfilePasswordData(req)) {
      throw new Error("Invalid password Edit request");
    }

    const { newPassword, oldPassword } = req?.body;

    const logdinUser = req?.user;

    const isPasswordValid = await logdinUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Old password mismatched");
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    (logdinUser.password = passwordHash), await logdinUser.save();
    res.status(200).json({
      message: `${logdinUser.firstName} profile password changed successfully`,
    });
  } catch (err) {
    res.status(400).send(`Error while getting profile: ${err?.message}`);
  }
});

module.exports = profileRouter;
