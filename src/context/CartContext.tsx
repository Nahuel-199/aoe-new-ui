"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    productId: string;
    name: string;
    category?: string;
    subcategories?: string[];
    variant: {
        type: string;
        color: string;
        size: string;
        price: number
        imageUrl: string;
    };
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, variantKey: string) => void;
    increaseQuantity: (productId: string, variantKey: string) => void;
    decreaseQuantity: (productId: string, variantKey: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const exists = prev.find(
                (i) =>
                    i.productId === item.productId &&
                    i.variant.type === item.variant.type &&
                    i.variant.size === item.variant.size &&
                    i.variant.color === item.variant.color
            );
            if (exists) {
                return prev.map((i) =>
                    i === exists ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (productId: string, variantKey: string) => {
        setCart((prev) =>
            prev.filter((i) => `${i.productId}-${i.variant.size}` !== variantKey)
        );
    };

    const increaseQuantity = (productId: string, variantKey: string) => {
        setCart(prev =>
            prev.map(item =>
                `${item.productId}-${item.variant.size}` === variantKey
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId: string, variantKey: string) => {
        setCart(prev =>
            prev
                .map(item =>
                    `${item.productId}-${item.variant.size}` === variantKey
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
};
