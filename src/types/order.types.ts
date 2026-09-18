import { ShippingAddress } from "./address.types";

interface VariantOrder {
    type: string;
    color: string;
    size: string;
    price: number;
    imageUrl?: string;
    productName?: string;
    quantity: number;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export type PaymentStatus =
    | "pending"
    | "approved"
    | "in_process"
    | "rejected"
    | "cancelled"
    | "refunded";

export interface CustomerOrderItem {
    productId: string;
    productName: string;
    productImage: string | null;
    variant: VariantOrder;
    unitPrice: number;
    subtotal: number;
}

/** Forma real devuelta por `getOrdersByUser` (agregado crudo, sin el join por item que hace `getOrderById`). */
export interface CustomerOrder {
    _id: string;
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: PaymentStatus;
    paymentProvider?: "mercadopago";
    paymentMethod?: string;
    paidAmount?: number;
    deliveryMethod?: "correo" | "punto_encuentro";
    deliveryCost?: number;
    shippingAddress?: ShippingAddress;
    meetingAddress?: string;
    phoneNumber?: string;
    createdAt: string;
    items: CustomerOrderItem[];
}

/** `CustomerOrder` + el usuario, tal como lo devuelve `getAllOrders` para el admin. */
export interface AdminOrder extends CustomerOrder {
    user: User;
}