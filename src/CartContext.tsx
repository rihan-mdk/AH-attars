import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './constants';
import { useProducts } from './ProductContext';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, sizeLabel?: string, customPrice?: number) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart when user changes
  useEffect(() => {
    const storageKey = user ? `aura_cart_${user.uid}` : 'aura_cart_guest';
    const saved = localStorage.getItem(storageKey);
    setCart(saved ? JSON.parse(saved) : []);
    setIsLoaded(true);
  }, [user]);

  // Save cart when it changes
  useEffect(() => {
    if (!isLoaded) return;
    const storageKey = user ? `aura_cart_${user.uid}` : 'aura_cart_guest';
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, user, isLoaded]);

  // Cleanup: Remove items from cart if they no longer exist in products list
  useEffect(() => {
    if (!loading && products.length > 0 && isLoaded) {
      setCart(prevCart => {
        const filteredCart = prevCart.filter(item => 
          products.some(p => p.id === item.id)
        );
        if (filteredCart.length !== prevCart.length) {
          return filteredCart;
        }
        return prevCart;
      });
    }
  }, [products, loading, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, sizeLabel?: string, customPrice?: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && item.selectedSize === selectedSize
      );
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id && item.selectedSize === selectedSize) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { 
        ...product, 
        quantity, 
        selectedSize, 
        sizeLabel, 
        price: customPrice || product.price 
      }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id === productId && item.selectedSize === selectedSize) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
