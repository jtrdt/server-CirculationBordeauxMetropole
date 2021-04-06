const mongoose = require('mongoose');

const boucleSchema = new mongoose.Schema(
  {
    userId: { type: String },
    zone: { type: String },
    crossroad: { type: String },
    entry: { type: String },
    wording: { type: String }, // traduction à vérifier (libellé)
    comment: { type: String },
    recommissioning: Date,
    toPrecise: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boucle', boucleSchema);
