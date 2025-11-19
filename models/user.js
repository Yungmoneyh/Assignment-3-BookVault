// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }
});

// instance method to hash and set password
userSchema.methods.hashPassword = async function (plain) {
  const hash = await bcrypt.hash(plain, 10);
  this.passwordHash = hash;
};

// instance method to compare
userSchema.methods.comparePassword = async function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);

