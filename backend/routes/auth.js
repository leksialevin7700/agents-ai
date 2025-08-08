const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const SECRET = process.env.JWT_SECRET || "default_secret";
; // Fetch from environment variable or use fallback

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  console.log("Register request received:", { username, email, phoneNumber, password }); // Debugging

  // Check if all fields are provided
  if (!username || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, phoneNumber, password: hashedPassword });
    await newUser.save();

    console.log("New user registered:", newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "An error occurred while registering the user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", { username, password }); // Debug: show incoming data

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found for username:", username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id, username }, SECRET, { expiresIn: "1h" });
    console.log("Login successful. Token generated:", token);

    return res.status(200).json({ token, username });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;


 