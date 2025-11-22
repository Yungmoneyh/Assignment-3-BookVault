const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define what a User will have in the database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // User's chosen username
  email: { type: String, required: true, unique: true },    // User's email
  password: { type: String, required: true },               // User's password (hashed)
});

// Before saving, hash the password so it's secure
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new/changed
  this.password = await bcrypt.hash(this.password, 10);   // Hash password
  next();
});

// Method to check if entered password matches the hashed one
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the User model so other files can use it
module.exports = mongoose.model("User", userSchema);
