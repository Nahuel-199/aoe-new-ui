import mongoose, { Schema, Document, models } from "mongoose";

export interface Subcategory extends Document {
  name: string;
}

const SubcategorySchema = new Schema<Subcategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const SubcategoryModel =
  models.Subcategory ||
  mongoose.model<Subcategory>("Subcategory", SubcategorySchema);
