// Mock data para o sistema de cardápio digital

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
}

export interface Order {
  id: string;
  tableNumber: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'waiter';
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer de carne bovina 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial da casa',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Lanches',
    available: true
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Pizza tradicional com molho de tomate, mussarela, manjericão fresco e azeite extravirgem',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'Pizzas',
    available: true
  },
  {
    id: '3',
    name: 'Salmão Grelhado',
    description: 'Filé de salmão grelhado com quinoa, legumes salteados e molho de alcaparras',
    price: 68.90,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    available: true
  },
  {
    id: '4',
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante Coca-Cola tradicional gelado',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
    category: 'Bebidas',
    available: true
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Sobremesa italiana clássica com café, mascarpone e cacau em pó',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    category: 'Sobremesas',
    available: true
  }
];

export const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 4, status: 'occupied' },
  { id: '2', number: 2, capacity: 2, status: 'available' },
  { id: '3', number: 3, capacity: 6, status: 'reserved' },
  { id: '4', number: 4, capacity: 4, status: 'available' },
  { id: '5', number: 5, capacity: 8, status: 'occupied' }
];

export const mockUsers: User[] = [
  { id: '1', name: 'João Silva', email: 'gerente@demo.com', role: 'manager' },
  { id: '2', name: 'Maria Santos', email: 'garcom@demo.com', role: 'waiter' }
];

export const mockCart = {
  items: [],
  total: 0,
  tableNumber: ''
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    tableNumber: '1',
    items: [
      { productId: '1', name: 'Hambúrguer Artesanal', price: 32.90, quantity: 2 },
      { productId: '4', name: 'Coca-Cola 350ml', price: 8.50, quantity: 2 }
    ],
    total: 82.80,
    status: 'preparing',
    createdAt: '2024-07-20T19:30:00Z'
  }
];

// Função para simular API calls
export const mockAPI = {
  getProducts: (): Promise<Product[]> => Promise.resolve(mockProducts),
  getProduct: (id: string): Promise<Product | undefined> => 
    Promise.resolve(mockProducts.find(p => p.id === id)),
  
  getTables: (): Promise<Table[]> => Promise.resolve(mockTables),
  getTable: (id: string): Promise<Table | undefined> => 
    Promise.resolve(mockTables.find(t => t.id === id)),
  
  getOrders: (): Promise<Order[]> => Promise.resolve(mockOrders),
  createOrder: (order: any): Promise<any> => 
    Promise.resolve({ id: Date.now().toString(), ...order, status: 'preparing' }),
  
  login: (credentials: { email: string; password: string }): Promise<any> => {
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user && credentials.password === 'senha123') {
      return Promise.resolve({ 
        user, 
        token: 'mock-jwt-token',
        success: true 
      });
    }
    return Promise.resolve({ success: false, error: 'Credenciais inválidas' });
  },
  
  logout: (): Promise<any> => Promise.resolve({ success: true })
};
