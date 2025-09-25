import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockAPI } from '../../data/mock';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';
import './styles.css';

interface Stats {
  totalTables: number;
  occupiedTables: number;
  totalProducts: number;
  totalOrders: number;
}

interface Order {
  id: string;
  tableNumber: string;
  items: any[];
  total: number;
  status: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalTables: 0,
    occupiedTables: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    try {
      const [tables, products, orders] = await Promise.all([
        mockAPI.getTables(),
        mockAPI.getProducts(),
        mockAPI.getOrders()
      ]);

      setStats({
        totalTables: tables.length,
        occupiedTables: tables.filter((t: any) => t.status === 'occupied').length,
        totalProducts: products.length,
        totalOrders: orders.length
      });

      setRecentOrders(orders.slice(0, 3));
      setPopularProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'delivered': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      default: return 'Pendente';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="home-landing">
        <div className="home-container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-icon">
                <UtensilsCrossed className="hero-icon-svg" />
              </div>
              <h1 className="hero-title">
                CardápioDigital
              </h1>
              <p className="hero-description">
                Sistema completo de cardápio digital com recursos de acessibilidade 
                para restaurantes modernos
              </p>
            </div>
            <div className="hero-actions">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="primary-button"
              >
                Acessar Sistema
                <ArrowRight className="button-icon" />
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
          <div className="features-grid">
            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon orange">
                  <UtensilsCrossed className="feature-icon-svg" />
                </div>
                <CardTitle>Gestão Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="feature-description">
                  Gerencie produtos, mesas e pedidos em uma plataforma integrada
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon green">
                  <Users className="feature-icon-svg" />
                </div>
                <CardTitle>Multi-usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="feature-description">
                  Diferentes níveis de acesso para gerentes e garçons
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon blue">
                  <Clock className="feature-icon-svg" />
                </div>
                <CardTitle>Acessibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="feature-description">
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
    <div className="home-dashboard">
      <div className="home-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="welcome-title">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="welcome-description">
            Aqui está um resumo das operações do restaurante
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-row">
                <div>
                  <p className="stat-label">Total de Mesas</p>
                  <p className="stat-value">{stats.totalTables}</p>
                </div>
                <div className="stat-icon blue">
                  <Users className="stat-icon-svg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-row">
                <div>
                  <p className="stat-label">Mesas Ocupadas</p>
                  <p className="stat-value">{stats.occupiedTables}</p>
                </div>
                <div className="stat-icon green">
                  <TrendingUp className="stat-icon-svg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-row">
                <div>
                  <p className="stat-label">Produtos</p>
                  <p className="stat-value">{stats.totalProducts}</p>
                </div>
                <div className="stat-icon orange">
                  <UtensilsCrossed className="stat-icon-svg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-row">
                <div>
                  <p className="stat-label">Pedidos Hoje</p>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
                <div className="stat-icon purple">
                  <DollarSign className="stat-icon-svg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-title">
                <Clock className="dashboard-title-icon" />
                Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div>
                      <p className="order-table">Mesa {order.tableNumber}</p>
                      <p className="order-details">
                        {order.items.length} itens - R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                    <Badge className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-title">
                <TrendingUp className="dashboard-title-icon" />
                Produtos Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="products-list">
                {popularProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <p className="product-name">{product.name}</p>
                      <p className="product-price">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="quick-actions-title">Ações Rápidas</h3>
          <div className="quick-actions-buttons">
            <Button 
              onClick={() => navigate('/produtos')}
              className="primary-button"
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
