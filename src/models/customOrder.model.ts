import mongoose, { Schema, Document, models } from "mongoose";

export interface Image {
    id: string;
    url: string;
}

const ImageSchema = new Schema<Image>(
    {
        id: { type: String, required: true },
        url: { type: String, required: true },
    },
    { _id: false }
);

export interface CustomOrderItem {
    name: string;
    description?: string;
    images: Image[];
    color?: string;
    size?: string;
    quantity: number;
    price: number;
}

export interface CustomOrder extends Document {
    clientName: string;
    phoneNumber?: string;
    email?: string;
    items: CustomOrderItem[];
    total: number;
    remainingAmount?: number;
    paidAmount?: number;
    deliveryCost?: number;
    deliveryMethod?: string;
    shippingAddress?: string;
    meetingAddress?: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    paymentStatus: "pending" | "paid" | "refunded";
    comments?: string;
    designNotes?: string;
    designReferences: Image[];
    createdAt: Date;
}

const CustomOrderItemSchema = new Schema<CustomOrderItem>(
    {
        name: { type: String, required: true },
        description: { type: String },
        images: [ImageSchema],
        color: { type: String },
        size: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    },
    { _id: false }
);

const CustomOrderSchema = new Schema<CustomOrder>({
    clientName: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String },
    items: { type: [CustomOrderItemSchema], required: true },
    total: { type: Number, required: true },
    remainingAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    deliveryCost: { type: Number, default: 0 },
    deliveryMethod: { type: String },
    shippingAddress: { type: String },
    meetingAddress: { type: String },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
    },
    comments: { type: String },
    designNotes: { type: String },
    designReferences: [ImageSchema],
    createdAt: { type: Date, default: Date.now },
});

export default models.CustomOrder ||
    mongoose.model<CustomOrder>("CustomOrder", CustomOrderSchema);
