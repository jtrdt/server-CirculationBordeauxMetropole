const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // lowerstring: true
    name: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    // theme: { type: String, enum: ['dark', 'light'], default: 'light' },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false },
    // role: { type: String, enum: ['superAdmin', 'admin', 'user']}
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
