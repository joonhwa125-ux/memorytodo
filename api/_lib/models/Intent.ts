import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const intentSchema = new Schema(
  {
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    intentType: {
      type: String,
      enum: ["do", "avoid"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    why: { type: String, default: null },
    dueDate: {
      type: String,
      default: null,
      validate: {
        validator: (v: string | null) =>
          v == null || /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: "dueDate must be YYYY-MM-DD",
      },
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type IntentDoc = InferSchemaType<typeof intentSchema>;

export const Intent: Model<IntentDoc> =
  (mongoose.models.Intent as Model<IntentDoc>) ||
  mongoose.model<IntentDoc>("Intent", intentSchema);
