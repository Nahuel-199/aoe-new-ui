interface VariantOrder {
    type: string;
    color: string;
    size: string;
    price: number;
    imageUrl?: string;
    quantity: number;
}

interface OrderItem {
    product: { _id: string; name: string };
    variant: VariantOrder;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Order {
    _id: string;
    user: User;
    items: OrderItem[];
    total: number;
    comments?: string;
    paymentMethod?: string;
    paidAmount: number;
    remainingAmount: number;
    phoneNumber?: string;
    deliveryMethod: "correo" | "punto_encuentro";
    deliveryCost: number;
    meetingAddress?: string;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}