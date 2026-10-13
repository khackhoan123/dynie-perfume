'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeKey } from '@/config/themes';
import { Product } from '@/lib/sheets';

export type PerfumeSize = 'decant_10ml' | 'fullbox';

export interface CartItem {
  id: string; // unique cart line id: `${productId}-${size}`
  productId: string;
  name: string;
  brand: string;
  thumb_url: string;
  size: PerfumeSize;
  sizeLabel: string;
  price: number;
  quantity: number;
  theme_id: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: PerfumeSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeTheme: ThemeKey;
  setActiveTheme: (theme: ThemeKey) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dynie_perfume_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('sweet_rose');
  const [isInitialized, setIsInitialized] = useState(false);

  // Khôi phục giỏ hàng từ localStorage khi mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc giỏ hàng từ localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Lỗi lưu giỏ hàng vào localStorage:', e);
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, size: PerfumeSize, quantity = 1) => {
    const cartItemId = `${product.id}-${size}`;
    const price = size === 'fullbox' && product.price_full ? product.price_full : product.price_decant;
    const sizeLabel = size === 'fullbox' ? 'Chai Fullbox 100ml' : 'Chiết 10ml';

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          thumb_url: product.thumb_url,
          size,
          sizeLabel,
          price,
          quantity,
          theme_id: product.theme_id,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        selectedProduct,
        setSelectedProduct,
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được sử dụng bên trong CartProvider');
  }
  return context;
}
