import React, { useState, useEffect } from 'react';
// TODO: REMOVER HARD CODE - Quando backend for implementado, reativar useSearchParams
// import { useSearchParams } from 'react-router-dom';
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
import { useToast } from '../../hooks/use-toast';
import { mockAPI } from '../../data/mock';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import './styles.css';

const CartSidebar: React.FC = () => {
  // TODO: REMOVER HARD CODE - Quando backend for implementado, reativar useSearchParams
  // const [searchParams] = useSearchParams();
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    clearCart,
    // TODO: REMOVER HARD CODE - Quando backend for implementado, reativar setTableNumber
    // setTableNumber 
  } = useCart();
  const { toast } = useToast();
  const [notes, setNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [orderSent, setOrderSent] = useState<boolean>(false);
  
  // TODO: REMOVER HARD CODE - Quando o backend for implementado, obter mesa dos query params
  // const tableNumber = searchParams.get('mesa') || searchParams.get('table') || '';
  // HARD CODE TEMPORÁRIO: Mesa fixa = 5 (remover quando backend estiver pronto)
  const tableNumber = '5';

  // TODO: REMOVER - Atualizar número da mesa no contexto quando mudar (quando backend estiver pronto)
  // useEffect(() => {
  //   if (tableNumber) {
  //     setTableNumber(tableNumber);
  //   }
  // }, [tableNumber, setTableNumber]);

  // Resetar estado quando o carrinho fechar
  useEffect(() => {
    if (!isOpen) {
      setOrderSent(false);
      setNotes('');
    }
  }, [isOpen]);

  const handleQuantityChange = (productId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async (): Promise<void> => {
    console.log('🚀 === handleCheckout INICIADO ===', {
      itemsCount: cart.items.length,
      tableNumber,
      processing,
      orderSent,
      cartItems: cart.items
    });
    
    // Validações básicas
    if (cart.items.length === 0) {
      console.log('❌ Carrinho vazio!');
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive",
      });
      return;
    }

    // TODO: REMOVER HARD CODE - Quando backend for implementado, reativar validação de mesa
    // if (!tableNumber) {
    //   console.log('❌ Mesa não informada!', { tableNumber, url: window.location.href });
    //   toast({
    //     title: "Mesa não informada",
    //     description: "O número da mesa deve ser informado na URL (ex: ?mesa=5).",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (processing || orderSent) {
      console.log('❌ Já está processando ou enviado!', { processing, orderSent });
      return;
    }

    // Mostrar estado de processamento
    console.log('✅ Validações passadas! Iniciando processamento...');
    setProcessing(true);
    console.log('Estado processing atualizado para true');

    try {
      const orderData = {
        // TODO: REMOVER HARD CODE - tableNumber vem de query params quando backend estiver pronto
        tableNumber: tableNumber, // HARD CODE: sempre '5' por enquanto
        customerName: 'Cliente',
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cart.total,
        notes: notes,
        status: 'preparing'
      };

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await mockAPI.createOrder(orderData);
      
      // Exibir animação de sucesso
      console.log('✅ Pedido criado! Exibindo animação...');
      setProcessing(false);
      console.log('setProcessing(false) executado');
      setOrderSent(true);
      console.log('setOrderSent(true) executado');
      
      // Forçar atualização imediata
      setTimeout(() => {
        console.log('Verificando estado após 100ms:', { orderSent });
      }, 100);
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido para a mesa ${tableNumber} foi enviado para a cozinha.`,
      });

      // Fechar carrinho após 2.5 segundos da animação
      setTimeout(() => {
        clearCart();
        setNotes('');
        setOrderSent(false);
        setIsOpen(false);
      }, 2500);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setProcessing(false);
      setOrderSent(false);
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao enviar o pedido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  console.log('🔄 Renderizando CartSidebar', { 
    isOpen, 
    orderSent, 
    processing, 
    itemsCount: cart.items.length,
    tableNumber, // HARD CODE: sempre '5' por enquanto
    willShowAnimation: orderSent === true
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="cart-sheet">
        {orderSent ? (
          <div className="order-sent-animation">
            <div className="success-icon-wrapper">
              <CheckCircle2 className="success-icon" />
            </div>
            <h2 className="success-title">Pedido Enviado!</h2>
            <p className="success-message">
              Seu pedido foi enviado para a cozinha com sucesso.
            </p>
            {/* TODO: REMOVER HARD CODE - Quando backend estiver pronto, mesa vem de query params */}
            {/* HARD CODE: Sempre exibe mesa 5 por enquanto */}
            <p className="success-table">
              Mesa {tableNumber}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              <SheetHeader>
                <SheetTitle className="cart-title">
                  <ShoppingCart className="cart-title-icon" />
                  Carrinho ({cart.items.length})
                </SheetTitle>
                <SheetDescription>
                  Revise seus itens e finalize o pedido
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="cart-content">
          {/* Cart Items - Revisão dos Itens */}
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
              <>
                <h3 className="cart-items-title">Revisão dos Itens</h3>
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
              </>
            )}
          </div>

          {/* Checkout Section */}
          {cart.items.length > 0 && (
            <div className="checkout-section">
              <div className="checkout-content">
                {/* Informações do Pedido */}
                <div className="order-info">
                  {/* TODO: REMOVER HARD CODE - Quando backend estiver pronto, mesa vem de query params */}
                  {/* HARD CODE: Sempre exibe mesa 5 por enquanto */}
                  <div className="info-row">
                    <MapPin className="info-icon" />
                    <div className="info-content">
                      <Label className="info-label">Mesa</Label>
                      <span className="info-value">Mesa {tableNumber}</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Alguma observação especial?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('=== BOTÃO CLICADO ===', {
                      processing,
                      itemsCount: cart.items.length,
                      orderSent,
                      tableNumber, // HARD CODE: sempre '5' por enquanto
                      disabled: processing || cart.items.length === 0 || orderSent
                    });
                    try {
                      handleCheckout();
                    } catch (error) {
                      console.error('Erro ao chamar handleCheckout:', error);
                      alert('Erro: ' + error);
                    }
                  }}
                  disabled={processing || cart.items.length === 0 || orderSent}
                  className="checkout-button"
                  style={{ 
                    cursor: (processing || cart.items.length === 0 || orderSent) ? 'not-allowed' : 'pointer',
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CreditCard className="checkout-icon" />
                  {processing ? 'Processando...' : orderSent ? 'Pedido Enviado!' : 'Finalizar Pedido'}
                </button>

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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
