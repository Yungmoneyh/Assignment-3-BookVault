const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ------------------- REGISTER -------------------

// Show register page
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// Handle registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check all fields
    if (!username || !email || !password) {
      return res.render("auth/register", { error: "All fields are required" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.render("auth/register", { error: "Username or email already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Start session
    req.session.userId = newUser._id;

    res.redirect("/books");
  } catch (err) {
    console.error("Register Error:", err);
    res.render("auth/register", { error: "Registration failed" });
  }
});

// ------------------- LOGIN -------------------

// Show login page
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// Handle login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", { error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", { error: "Invalid email or password" });
    }

    // Compare password (assuming comparePassword method exists)
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.render("auth/login", { error: "Invalid email or password" });
    }

    req.session.userId = user._id;
    res.redirect("/books");
  } catch (err) {
    console.error("Login Error:", err);
    res.render("auth/login", { error: "Login failed" });
  }
});

// ------------------- LOGOUT -------------------

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
