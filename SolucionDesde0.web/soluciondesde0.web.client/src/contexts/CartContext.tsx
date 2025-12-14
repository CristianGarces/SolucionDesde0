// context/CartContext.tsx
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProductResponse } from '../types/product';
import type { CartItem, CartContextType } from '../types/cart';
import { CartContext } from './CartContextValue'; 

interface CartProviderProps {
    children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
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
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    alert(`No hay suficiente stock. Disponible: ${product.stock}`);
                    return prev;
                }

                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                if (quantity > product.stock) {
                    alert(`No hay suficiente stock. Disponible: ${product.stock}`);
                    return prev;
                }

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

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const getItemQuantity = (productId: string): number => {
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

    const contextValue: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;