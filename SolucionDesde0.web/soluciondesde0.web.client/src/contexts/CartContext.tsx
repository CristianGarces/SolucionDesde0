// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ProductResponse } from '../types/product';

export interface CartItem {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    description?: string;
    stock: number;
    categoryName?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: ProductResponse, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // Cargar carrito del localStorage al iniciar
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // Guardar en localStorage cuando cambie el carrito
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: ProductResponse, quantity: number) => {
        if (quantity <= 0) return;

        setItems(prev => {
            const existingItem = prev.find(item => item.productId === product.id);

            if (existingItem) {
                // Validar que no supere el stock
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    alert(`No hay suficiente stock. Disponible: ${product.stock}`);
                    return prev;
                }

                // Actualizar cantidad del item existente
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                // Validar stock para nuevo item
                if (quantity > product.stock) {
                    alert(`No hay suficiente stock. Disponible: ${product.stock}`);
                    return prev;
                }

                // Agregar nuevo item al carrito
                return [...prev, {
                    productId: product.id,
                    productName: product.name,
                    unitPrice: product.price,
                    quantity,
                    description: product.description,
                    stock: product.stock,
                    categoryName: product.categoryName
                }];
            }
        });
    };

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        // Validar stock antes de actualizar
        const item = items.find(i => i.productId === productId);
        if (item && quantity > item.stock) {
            alert(`No hay suficiente stock. Disponible: ${item.stock}`);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    // Calcular total de items
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calcular precio total
    const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Obtener cantidad de un producto específico
    const getItemQuantity = (productId: string): number => {
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};