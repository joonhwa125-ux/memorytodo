import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const personSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    displayName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type PersonDoc = InferSchemaType<typeof personSchema>;

// In dev / hot-reload / warm Lambdas, the model may already be registered.
export const Person: Model<PersonDoc> =
  (mongoose.models.Person as Model<PersonDoc>) ||
  mongoose.model<PersonDoc>("Person", personSchema);
