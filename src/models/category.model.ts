import mongoose, { Schema, Document, models } from "mongoose";

export interface Category extends Document {
  name: string;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const CategoryModel =
  models.Category || mongoose.model<Category>("Category", CategorySchema);
  
