import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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

const CartSidebar = () => {
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
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    tableNumber: cart.tableNumber || '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleTableNumberChange = (tableNumber) => {
    setCustomerInfo(prev => ({ ...prev, tableNumber }));
    setTableNumber(tableNumber);
  };

  const handleCheckout = async () => {
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({cart.items.length})
          </SheetTitle>
          <SheetDescription>
            Revise seus itens e finalize o pedido
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-gray-600">
                  Adicione itens do cardápio para começar seu pedido
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            R$ {item.price.toFixed(2)}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <span className="font-semibold text-orange-600">
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
            <div className="border-t pt-6">
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName">Nome (opcional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customerName"
                        placeholder="Seu nome"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tableNumber">Número da Mesa *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="tableNumber"
                        type="number"
                        placeholder="Ex: 5"
                        value={customerInfo.tableNumber}
                        onChange={(e) => handleTableNumberChange(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      R$ {cart.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Itens: {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={processing || cart.items.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {processing ? 'Processando...' : 'Finalizar Pedido'}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
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