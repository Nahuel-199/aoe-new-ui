import mongoose, { Schema, Document, models } from "mongoose";

export interface Image {
  id: string;
  url: string;
}

export interface Variant {
  type: string;
  price: number;
  is_offer: boolean;
  price_offer: number | null;
  color: string;
  images: Image[];
  sizes: {
    size: string;
    stock: number;
  }[];
}

export interface Product extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
  variants: Variant[];
}

const ImageSchema = new Schema<Image>(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema<Variant>(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    is_offer: { type: Boolean, default: false },
    price_offer: { type: Number, default: null },
    color: { type: String, required: true },
    images: [ImageSchema],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  { _id: false }
);

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
    variants: [VariantSchema],
  },
  { timestamps: true }
);

export const ProductModel =
  models.Product || mongoose.model<Product>("Product", ProductSchema);
