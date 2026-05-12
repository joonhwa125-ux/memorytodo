import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const importantDateSchema = new Schema(
  {
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    label: { type: String, required: true, trim: true },
    dateValue: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  { timestamps: true }
);

export type ImportantDateDoc = InferSchemaType<typeof importantDateSchema>;

export const ImportantDate: Model<ImportantDateDoc> =
  (mongoose.models.ImportantDate as Model<ImportantDateDoc>) ||
  mongoose.model<ImportantDateDoc>("ImportantDate", importantDateSchema);
