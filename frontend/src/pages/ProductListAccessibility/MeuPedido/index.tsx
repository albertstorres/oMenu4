import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, CheckCircle2, ArrowLeft, Receipt, CreditCard, Moon, Sun, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../../../hooks/useTextToSpeech';
// TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - useOrder é temporário
// import { useAuth } from '../../../contexts/AuthContext'; // TODO: Usar quando necessário
// import { useOrder } from '../../../contexts/OrderContext';
import { mockAPI } from '../../../data/mock';
import './styles.css';

interface Order {
  id: string;
  tableNumber: string;
  items: Array<{
    productId?: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

const MeuPedido: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('pedido');
  // const { user } = useAuth(); // TODO: Usar quando necessário
  // TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - useOrder é temporário
  // const { getOrderById, getLastOrder, currentOrder } = useOrder();
  const { read } = useTextToSpeech({ lang: 'pt-BR' });
  // TODO: REMOVER HARD CODE - Quando backend for implementado, obter mesa dos query params
  // HARD CODE TEMPORÁRIO: Mesa fixa = 5 (remover quando backend estiver pronto)
  const tableNumber = '5';
  const [orders, setOrders] = useState<Order[]>([]);
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // TODO: Usar quando necessário
  const [, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBill, setShowBill] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const loadOrders = useCallback(async () => {
    try {
      // TODO: REMOVER HARD CODE - Quando backend for implementado, buscar pedidos da mesa via API
      // Por enquanto, buscar todos os pedidos e filtrar por mesa (hardcoded mesa 5)
      if (mockAPI && typeof mockAPI.getOrders === 'function') {
        const allOrders = await mockAPI.getOrders();
        // Filtrar pedidos da mesa atual (hardcoded mesa 5)
        const tableOrders = allOrders.filter(o => o.tableNumber === tableNumber || o.tableNumber === '5');
        // Ordenar por data (mais recente primeiro)
        const sortedOrders = [...tableOrders].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setOrders(sortedOrders);
        
        // Se houver orderId na URL, selecionar esse pedido
        if (orderId) {
          const foundOrder = sortedOrders.find(o => o.id === orderId);
          if (foundOrder) {
            setSelectedOrder(foundOrder);
          } else if (sortedOrders.length > 0) {
            setSelectedOrder(sortedOrders[0]);
          }
        } else if (sortedOrders.length > 0) {
          setSelectedOrder(sortedOrders[0]);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [orderId, tableNumber]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'pt-BR');
    loadOrders();
    
    // Simular atualização de status (em produção viria do backend via WebSocket ou polling)
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    read(darkMode ? 'Modo claro ativado' : 'Modo escuro ativado');
  };

  // Funções para leitura de informações do pedido
  const readStatusCard = (status: 'preparing' | 'ready', isActive: boolean) => {
    if (status === 'preparing') {
      const text = isActive 
        ? 'Status atual: Em preparação. Seu pedido está sendo preparado na cozinha.'
        : 'Status concluído: Em preparação. Preparação concluída.';
      read(text);
    } else {
      const text = isActive
        ? 'Status atual: Pronto. Seu pedido está pronto para retirada.'
        : 'Aguardando: Pronto para retirada. Aguardando finalização da preparação.';
      read(text);
    }
  };

  const readOrderInfo = (order: Order) => {
    const itemsCount = order.items.reduce((sum: number, item) => sum + item.quantity, 0);
    const text = `Informações do pedido. Mesa ${order.tableNumber}. Total de ${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'}. Valor total: R$ ${order.total.toFixed(2)}.`;
    read(text);
  };

  const readMesaInfo = (order: Order) => {
    read(`Mesa: ${order.tableNumber}`);
  };

  const readItensInfo = (order: Order) => {
    const itemsCount = order.items.reduce((sum: number, item) => sum + item.quantity, 0);
    read(`Itens: ${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'}`);
  };

  const readTotalInfo = (order: Order) => {
    read(`Total: R$ ${order.total.toFixed(2)}`);
  };

  const handleViewBill = () => {
    // Calcular total de todos os pedidos da mesa
    const totalAllOrders = orders.reduce((sum, order) => sum + order.total, 0);
    setShowBill(true);
    read(`Visualizando conta. Total de ${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'}. Valor total: R$ ${totalAllOrders.toFixed(2)}`);
  };

  const handleCloseBill = () => {
    setShowBill(false);
    setPaymentCompleted(false);
  };

  const handleCloseAccount = async () => {
    // MVP: Exibir animação de pagamento
    const totalAllOrders = orders.reduce((sum, order) => sum + order.total, 0);
    setPaymentCompleted(true);
    read(`Pagamento realizado com sucesso! ${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} da mesa ${tableNumber} foram finalizados. Total pago: R$ ${totalAllOrders.toFixed(2)}. Conta fechada.`);
    
    // Fechar modal, limpar todos os pedidos da mesa e redirecionar após 2.5 segundos da animação
    setTimeout(async () => {
      // Limpar todas as variáveis de pedido do estado local
      setPaymentCompleted(false);
      setShowBill(false);
      setSelectedOrder(null);
      setOrders([]);
      
      // TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - Limpeza temporária de pedidos do mockAPI
      // Por enquanto, limpar pedidos da mesa do array mockOrders (temporário para MVP)
      // Quando backend estiver pronto, os pedidos serão gerenciados pelo backend
      try {
        // Importar mockOrders diretamente para limpar pedidos da mesa
        const mockData = await import('../../../data/mock');
        // Acessar o array mockOrders exportado (pode estar em mock.ts ou mock.js)
        const mockOrdersArray = (mockData as any).mockOrders;
        if (Array.isArray(mockOrdersArray)) {
          // Filtrar e manter apenas pedidos de outras mesas
          const filteredOrders = mockOrdersArray.filter((o: Order) => 
            String(o.tableNumber) !== String(tableNumber) && String(o.tableNumber) !== '5'
          );
          // Limpar array e adicionar apenas pedidos de outras mesas
          mockOrdersArray.length = 0;
          mockOrdersArray.push(...filteredOrders);
          console.log(`✅ Pedidos da mesa ${tableNumber} removidos. Restam ${filteredOrders.length} pedidos de outras mesas.`);
        }
      } catch (error) {
        console.error('Erro ao limpar pedidos do mockAPI:', error);
      }
      
      // Redirecionar para a home
      navigate('/');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="meu-pedido-page">
        <div className="loading-container" role="status" aria-live="polite">
          <p>Carregando informações do pedido...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className={`meu-pedido-page ${darkMode ? 'dark-mode' : ''}`}>
        <header className="pedido-header">
          <div className="header-content">
            <h1 id="pedido-title">Meus Pedidos</h1>
            <button
              type="button"
              className="dark-mode-toggle-header"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
          </div>
        </header>
        <main id="conteudo-principal" role="main">
          <div className="empty-orders-container" role="status" aria-live="polite">
            <h2>Nenhum pedido encontrado</h2>
            <p>Você ainda não fez nenhum pedido.</p>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/acessibilidade')}
              aria-label="Voltar ao cardápio para fazer um pedido"
            >
              <ArrowLeft aria-hidden="true" />
              Voltar ao Cardápio
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`meu-pedido-page ${darkMode ? 'dark-mode' : ''}`}>
      <a href="#conteudo-principal" className="skip-link">
        Pular para conteúdo principal
      </a>

      <header className="pedido-header">
        <div className="header-content">
          <h1 id="pedido-title">Meus Pedidos</h1>
          <p id="pedido-description" className="visually-hidden">
            Acompanhe o status dos seus pedidos em tempo real
          </p>
          <button
            type="button"
            className="dark-mode-toggle-header"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            aria-pressed={darkMode}
            data-testid="dark-mode-toggle"
          >
            {darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            <span className="visually-hidden">{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
          </button>
        </div>
      </header>

      <main id="conteudo-principal" role="main" aria-live="polite">
        {/* Lista de Pedidos com Scroll */}
        <section className="orders-list-section" aria-labelledby="orders-list-title">
          <h2 id="orders-list-title" className="visually-hidden">Lista de Pedidos</h2>
          <div className="orders-scroll-container">
            {orders.map((order) => {
              const isPreparing = order.status === 'preparing';
              const isReady = order.status === 'ready';
              
              return (
                <article key={order.id} className="order-card" aria-labelledby={`order-${order.id}-title`}>
                  <header className="order-card-header">
                    <h3 id={`order-${order.id}-title`} className="order-card-title">
                      Pedido #{order.id.slice(-6)}
                    </h3>
                    <span className="order-card-date" aria-label={`Data do pedido: ${new Date(order.createdAt).toLocaleString('pt-BR')}`}>
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </header>

                  {/* Status do Pedido */}
                  <section className="order-status-section" aria-labelledby={`order-${order.id}-status-title`}>
                    <h4 id={`order-${order.id}-status-title`} className="visually-hidden">Status do Pedido</h4>
                    <div className="status-cards">
                      <article 
                        className={`status-card ${isPreparing ? 'status-active' : 'status-completed'}`}
                        role="status"
                        aria-live="polite"
                      >
                        <div className="status-icon-wrapper">
                          <ChefHat 
                            className={`status-icon ${isPreparing ? 'icon-active' : 'icon-completed'}`}
                            aria-hidden="true"
                          />
                        </div>
                        <h5 className="status-title">Em Preparação</h5>
                        <p className="status-description">
                          {isPreparing ? 'Seu pedido está sendo preparado na cozinha' : 'Preparação concluída'}
                        </p>
                        {isPreparing && (
                          <div className="status-indicator" aria-hidden="true">
                            <span className="pulse-dot"></span>
                            <span className="pulse-ring"></span>
                          </div>
                        )}
                        <button
                          type="button"
                          className="read-status-button"
                          onClick={() => readStatusCard('preparing', isPreparing)}
                          aria-label={`Ler status em preparação do pedido ${order.id.slice(-6)}`}
                        >
                          <Volume2 aria-hidden="true" />
                          Ler Status
                        </button>
                      </article>

                      <article 
                        className={`status-card ${isReady ? 'status-active' : 'status-disabled'}`}
                        role="status"
                        aria-live="polite"
                      >
                        <div className="status-icon-wrapper">
                          <CheckCircle2 
                            className={`status-icon ${isReady ? 'icon-active' : 'icon-disabled'}`}
                            aria-hidden="true"
                          />
                        </div>
                        <h5 className="status-title">Pronto</h5>
                        <p className="status-description">
                          {isReady ? 'Seu pedido está pronto para retirada' : 'Aguardando finalização da preparação'}
                        </p>
                        {isReady && (
                          <div className="status-indicator" aria-hidden="true">
                            <span className="pulse-dot"></span>
                            <span className="pulse-ring"></span>
                          </div>
                        )}
                        <button
                          type="button"
                          className="read-status-button"
                          onClick={() => readStatusCard('ready', isReady)}
                          aria-label={`Ler status pronto do pedido ${order.id.slice(-6)}`}
                        >
                          <Volume2 aria-hidden="true" />
                          Ler Status
                        </button>
                      </article>
                    </div>
                  </section>

                  {/* Informações do Pedido */}
                  <section className="order-info-section" aria-labelledby={`order-${order.id}-info-title`}>
                    <div className="section-header-with-read">
                      <h4 id={`order-${order.id}-info-title`}>Informações do Pedido</h4>
                      <button
                        type="button"
                        className="read-section-button"
                        onClick={() => readOrderInfo(order)}
                        aria-label={`Ler todas as informações do pedido ${order.id.slice(-6)}`}
                      >
                        <Volume2 aria-hidden="true" />
                        Ler Informações
                      </button>
                    </div>
                    <div className="order-info-card">
                      <div className="info-row">
                        <div className="info-content-wrapper">
                          <span className="info-label">Mesa:</span>
                          <span className="info-value" aria-label={`Mesa ${order.tableNumber}`}>
                            {order.tableNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="read-info-button"
                          onClick={() => readMesaInfo(order)}
                          aria-label={`Ler informação da mesa do pedido ${order.id.slice(-6)}`}
                        >
                          <Volume2 aria-hidden="true" />
                          Ler
                        </button>
                      </div>
                      <div className="info-row">
                        <div className="info-content-wrapper">
                          <span className="info-label">Itens:</span>
                          <span className="info-value">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="read-info-button"
                          onClick={() => readItensInfo(order)}
                          aria-label={`Ler informação dos itens do pedido ${order.id.slice(-6)}`}
                        >
                          <Volume2 aria-hidden="true" />
                          Ler
                        </button>
                      </div>
                      <div className="info-row">
                        <div className="info-content-wrapper">
                          <span className="info-label">Total:</span>
                          <span className="info-value total-value" aria-label={`Total: R$ ${order.total.toFixed(2)}`}>
                            R$ {order.total.toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="read-info-button"
                          onClick={() => readTotalInfo(order)}
                          aria-label={`Ler informação do total do pedido ${order.id.slice(-6)}`}
                        >
                          <Volume2 aria-hidden="true" />
                          Ler
                        </button>
                      </div>
                    </div>
                  </section>

                </article>
              );
            })}
          </div>
        </section>

        {/* Resumo Total e Ações */}
        {orders.length > 0 && (
          <section className="orders-summary-section" aria-labelledby="orders-summary-title">
            <h2 id="orders-summary-title" className="visually-hidden">Resumo de Todos os Pedidos</h2>
            <div className="orders-summary-card">
              <div className="summary-info">
                <div className="summary-row">
                  <span className="summary-label">Total de Pedidos:</span>
                  <span className="summary-value" aria-label={`${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'}`}>
                    {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Valor Total:</span>
                  <span className="summary-value total-summary" aria-label={`Valor total: R$ ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`}>
                    R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Menu de Navegação */}
        <nav className="pedido-navigation" aria-label="Navegação principal">
          <button
            type="button"
            className="nav-action-button"
            onClick={() => navigate('/acessibilidade')}
            aria-label="Voltar ao cardápio para fazer um novo pedido"
            data-testid="back-to-menu-button"
          >
            <ArrowLeft aria-hidden="true" />
            Voltar ao Cardápio
          </button>
          {orders.length > 0 && (
            <>
              <button
                type="button"
                className="nav-action-button"
                onClick={handleViewBill}
                aria-label="Visualizar conta de todos os pedidos"
                data-testid="view-bill-button"
              >
                <Receipt aria-hidden="true" />
                Visualizar Conta
              </button>
              <button
                type="button"
                className="nav-action-button primary"
                onClick={handleCloseAccount}
                aria-label="Fechar conta e pagar todos os pedidos da mesa"
                data-testid="close-account-button"
              >
                <CreditCard aria-hidden="true" />
                Fechar Conta e Pagar
              </button>
            </>
          )}
        </nav>
      </main>

      {/* Animação de Pagamento Completo - Exibida na página principal */}
      {paymentCompleted && !showBill && (
        <div 
          className="payment-completed-overlay"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          aria-label="Pagamento realizado com sucesso"
        >
          <div className="payment-completed-animation">
            <div className="payment-icon-wrapper" aria-hidden="true">
              <CheckCircle2 className="payment-icon" />
            </div>
            <h2 className="payment-title">Pagamento Realizado!</h2>
            <p className="payment-message">
              Sua conta foi fechada com sucesso.
            </p>
            <p className="payment-table" aria-label={`Mesa ${tableNumber}`}>
              Mesa {tableNumber}
            </p>
          </div>
        </div>
      )}

      {/* Modal de Conta */}
      {showBill && orders.length > 0 && (
        <div 
          className="bill-modal-overlay"
          onClick={handleCloseBill}
          aria-label="Fechar visualização de conta"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bill-title"
        >
          <div 
            className="bill-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            {paymentCompleted ? (
              <div 
                className="payment-completed-animation"
                role="status"
                aria-live="assertive"
                aria-atomic="true"
                aria-label="Pagamento realizado com sucesso"
              >
                <div className="payment-icon-wrapper" aria-hidden="true">
                  <CheckCircle2 className="payment-icon" />
                </div>
                <h2 className="payment-title">Pagamento Realizado!</h2>
                <p className="payment-message">
                  Sua conta foi fechada com sucesso.
                </p>
                <p className="payment-table" aria-label={`Mesa ${tableNumber}`}>
                  Mesa {tableNumber}
                </p>
              </div>
            ) : (
              <>
            <header className="bill-header">
              <h2 id="bill-title">Conta - Mesa {tableNumber}</h2>
                  <button
                    type="button"
                    className="bill-close-button"
                    onClick={handleCloseBill}
                    aria-label="Fechar conta"
                  >
                    ×
                  </button>
                </header>

                <div className="bill-body">
              <section className="bill-items" aria-labelledby="bill-items-title">
                <h3 id="bill-items-title" className="visually-hidden">Itens de Todos os Pedidos</h3>
                <ul className="bill-items-list">
                  {orders.map((order, orderIndex) => (
                    <React.Fragment key={order.id}>
                      {order.items.map((item, itemIndex) => (
                        <li key={`${order.id}-${itemIndex}`} className="bill-item">
                          <div className="bill-item-info">
                            <span className="bill-item-name">{item.name}</span>
                            <span className="bill-item-quantity" aria-label={`Quantidade: ${item.quantity}`}>
                              {item.quantity}x
                            </span>
                            {orders.length > 1 && (
                              <span className="bill-item-order" aria-label={`Pedido ${orderIndex + 1}`}>
                                (Pedido #{order.id.slice(-6)})
                              </span>
                            )}
                          </div>
                          <span className="bill-item-price" aria-label={`Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}`}>
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </section>

              <div className="bill-total-section">
                <div className="bill-total-row">
                  <span className="bill-total-label">Total:</span>
                  <span className="bill-total-value" role="status" aria-live="polite">
                    R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </span>
                </div>
                {orders.length > 1 && (
                  <div className="bill-orders-count" role="status" aria-live="polite">
                    {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
                  </div>
                )}
              </div>
            </div>

            <footer className="bill-footer">
              <button
                type="button"
                className="bill-action-button secondary"
                onClick={handleCloseBill}
                aria-label="Fechar conta"
              >
                Fechar
              </button>
              <button
                type="button"
                className="bill-action-button primary"
                onClick={handleCloseAccount}
                aria-label="Fechar conta e seguir para pagamento"
                data-testid="close-account-button"
              >
                <CreditCard aria-hidden="true" />
                Fechar Conta e Pagar
              </button>
            </footer>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeuPedido;

