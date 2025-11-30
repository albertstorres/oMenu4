import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
// TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - useOrder é temporário
// import { useOrder } from '../../contexts/OrderContext';
import { useToast } from '../../hooks/use-toast';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { mockAPI } from '../../data/mock';
// TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - Order type será importado da API
// import { Order } from '../../data/mock';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  MapPin,
  CheckCircle2,
  X,
  Volume2
} from 'lucide-react';
import './styles.css';

const CartSidebarAccessibility: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    clearCart
  } = useCart();
  // TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - useOrder é temporário
  // const { addOrder } = useOrder();
  const { toast } = useToast();
  const { read } = useTextToSpeech();
  const [notes, setNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [orderSent, setOrderSent] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Debug: verificar mudanças no carrinho
  useEffect(() => {
    console.log('🛒 Carrinho mudou:', { 
      itemsCount: cart.items?.length || 0, 
      items: cart.items,
      total: cart.total,
      isOpen 
    });
  }, [cart.items, cart.total, isOpen]);
  
  // TODO: REMOVER HARD CODE - Quando o backend for implementado, obter mesa dos query params
  // HARD CODE TEMPORÁRIO: Mesa fixa = 5 (remover quando backend estiver pronto)
  const tableNumber = '5';

  // Refs para leitor de tela
  const cartAnnouncementRef = useRef<HTMLDivElement>(null);
  const orderSentAnnouncementRef = useRef<HTMLDivElement>(null);

  // Resetar estado quando o carrinho fechar
  useEffect(() => {
    if (!isOpen) {
      setOrderSent(false);
      setNotes('');
    }
  }, [isOpen]);

  // Anunciar mudanças no carrinho para leitor de tela
  useEffect(() => {
    if (cart.items.length > 0 && isOpen && cartAnnouncementRef.current) {
      const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const announcement = `Carrinho atualizado. ${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho. Total: R$ ${cart.total.toFixed(2)}`;
      cartAnnouncementRef.current.textContent = announcement;
    }
  }, [cart.items, cart.total, isOpen]);

  // Anunciar pedido enviado para leitor de tela e usar TTS
  useEffect(() => {
    if (orderSent) {
      // Usar os itens do carrinho antes de limpar
      const itemsBeforeClear = [...(cart.items || [])];
      const totalItems = itemsBeforeClear.reduce((sum, item) => sum + item.quantity, 0);
      
      // Lista apenas com nomes dos pratos (sucinta)
      const itemsList = itemsBeforeClear.length > 0 
        ? itemsBeforeClear.map((item) => {
            // Se quantidade > 1, incluir quantidade, senão apenas o nome
            return item.quantity > 1 
              ? `${item.quantity}x ${item.name}`
              : item.name;
          }).join(', ')
        : 'nenhum item';
      
      // Mensagem sucinta
      const announcement = `Pedido enviado com sucesso para a mesa ${tableNumber}. Itens: ${itemsList}. Total: R$ ${cart.total.toFixed(2)}.`;
      
      console.log('Anunciando pedido enviado:', announcement);
      
      // Usar TTS para ler a mensagem
      read(announcement);
      
      // Também atualizar o aria-live para leitores de tela
      if (orderSentAnnouncementRef.current) {
        const announcementElement = orderSentAnnouncementRef.current;
        
        // Limpar completamente
        announcementElement.textContent = '';
        announcementElement.innerHTML = '';
        announcementElement.removeAttribute('aria-label');
        
        // Forçar múltiplas atualizações
        const updateAnnouncement = () => {
          if (announcementElement) {
            announcementElement.textContent = announcement;
            announcementElement.setAttribute('aria-label', announcement);
            // Forçar reflow (void para evitar warning do ESLint)
            void announcementElement.offsetHeight;
          }
        };
        
        // Atualizar imediatamente
        updateAnnouncement();
        
        // Atualizar após pequenos delays para garantir detecção
        setTimeout(updateAnnouncement, 50);
        setTimeout(updateAnnouncement, 150);
        setTimeout(updateAnnouncement, 300);
        setTimeout(updateAnnouncement, 500);
        setTimeout(updateAnnouncement, 800);
      }
    }
  }, [orderSent, tableNumber, cart.total, cart.items, read]);

  const handleQuantityChange = (productId: string, newQuantity: number, itemName: string): void => {
    if (newQuantity <= 0) {
      removeItem(productId);
      // Anunciar remoção
      if (cartAnnouncementRef.current) {
        cartAnnouncementRef.current.textContent = `${itemName} removido do carrinho.`;
      }
    } else {
      updateQuantity(productId, newQuantity);
      // Anunciar mudança de quantidade
      if (cartAnnouncementRef.current) {
        cartAnnouncementRef.current.textContent = `Quantidade de ${itemName} alterada para ${newQuantity}.`;
      }
    }
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

    if (processing || orderSent) {
      return;
    }

    setProcessing(true);

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
      
      const createdOrderResponse = await mockAPI.createOrder(orderData);
      
      // TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - OrderContext é temporário
      // Criar objeto Order completo para armazenar no contexto
      /*
      const newOrder: Order = {
        id: createdOrderResponse.id,
        tableNumber: orderData.tableNumber,
        items: orderData.items.map(item => ({
          productId: item.productId || '',
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: orderData.total,
        status: 'preparing',
        createdAt: new Date().toISOString()
      };
      
      // Adicionar pedido ao contexto (que também salva no localStorage)
      addOrder(newOrder);
      setOrderId(newOrder.id);
      */
      
      // TODO: Quando backend estiver pronto, usar o ID retornado pela API
      setOrderId(createdOrderResponse.id);
      
      // Exibir animação de sucesso
      setProcessing(false);
      setOrderSent(true);
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido para a mesa ${tableNumber} foi enviado para a cozinha.`,
      });

      // Fechar carrinho e redirecionar após 2.5 segundos da animação
      setTimeout(() => {
        clearCart();
        setNotes('');
        setOrderSent(false);
        setIsOpen(false);
        // Redirecionar para página de rastreamento
        // TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - usar ID do pedido retornado pela API
        if (createdOrderResponse.id) {
          navigate(`/acessibilidade/meuPedidos?pedido=${createdOrderResponse.id}`);
        }
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

  // Debug: verificar se o carrinho está sendo renderizado
  console.log('CartSidebarAccessibility renderizando', { 
    isOpen, 
    itemsCount: cart.items?.length || 0, 
    orderSent,
    items: cart.items 
  });

  if (!isOpen) return null;

  return (
    <div 
      className="cart-sidebar-accessibility"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      aria-describedby="cart-description"
    >
      {/* Região de anúncios para leitor de tela - DEVE estar no nível superior */}
      <div 
        ref={cartAnnouncementRef}
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="cart-announcement"
      />

      {/* Overlay */}
      <div 
        className="cart-overlay"
        onClick={() => setIsOpen(false)}
        aria-label="Fechar carrinho"
      />

      {/* Conteúdo do Carrinho */}
      <aside 
        className="cart-content-wrapper"
        role="complementary"
        aria-label="Carrinho de compras"
      >
        {orderSent ? (
            <div 
              className="order-sent-animation"
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              aria-label={`Pedido enviado com sucesso para a mesa ${tableNumber}`}
            >
              {/* Texto para leitor de tela - DEVE estar no início para ser lido primeiro */}
              <div 
                ref={orderSentAnnouncementRef}
                className="visually-hidden" 
                aria-live="assertive"
                role="status"
                aria-atomic="true"
                id="order-sent-announcement-text"
              />
              <div className="success-icon-wrapper" aria-hidden="true">
                <CheckCircle2 className="success-icon" />
              </div>
              <h2 id="order-sent-title" className="success-title">Pedido Enviado!</h2>
              <p className="success-message">
                Seu pedido foi enviado para a cozinha com sucesso.
              </p>
              {/* TODO: REMOVER HARD CODE - Quando backend estiver pronto, mesa vem de query params */}
              {/* HARD CODE: Sempre exibe mesa 5 por enquanto */}
              <p className="success-table" aria-label={`Mesa ${tableNumber}`}>
                Mesa {tableNumber}
              </p>
            </div>
        ) : (
          <>
            {/* Cabeçalho */}
            <header className="cart-header">
              <h1 id="cart-title" className="cart-title">
                <ShoppingCart className="cart-title-icon" aria-hidden="true" />
                Carrinho
                <span className="cart-count" aria-label={`${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'}`}>
                  ({cart.items.length})
                </span>
              </h1>
              <p id="cart-description" className="cart-description">
                Revise seus itens e finalize o pedido
              </p>
              <button
                type="button"
                className="cart-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar carrinho"
              >
                <X aria-hidden="true" />
                <span className="visually-hidden">Fechar carrinho</span>
              </button>
            </header>

            <div className="cart-body">
              {/* Lista de Itens */}
              <section 
                className="cart-items-section"
                aria-labelledby="cart-items-title"
                role="region"
              >
                {cart.items.length === 0 ? (
                  <div className="empty-cart" role="status" aria-live="polite">
                    <ShoppingCart className="empty-cart-icon" aria-hidden="true" />
                    <h2 className="empty-cart-title">Carrinho vazio</h2>
                    <p className="empty-cart-description">
                      Adicione itens do cardápio para começar seu pedido
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 id="cart-items-title" className="cart-items-title">
                      Revisão dos Itens ({cart.items.length})
                    </h2>
                    <ul className="cart-items-list" role="list" aria-label={`Lista de ${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'} no carrinho`}>
                      {cart.items && cart.items.length > 0 ? cart.items.map((item, index) => {
                        console.log('Renderizando item:', item.name, index);
                        const itemTotal = item.price * item.quantity;
                        return (
                          <li 
                            key={item.id}
                            className="cart-item-card"
                            role="listitem"
                            aria-label={`Item ${index + 1} de ${cart.items.length}: ${item.name}, categoria ${item.category}, preço unitário R$ ${item.price.toFixed(2)}, quantidade ${item.quantity}, subtotal R$ ${(item.price * item.quantity).toFixed(2)}`}
                            style={{ 
                              display: 'block', 
                              visibility: 'visible', 
                              opacity: 1,
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <article className="cart-item" aria-labelledby={`item-name-${item.id}`}>
                              <img 
                                src={item.image} 
                                alt={`Imagem do prato ${item.name}`}
                                className="cart-item-image"
                                aria-hidden="false"
                              />
                              <div className="cart-item-details">
                                <h3 id={`item-name-${item.id}`} className="cart-item-name">{item.name}</h3>
                                <p className="cart-item-price" aria-label={`Preço unitário: R$ ${item.price.toFixed(2)}`}>
                                  R$ {item.price.toFixed(2)}
                                </p>
                                <span className="cart-item-category" aria-label={`Categoria: ${item.category}`}>
                                  {item.category}
                                </span>
                                <button
                                  type="button"
                                  className="read-item-button"
                                  onClick={() => {
                                    const itemText = `${item.name}, categoria ${item.category}, preço unitário R$ ${item.price.toFixed(2)}, quantidade ${item.quantity}, subtotal R$ ${(item.price * item.quantity).toFixed(2)}`;
                                    read(itemText);
                                  }}
                                  aria-label={`Ler informações completas de ${item.name}`}
                                >
                                  <Volume2 aria-hidden="true" />
                                  <span className="visually-hidden">Ler item</span>
                                </button>
                              </div>
                              <div className="cart-item-controls">
                                <button
                                  type="button"
                                  className="remove-button"
                                  onClick={() => {
                                    removeItem(item.id);
                                    if (cartAnnouncementRef.current) {
                                      cartAnnouncementRef.current.textContent = `${item.name} removido do carrinho.`;
                                    }
                                  }}
                                  aria-label={`Remover ${item.name} do carrinho`}
                                >
                                  <Trash2 aria-hidden="true" />
                                  <span className="visually-hidden">Remover</span>
                                </button>
                                <div className="quantity-controls" role="group" aria-label={`Controles de quantidade para ${item.name}`}>
                                  <button
                                    type="button"
                                    className="quantity-button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.name)}
                                    aria-label={`Diminuir quantidade de ${item.name}. Quantidade atual: ${item.quantity}`}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus aria-hidden="true" />
                                    <span className="visually-hidden">Diminuir</span>
                                  </button>
                                  <span 
                                    className="quantity-display"
                                    aria-label={`Quantidade de ${item.name}: ${item.quantity}`}
                                    role="status"
                                  >
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="quantity-button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.name)}
                                    aria-label={`Aumentar quantidade de ${item.name}. Quantidade atual: ${item.quantity}`}
                                  >
                                    <Plus aria-hidden="true" />
                                    <span className="visually-hidden">Aumentar</span>
                                  </button>
                                </div>
                              </div>
                            </article>
                            <div className="cart-item-total" role="status">
                              <span 
                                className="item-total-price"
                                aria-label={`Subtotal de ${item.name}: R$ ${itemTotal.toFixed(2)}`}
                              >
                                R$ {itemTotal.toFixed(2)}
                              </span>
                              <span className="visually-hidden">
                                {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'} de {item.name} a R$ {item.price.toFixed(2)} cada, totalizando R$ {itemTotal.toFixed(2)}
                              </span>
                            </div>
                          </li>
                        );
                      }) : (
                        <li style={{ padding: '1rem', textAlign: 'center' }}>Nenhum item no carrinho</li>
                      )}
                    </ul>
                  </>
                )}
              </section>

              {/* Seção de Checkout */}
              {cart.items.length > 0 && (
                <section 
                  className="checkout-section"
                  aria-labelledby="checkout-title"
                >
                  <div className="checkout-content">
                    <h2 id="checkout-title" className="visually-hidden">
                      Informações do pedido e finalização
                    </h2>

                    {/* Informações do Pedido */}
                    <div className="order-info" role="group" aria-labelledby="order-info-title">
                      <h3 id="order-info-title" className="visually-hidden">Informações do pedido</h3>
                      {/* TODO: REMOVER HARD CODE - Quando backend estiver pronto, mesa vem de query params */}
                      {/* HARD CODE: Sempre exibe mesa 5 por enquanto */}
                      <div className="info-row">
                        <MapPin className="info-icon" aria-hidden="true" />
                        <div className="info-content">
                          <span className="info-label">Mesa</span>
                          <span className="info-value" aria-label={`Mesa ${tableNumber}`}>
                            Mesa {tableNumber}
                          </span>
                        </div>
                      </div>

                      <div className="input-group">
                        <label htmlFor="notes-accessibility" className="input-label">
                          Observações (opcional)
                        </label>
                        <textarea
                          id="notes-accessibility"
                          className="notes-textarea"
                          placeholder="Alguma observação especial?"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          aria-label="Campo de observações do pedido. Opcional."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="separator" role="separator" aria-orientation="horizontal" />

                    {/* Total */}
                    <div className="total-section" role="group" aria-labelledby="total-title">
                      <h3 id="total-title" className="visually-hidden">Total do pedido</h3>
                      <div className="total-row">
                        <span>Total:</span>
                        <span 
                          className="total-price"
                          aria-label={`Total do pedido: R$ ${cart.total.toFixed(2)}`}
                        >
                          R$ {cart.total.toFixed(2)}
                        </span>
                      </div>
                      <p className="items-count" aria-label={`Total de itens: ${cart.items.reduce((sum, item) => sum + item.quantity, 0)}`}>
                        Itens: {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="checkout-actions" role="group" aria-label="Ações do carrinho">
                      <button
                        type="button"
                        className="checkout-button"
                        onClick={handleCheckout}
                        disabled={processing || cart.items.length === 0 || orderSent}
                        aria-label={processing ? 'Processando pedido...' : orderSent ? 'Pedido enviado' : `Finalizar pedido. Total: R$ ${cart.total.toFixed(2)}`}
                        aria-busy={processing}
                      >
                        <CreditCard className="checkout-icon" aria-hidden="true" />
                        {processing ? 'Processando...' : orderSent ? 'Pedido Enviado!' : 'Finalizar Pedido'}
                      </button>

                      <button
                        type="button"
                        className="clear-button"
                        onClick={() => {
                          clearCart();
                          if (cartAnnouncementRef.current) {
                            cartAnnouncementRef.current.textContent = 'Carrinho limpo. Todos os itens foram removidos.';
                          }
                        }}
                        disabled={processing}
                        aria-label="Limpar carrinho. Remove todos os itens."
                      >
                        Limpar Carrinho
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartSidebarAccessibility;

