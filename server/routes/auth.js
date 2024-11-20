const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Attempt to create a new user object
    const newUser = new User({
      email: req.body.email,
      fullname: req.body.fullname,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTOJS_SECRET_KEY
      ).toString(),
      isTeacher: req.body.isTeacher,
      course: req.body.course,
      semester: req.body.semester,
    });

    // Save user to the database
    const user = await newUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, isTeacher: user.isTeacher, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    // Exclude password from the response
    const { password, ...userInfo } = user._doc;
    
    // Send success response with user info and token
    res.status(201).json({ ...userInfo, accessToken });
  } catch (err) {
    console.error("Error during registration:", err); // Log the error for debugging
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }

    // Decrypt stored password
    const bytes = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTOJS_SECRET_KEY
    );
    const originalPwd = bytes.toString(CryptoJS.enc.Utf8);

    // Check if the provided password matches
    if (req.body.password !== originalPwd) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, isTeacher: user.isTeacher, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    // Exclude password from the response
    const { password, ...userInfo } = user._doc;

    // Send success response with user info and token
    res.status(200).json({ ...userInfo, accessToken });
  } catch (err) {
    console.error("Error during login:", err); // Log the error for debugging
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
