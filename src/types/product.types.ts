
export interface Category {
    _id: string;
    name: string;
    types: string[];
}

export interface Subcategory {
    _id: string;
    name: string;
}

export interface Variant {
    color: string;
    images: { id: string; url: string }[];
    sizes: { size: string; stock: number }[];
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    is_offer: boolean;
    price_offer?: number;
    category: Category;
    subcategories: Subcategory[];
    type: string;
    variants: Variant[];
}