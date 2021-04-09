const mongoose = require('mongoose');

const boucleSchema = new mongoose.Schema(
  {
    postedById: { type: String, required: true },
    updatedById: String,
    zone: { type: String, required: true },
    crossroad: { type: String, required: true },
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
