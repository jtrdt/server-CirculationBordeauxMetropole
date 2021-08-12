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
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ['admin', 'moderator', 'user'],
        message: '{VALUE} is not supported'
      },
      default: 'user'
    },
    confirmationCode: {
      type: String,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'pending'
    },
    recoveryToken: {
      hash: { type: String },
      timestamp: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
