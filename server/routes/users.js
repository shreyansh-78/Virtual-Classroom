const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");

// Get User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...userInfo } = user._doc;
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Students (NEW ROUTE)
router.get("/students", verify, async (req, res) => {
  try {
    // Check if the user is a teacher or admin
    if (req.user.isTeacher || req.user.isAdmin) {
      const students = await User.find({ isTeacher: false }).select("-password"); // Exclude password field
      res.status(200).json(students);
    } else {
      res.status(403).json("You're not allowed to access this resource!");
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students", details: err });
  }
});

// Update User
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTOJS_SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const accessToken = jwt.sign(
        { id: updatedUser._id, isTeacher: updatedUser.isTeacher, isAdmin: updatedUser.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      const { password, ...userInfo } = updatedUser._doc;
      res.status(200).json({ ...userInfo, accessToken });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You're not allowed to do this!");
  }
});

// Delete User
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You're not allowed to do this!");
  }
});

module.exports = router;
