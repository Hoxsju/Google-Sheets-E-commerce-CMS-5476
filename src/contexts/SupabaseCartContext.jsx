import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { toast } from '../components/ui/Toaster';

const SupabaseCartContext = createContext();

export const useSupabaseCart = () => {
  const context = useContext(SupabaseCartContext);
  if (!context) {
    throw new Error('useSupabaseCart must be used within a SupabaseCartProvider');
  }
  return context;
};

export const SupabaseCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setCartItems(parsed);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const addItem = async (product, quantity = 1) => {
    try {
      setLoading(true);
      
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = async (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Convert to items format expected by components
  const items = cartItems.map(item => ({
    ...item,
    cartId: item.id
  }));

  const value = {
    items,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount,
    refreshCart: () => {} // No-op for mock
  };

  return (
    <SupabaseCartContext.Provider value={value}>
      {children}
    </SupabaseCartContext.Provider>
  );
};