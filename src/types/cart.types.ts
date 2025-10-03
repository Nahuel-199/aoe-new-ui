export interface CartItem {
    productId: string;
    name: string;
    variant: {
        type: string;
        color: string;
        size: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
}