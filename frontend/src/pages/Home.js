import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockAPI } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalTables: 0,
    occupiedTables: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tables, products, orders] = await Promise.all([
        mockAPI.getTables(),
        mockAPI.getProducts(),
        mockAPI.getOrders()
      ]);

      setStats({
        totalTables: tables.length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        totalProducts: products.length,
        totalOrders: orders.length
      });

      setRecentOrders(orders.slice(0, 3));
      setPopularProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'delivered': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      default: return 'Pendente';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-20 h-20 mx-auto mb-6">
                <UtensilsCrossed className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                CardápioDigital
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sistema completo de cardápio digital com recursos de acessibilidade 
                para restaurantes modernos
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Acessar Sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/produtos')}
              >
                Ver Cardápio
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <UtensilsCrossed className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle>Gestão Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gerencie produtos, mesas e pedidos em uma plataforma integrada
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle>Multi-usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Diferentes níveis de acesso para gerentes e garçons
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Clock className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle>Acessibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recursos completos para pessoas com deficiência visual
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das operações do restaurante
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Mesas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTables}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mesas Ocupadas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupiedTables}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Mesa {order.tableNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} itens - R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Produtos Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/produtos')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Ver Cardápio
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/mesas')}
            >
              Gerenciar Mesas
            </Button>
            {user?.role === 'manager' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/produtos/cadastro')}
                >
                  Cadastrar Produto
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/mesas/cadastro')}
                >
                  Cadastrar Mesa
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;