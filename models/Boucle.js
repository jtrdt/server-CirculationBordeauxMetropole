const mongoose = require('mongoose');

const boucleSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // historique des updates ?
    updates: [
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
    // zone: { type: String, required: true },
    // crossroad: { type: String, required: true },
    nature: { type: String, enum: ['CENTRALISE', 'LOCAL', 'TETRA'] },
    entry: { type: String, required: true },
    label: { type: String, required: true },
    comment: { type: String, required: true },
    recommissioning: { type: Date },
    toPrecise: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    hasAlert: { type: Boolean, default: false },
    sendedDate: { type: Date },
    // qui a archivé + quand
    backInService: {
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
