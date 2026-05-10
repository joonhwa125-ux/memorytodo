// Person — 소중한 한 사람
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    displayName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Person', personSchema);
