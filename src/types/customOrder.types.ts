export interface Image {
  id: string;
  url: string;
}

export interface CustomOrderItem {
  name: string;
  description?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  images: Image[];
}

export interface CustomOrder {
  _id: string;
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
  createdAt: string;
}
