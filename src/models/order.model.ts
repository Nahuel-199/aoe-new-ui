import clientPromise from "@/lib/db";

export interface OrderItem {
  product: string;
  variant: {
    type: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  };
}

export interface Order {
  _id?: string;
  user: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  comments?: string;
  paymentMethod?: string;
  paidAmount: number;
  remainingAmount: number;
  phoneNumber?: string;
  deliveryMethod: "correo" | "punto_encuentro";
  deliveryCost: number;
  meetingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Order>("orders");
};
