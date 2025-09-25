import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockCart } from '../data/mock';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  tableNumber?: string;
}

interface CartContextType {
  cart: Cart;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: string) => void;
  getItemCount: () => number;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(mockCart);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number = 1): void => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.id === product.id);
      
      let newItems: CartItem[];
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

  const removeItem = (productId: string): void => {
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

  const updateQuantity = (productId: string, quantity: number): void => {
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

  const clearCart = (): void => {
    setCart({
      items: [],
      total: 0,
      tableNumber: cart.tableNumber
    });
  };

  const setTableNumber = (tableNumber: string): void => {
    setCart(prevCart => ({
      ...prevCart,
      tableNumber
    }));
  };

  const getItemCount = (): number => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value: CartContextType = {
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
