// ImportantDate — 사람당 의미있는 날 (자유 라벨 + 날짜)
const mongoose = require('mongoose');

const importantDateSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    label: { type: String, required: true, trim: true },
    dateValue: {
      type: String,
      required: true,
      // YYYY-MM-DD
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImportantDate', importantDateSchema);
