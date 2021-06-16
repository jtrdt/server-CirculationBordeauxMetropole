const mongoose = require('mongoose');

const boucleSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    carfId: { type: String, required: true },
    nature: {
      type: String,
      enum: {
        values: ['CENTRALISE', 'LOCAL', 'TETRA', 'null'],
        message: '{VALUE} is not supported'
      }
    },
    entry: { type: String, required: true },
    label: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    comment: { type: String, required: true, trim: true },
    comments: [
      {
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        date: { type: Date, default: Date.now, required: true }
      }
    ],
    toPrecise: { type: Boolean, default: false },
    sendedDate: {
      date: { type: Date },
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    recommissioning: {
      date: { type: Date },
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    isStored: {
      date: { type: Date },
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boucle', boucleSchema);
