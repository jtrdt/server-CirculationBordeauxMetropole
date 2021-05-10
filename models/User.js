const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
