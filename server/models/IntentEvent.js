// IntentEvent — 4사분면 실행 기록
const mongoose = require('mongoose');

const intentEventSchema = new mongoose.Schema(
  {
    intentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Intent',
      default: null,
    },
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    quadrant: {
      type: String,
      enum: ['aligned', 'procrastinated', 'relapsed', 'resisted'],
      required: true,
    },
    recordedAt: { type: Date, default: Date.now },
    triggerNote: { type: String, default: null },
    sessionType: {
      type: String,
      enum: ['realtime', 'daily_review'],
      default: 'realtime',
    },
  },
  { timestamps: true }
);

intentEventSchema.index({ personId: 1, recordedAt: -1 });

module.exports = mongoose.model('IntentEvent', intentEventSchema);
