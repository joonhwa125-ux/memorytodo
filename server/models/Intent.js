// Intent — 사람에 대한 do/avoid 의도
const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    intentType: {
      type: String,
      enum: ['do', 'avoid'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    why: { type: String, default: null },
    dueDate: {
      type: String,
      default: null,
      // YYYY-MM-DD or null
      validate: {
        validator: (v) => v == null || /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: 'dueDate must be YYYY-MM-DD',
      },
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Intent', intentSchema);
