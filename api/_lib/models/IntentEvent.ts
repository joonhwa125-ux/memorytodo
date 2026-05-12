import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const intentEventSchema = new Schema(
  {
    intentId: {
      type: Schema.Types.ObjectId,
      ref: "Intent",
      default: null,
    },
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    quadrant: {
      type: String,
      enum: ["aligned", "procrastinated", "relapsed", "resisted"],
      required: true,
    },
    recordedAt: { type: Date, default: Date.now },
    triggerNote: { type: String, default: null },
    sessionType: {
      type: String,
      enum: ["realtime", "daily_review"],
      default: "realtime",
    },
  },
  { timestamps: true }
);

intentEventSchema.index({ personId: 1, recordedAt: -1 });

export type IntentEventDoc = InferSchemaType<typeof intentEventSchema>;

export const IntentEvent: Model<IntentEventDoc> =
  (mongoose.models.IntentEvent as Model<IntentEventDoc>) ||
  mongoose.model<IntentEventDoc>("IntentEvent", intentEventSchema);
