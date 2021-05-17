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
          default: Date.now
        }
      }
    ],
    carfId: { type: String, required: true },
    nature: { type: String, enum: ['CENTRALISE', 'LOCAL', 'TETRA', 'null'] },
    entry: { type: String, required: true },
    label: { type: String, required: true },
    comment: { type: String, required: true, trim: true },
    comments: [
      {
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        content: { type: String, required: true, trim: true },
        date: { type: Date, default: Date.now }
      }
    ],
    toPrecise: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    sendedDate: {
      date: { type: Date },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    recommissioning: {
      date: {
        type: Date
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    isStored: {
      date: { type: Date },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boucle', boucleSchema);
