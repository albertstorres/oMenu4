import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCart } from '../data/mock';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(mockCart);
  const [isOpen, setIsOpen] = useState(false);

  // Salvar carrinho no localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { ...product, quantity }];
      }

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...prevCart,
        items: newItems,
        total: newTotal
      };
    });
  };

  const removeItem = (productId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...prevCart,
        items: newItems,
        total: newTotal
      };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...prevCart,
        items: newItems,
        total: newTotal
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      tableNumber: cart.tableNumber
    });
  };

  const setTableNumber = (tableNumber) => {
    setCart(prevCart => ({
      ...prevCart,
      tableNumber
    }));
  };

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setTableNumber,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};