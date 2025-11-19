// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Public list
router.get('/public', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(50);
    res.render('books/public', { books, user: req.session.user || null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Private list - user's books
router.get('/', requireLogin, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.session.user._id }).sort({ createdAt: -1 });
    res.render('books/index', { books, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// New form
router.get('/new', requireLogin, (req, res) => res.render('books/new', { user: req.session.user }));

// Create
router.post('/', requireLogin, async (req, res) => {
  try {
    await Book.create({ ...req.body, owner: req.session.user._id });
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.render('books/new', { error: 'Error creating book', user: req.session.user });
  }
});

// Edit
router.get('/:id/edit', requireLogin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.redirect('/books');
    res.render('books/edit', { book, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/books');
  }
});

// Update
router.put('/:id', requireLogin, async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.redirect('/books');
  }
});

// Delete
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.redirect('/books');
  }
});

module.exports = router;
