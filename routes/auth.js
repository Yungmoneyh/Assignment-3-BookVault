// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register page
router.get('/register', (req, res) => res.render('auth/register', { error: null }));

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.render('auth/register', { error: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.render('auth/register', { error: 'Email already exists' });

    const user = new User({ email });
    await user.hashPassword(password);
    await user.save();

    req.session.user = { _id: user._id, email: user.email };
    return res.redirect('/books');
  } catch (err) {
    console.error(err);
    return res.render('auth/register', { error: 'Registration failed' });
  }
});

// Login page
router.get('/login', (req, res) => res.render('auth/login', { error: null }));

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render('auth/login', { error: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.render('auth/login', { error: 'Invalid credentials' });

    req.session.user = { _id: user._id, email: user.email };
    return res.redirect('/books');
  } catch (err) {
    console.error(err);
    return res.render('auth/login', { error: 'Login error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
