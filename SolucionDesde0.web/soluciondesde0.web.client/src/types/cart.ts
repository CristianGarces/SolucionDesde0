import type { ProductResponse } from './product';

export interface CartItem {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    description?: string;
    stock: number;
    categoryName?: string;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (product: ProductResponse, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    getItemQuantity: (productId: string) => number;
}