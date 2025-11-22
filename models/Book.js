const mongoose = require("mongoose");

// Define the schema for a book
const bookSchema = new mongoose.Schema(
  {
    title: String, // Title of the book
    author: String, // Author of the book
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who added the book
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the Book model to use in other files
module.exports = mongoose.model("Book", bookSchema);
