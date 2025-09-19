import mongoose, { Schema, Document, models } from "mongoose";

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  variant: {
    color: string;
    size: string;
  };
  quantity: number;
  price: number;
}

export interface Order extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "paypal" | "cash" | string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
      color: { type: String, required: true },
      size: { type: String, required: true },
    },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cash"],
      default: "card",
    },
  },
  { timestamps: true }
);

export const OrderModel = models.Order || mongoose.model<Order>("Order", OrderSchema);
