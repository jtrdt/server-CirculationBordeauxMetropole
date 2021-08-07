const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, lowercase: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    color: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
