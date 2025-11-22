const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Middleware to check login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

// PUBLIC BOOKS
router.get("/public", async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.render("books/public", { books });
});

// USER'S BOOKS
router.get("/", requireLogin, async (req, res) => {
  const books = await Book.find({ owner: req.session.userId });
  res.render("books/index", { books });
});

// NEW BOOK FORM
router.get("/new", requireLogin, (req, res) => {
  res.render("books/new");
});

// CREATE BOOK
router.post("/", requireLogin, async (req, res) => {
  await Book.create({
    title: req.body.title,
    author: req.body.author,
    owner: req.session.userId,
  });
  res.redirect("/books");
});

// EDIT BOOK FORM
router.get("/:id/edit", requireLogin, async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("books/edit", { book });
});

// UPDATE BOOK
router.put("/:id", requireLogin, async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/books");
});

// DELETE BOOK
router.delete("/:id", requireLogin, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/books");
});

module.exports = router;
