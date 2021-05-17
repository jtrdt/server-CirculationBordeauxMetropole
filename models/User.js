const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    name: { type: String, unique: true, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'light' },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
