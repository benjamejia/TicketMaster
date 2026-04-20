import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// ---------- Types ----------
export interface CartItem {
    id: string;
    titulo: string;
    srcImg: string;
    precio: number;
    lugar: string;
    categoria: string;
    cantidad: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "cantidad">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, cantidad: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem("cart_items");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart_items", JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<CartItem, "cantidad">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
                );
            }
            return [...prev, { ...item, cantidad: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, cantidad: number) => {
        if (cantidad <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("cart_items");
    };

    const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside <CartProvider>");
    }
    return ctx;
}
