import clientPromise from "@/lib/db";

export interface Image {
  id: string;
  url: string;
}

export interface CustomOrderItem {
  name: string;
  description?: string;
  images: Image[];
  color?: string;
  size?: string;
  quantity: number;
  price: number;
}

export interface CustomOrder {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomOrderCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<CustomOrder>("customOrders");
};
