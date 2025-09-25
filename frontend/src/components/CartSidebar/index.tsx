import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { mockAPI } from '../../data/mock';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  MapPin,
  User
} from 'lucide-react';
import './styles.css';

interface CustomerInfo {
  name: string;
  tableNumber: string;
  notes: string;
}

const CartSidebar: React.FC = () => {
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    clearCart,
    setTableNumber 
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    tableNumber: cart.tableNumber || '',
    notes: ''
  });
  const [processing, setProcessing] = useState<boolean>(false);

  const handleQuantityChange = (productId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleTableNumberChange = (tableNumber: string): void => {
    setCustomerInfo(prev => ({ ...prev, tableNumber }));
    setTableNumber(tableNumber);
  };

  const handleCheckout = async (): Promise<void> => {
    if (cart.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.tableNumber) {
      toast({
        title: "Mesa obrigatória",
        description: "Por favor, informe o número da mesa.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const orderData = {
        tableNumber: customerInfo.tableNumber,
        customerName: customerInfo.name || 'Cliente',
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cart.total,
        notes: customerInfo.notes,
        status: 'preparing'
      };

      await mockAPI.createOrder(orderData);

      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido para a mesa ${customerInfo.tableNumber} foi enviado para a cozinha.`,
      });

      clearCart();
      setCustomerInfo({ name: '', tableNumber: '', notes: '' });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao enviar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="cart-sheet">
        <SheetHeader>
          <SheetTitle className="cart-title">
            <ShoppingCart className="cart-title-icon" />
            Carrinho ({cart.items.length})
          </SheetTitle>
          <SheetDescription>
            Revise seus itens e finalize o pedido
          </SheetDescription>
        </SheetHeader>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart className="empty-cart-icon" />
                <h3 className="empty-cart-title">
                  Carrinho vazio
                </h3>
                <p className="empty-cart-description">
                  Adicione itens do cardápio para começar seu pedido
                </p>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="cart-item-content">
                      <div className="cart-item">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <p className="cart-item-price">
                            R$ {item.price.toFixed(2)}
                          </p>
                          <Badge variant="outline" className="cart-item-category">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="cart-item-controls">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="remove-button"
                          >
                            <Trash2 className="remove-icon" />
                          </Button>
                          <div className="quantity-controls">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="quantity-icon" />
                            </Button>
                            <span className="quantity-display">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="quantity-icon" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <span className="item-total-price">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cart.items.length > 0 && (
            <div className="checkout-section">
              <div className="checkout-content">
                {/* Customer Info */}
                <div className="customer-info">
                  <div className="input-group">
                    <Label htmlFor="customerName">Nome (opcional)</Label>
                    <div className="input-with-icon">
                      <User className="input-icon" />
                      <Input
                        id="customerName"
                        placeholder="Seu nome"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <Label htmlFor="tableNumber">Número da Mesa *</Label>
                    <div className="input-with-icon">
                      <MapPin className="input-icon" />
                      <Input
                        id="tableNumber"
                        type="number"
                        placeholder="Ex: 5"
                        value={customerInfo.tableNumber}
                        onChange={(e) => handleTableNumberChange(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Alguma observação especial?"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="total-section">
                  <div className="total-row">
                    <span>Total:</span>
                    <span className="total-price">
                      R$ {cart.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="items-count">
                    Itens: {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={processing || cart.items.length === 0}
                  className="checkout-button"
                >
                  <CreditCard className="checkout-icon" />
                  {processing ? 'Processando...' : 'Finalizar Pedido'}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="clear-button"
                  disabled={processing}
                >
                  Limpar Carrinho
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
