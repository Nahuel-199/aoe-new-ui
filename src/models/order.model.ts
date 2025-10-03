import mongoose, { Schema, Document, models } from "mongoose";

interface OrderItem {
  product: mongoose.Types.ObjectId;
  variant: {
    type: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  };
}

export interface Order extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
      type: { type: String, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderModel =
  models.Order || mongoose.model<Order>("Order", OrderSchema);
