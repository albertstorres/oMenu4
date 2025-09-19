// Mock data para o sistema de cardápio digital

export const mockProducts = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer de carne bovina 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial da casa',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Lanches',
    ingredients: ['Carne bovina', 'Queijo cheddar', 'Alface', 'Tomate', 'Cebola roxa', 'Molho especial'],
    available: true,
    preparationTime: 15
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Pizza tradicional com molho de tomate, mussarela, manjericão fresco e azeite extravirgem',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'Pizzas',
    ingredients: ['Molho de tomate', 'Mussarela', 'Manjericão', 'Azeite extravirgem'],
    available: true,
    preparationTime: 20
  },
  {
    id: '3',
    name: 'Salmão Grelhado',
    description: 'Filé de salmão grelhado com quinoa, legumes salteados e molho de alcaparras',
    price: 68.90,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    ingredients: ['Salmão', 'Quinoa', 'Brócolis', 'Cenoura', 'Alcaparras'],
    available: true,
    preparationTime: 25
  },
  {
    id: '4',
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante Coca-Cola tradicional gelado',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
    category: 'Bebidas',
    ingredients: ['Água gaseificada', 'Açúcar', 'Extrato de cola'],
    available: true,
    preparationTime: 2
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Sobremesa italiana clássica com café, mascarpone e cacau em pó',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    category: 'Sobremesas',
    ingredients: ['Mascarpone', 'Café espresso', 'Biscoito champagne', 'Cacau'],
    available: true,
    preparationTime: 5
  },
  {
    id: '6',
    name: 'Salada Caesar',
    description: 'Alface romana, croutons, queijo parmesão e molho caesar tradicional',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=300&fit=crop',
    category: 'Saladas',
    ingredients: ['Alface romana', 'Croutons', 'Parmesão', 'Molho caesar'],
    available: true,
    preparationTime: 10
  }
];

export const mockCategories = [
  { id: '1', name: 'Lanches', icon: 'Sandwich' },
  { id: '2', name: 'Pizzas', icon: 'Pizza' },
  { id: '3', name: 'Pratos Principais', icon: 'ChefHat' },
  { id: '4', name: 'Bebidas', icon: 'Coffee' },
  { id: '5', name: 'Sobremesas', icon: 'IceCream' },
  { id: '6', name: 'Saladas', icon: 'Salad' }
];

export const mockTables = [
  {
    id: '1',
    number: 1,
    capacity: 4,
    status: 'occupied',
    currentOrder: {
      id: 'order-1',
      items: 3,
      total: 85.40,
      startTime: '19:30'
    }
  },
  {
    id: '2',
    number: 2,
    capacity: 2,
    status: 'available',
    currentOrder: null
  },
  {
    id: '3',
    number: 3,
    capacity: 6,
    status: 'reserved',
    currentOrder: null,
    reservationTime: '20:00'
  },
  {
    id: '4',
    number: 4,
    capacity: 4,
    status: 'available',
    currentOrder: null
  },
  {
    id: '5',
    number: 5,
    capacity: 8,
    status: 'occupied',
    currentOrder: {
      id: 'order-2',
      items: 6,
      total: 142.30,
      startTime: '18:45'
    }
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@restaurant.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@restaurant.com',
    role: 'waiter',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c32beed3?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@restaurant.com',
    role: 'waiter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockCart = {
  items: [],
  total: 0,
  tableNumber: null
};

export const mockOrders = [
  {
    id: 'order-1',
    tableNumber: 1,
    items: [
      { productId: '1', quantity: 2, price: 32.90 },
      { productId: '4', quantity: 2, price: 8.50 }
    ],
    total: 82.80,
    status: 'preparing',
    createdAt: '2024-07-20T19:30:00Z',
    estimatedTime: 20
  },
  {
    id: 'order-2',
    tableNumber: 5,
    items: [
      { productId: '2', quantity: 1, price: 45.00 },
      { productId: '3', quantity: 2, price: 68.90 },
      { productId: '5', quantity: 1, price: 18.90 }
    ],
    total: 201.70,
    status: 'ready',
    createdAt: '2024-07-20T18:45:00Z',
    estimatedTime: 25
  }
];

// Função para simular API calls
export const mockAPI = {
  // Produtos
  getProducts: () => Promise.resolve(mockProducts),
  getProduct: (id) => Promise.resolve(mockProducts.find(p => p.id === id)),
  createProduct: (product) => Promise.resolve({ id: Date.now().toString(), ...product }),
  updateProduct: (id, updates) => Promise.resolve({ ...mockProducts.find(p => p.id === id), ...updates }),
  deleteProduct: (id) => Promise.resolve({ success: true }),

  // Categorias
  getCategories: () => Promise.resolve(mockCategories),

  // Mesas
  getTables: () => Promise.resolve(mockTables),
  getTable: (id) => Promise.resolve(mockTables.find(t => t.id === id)),
  createTable: (table) => Promise.resolve({ id: Date.now().toString(), ...table }),
  updateTable: (id, updates) => Promise.resolve({ ...mockTables.find(t => t.id === id), ...updates }),
  deleteTable: (id) => Promise.resolve({ success: true }),

  // Pedidos
  getOrders: () => Promise.resolve(mockOrders),
  createOrder: (order) => Promise.resolve({ id: Date.now().toString(), ...order, status: 'preparing' }),
  updateOrderStatus: (id, status) => Promise.resolve({ success: true }),

  // Autenticação
  login: (credentials) => Promise.resolve({ 
    user: mockUsers[0], 
    token: 'mock-jwt-token',
    success: true 
  }),
  logout: () => Promise.resolve({ success: true })
};