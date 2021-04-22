const mongoose = require('mongoose');

const boucleSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    update: [
      {
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        date: {
          type: Date,
          default: Date.now // Date.now() ??
        }
      }
    ],
    zone: { type: String, required: true },
    crossroad: { type: String, required: true },
    nature: { type: String, enum: ['CENTRALISE', 'LOCAL'] },
    entry: { type: String, required: true },
    label: { type: String, required: true },
    comment: { type: String, required: true },
    recommissioning: Date,
    toPrecise: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boucle', boucleSchema);
