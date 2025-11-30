/* 
 * TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO
 * 
 * Este contexto é TEMPORÁRIO e será removido quando o backend estiver pronto.
 * Atualmente, ele gerencia pedidos no frontend usando localStorage.
 * Quando o backend for implementado, os pedidos serão gerenciados via API.
 * 
 * Funcionalidades que serão removidas:
 * - OrderContext e OrderProvider
 * - Armazenamento de pedidos no localStorage
 * - Todas as chamadas a useOrder() nos componentes
 * 
 * Substituir por:
 * - Chamadas diretas à API do backend
 * - Gerenciamento de estado via React Query ou similar
 */

/*
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../data/mock';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  getLastOrder: () => Order | undefined;
  setCurrentOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Carregar pedidos do localStorage ao inicializar
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Erro ao carregar pedidos do localStorage:', error);
      }
    }
  }, []);

  // Salvar pedidos no localStorage sempre que houver mudanças
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (order: Order): void => {
    setOrders(prevOrders => {
      // Verificar se o pedido já existe (evitar duplicatas)
      const existingOrder = prevOrders.find(o => o.id === order.id);
      if (existingOrder) {
        return prevOrders;
      }
      return [...prevOrders, order];
    });
    // Definir como pedido atual
    setCurrentOrder(order);
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const getLastOrder = (): Order | undefined => {
    if (orders.length === 0) return undefined;
    // Ordenar por data de criação (mais recente primeiro)
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    return sortedOrders[0];
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    addOrder,
    getOrderById,
    getLastOrder,
    setCurrentOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
*/

// Exportação vazia para que o TypeScript reconheça este arquivo como módulo
export {};

