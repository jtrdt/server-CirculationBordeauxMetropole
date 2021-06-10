const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true, lowercase: true },
    lastname: { type: String, required: true, trim: true, lowercase: true },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    theme: { type: String, enum: ['dark', 'light'], default: 'light' },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: { values: ['admin', 'moderator', 'user'], message: '{VALUE} is not supported' },
      default: 'user'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
