import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { 
  Menu, 
  ShoppingCart, 
  User, 
  LogOut,
  Home,
  UtensilsCrossed,
  Plus,
  Table,
  List,
  Accessibility
} from 'lucide-react';
import './styles.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount, setIsOpen } = useCart();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/produtos', label: 'Produtos', icon: UtensilsCrossed },
    ...(user?.role === 'manager' ? [
      { path: '/produtos/cadastro', label: 'Cadastrar Produto', icon: Plus },
      { path: '/mesas/cadastro', label: 'Cadastrar Mesa', icon: Table }
    ] : []),
    { path: '/mesas', label: 'Mesas', icon: List },
    { path: '/acessibilidade', label: 'Acessibilidade', icon: Accessibility }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div 
            className="logo-container"
            onClick={() => navigate('/')}
          >
            <div className="logo-icon">
              <UtensilsCrossed className="logo-icon-svg" />
            </div>
            <span className="logo-text">
              oMenu
            </span>
          </div>

          {/* Navigation */}
          <nav className="nav-desktop">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(path)}
                className="nav-button"
              >
                <Icon className="nav-icon" />
                <span>{label}</span>
              </Button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Cart */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="cart-button"
            >
              <ShoppingCart className="cart-icon" />
              {getItemCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="cart-badge"
                >
                  {getItemCount()}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <User className="user-icon" />
                  <span className="user-name">{user?.name}</span>
                  <Badge variant="secondary" className="user-role">
                    {user?.role === 'manager' ? 'Gerente' : 'Garçom'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="logout-icon" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                size="sm"
              >
                Entrar
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="mobile-menu-button"
            >
              <Menu className="mobile-menu-icon" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
