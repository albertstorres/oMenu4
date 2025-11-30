import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, Moon, Sun, Volume2, ChevronRight, ShoppingCart } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockAPI } from '../../data/mock';
import CartSidebarAccessibility from '../../components/CartSidebarAccessibility';
import './styles.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

const ProductListAccessibility: React.FC = () => {
  const { addItem, setIsOpen, cart, isOpen } = useCart();
  
  // Debug: verificar quando itens são adicionados
  useEffect(() => {
    console.log('📦 Itens no carrinho (página acessibilidade):', { 
      itemsCount: cart.items?.length || 0, 
      items: cart.items 
    });
  }, [cart.items]);
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const {
    read
  } = useTextToSpeech({ lang: 'pt-BR' });

  const pageTitle = user?.name ? `Cardápio de ${user.name}` : 'Cardápio Digital Acessível';

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'pt-BR');
    loadProducts();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const loadProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const productsData = await mockAPI.getProducts();
      setProducts(productsData);
      const uniqueCategories = Array.from(new Set(productsData.map((product: Product) => product.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        `${product.name} ${product.description}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce<Record<string, Product[]>>((groups, product) => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
      return groups;
    }, {});
  }, [filteredProducts]);

  const handleAddToCart = (product: Product): void => {
    if (product.available) {
      console.log('➕ Adicionando produto ao carrinho:', product);
      addItem(product, 1);
      console.log('✅ Produto adicionado. Carrinho agora tem:', cart.items?.length || 0, 'itens');
      const message = `${product.name} adicionado ao pedido por R$ ${product.price.toFixed(2)}`;
      read(message);
    }
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, product: Product): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddToCart(product);
    }
  };

  const readProduct = (product: Product) => {
    const element = document.getElementById(`prato-${product.id}`);
    const text = `${product.name}. ${product.description}. Preço: R$ ${product.price.toFixed(2)}. ${product.available ? 'Disponível' : 'Indisponível'}`;
    read(text, element || undefined);
  };

  const readCategory = (category: string) => {
    const element = document.getElementById(`categoria-${category}`);
    const text = `Categoria: ${category}`;
    read(text, element || undefined);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="product-accessibility-page" role="application" aria-label="Modo acessível do cardápio" data-testid="accessibility-page">
        <div className="loading-state" role="status" aria-live="polite" aria-busy="true" data-testid="loading-state">
          <div className="loading-spinner" aria-hidden="true" />
          <p>Carregando cardápio acessível...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-accessibility-page ${darkMode ? 'dark-mode' : ''}`} role="application" aria-label="Modo acessível do cardápio digital oMenu" data-testid="accessibility-page">
      <a href="#conteudo-principal" className="skip-link" data-testid="skip-link">
        Pular para o conteúdo principal
      </a>

      <header className="accessibility-header" aria-labelledby="restaurant-title" data-testid="accessibility-header">
        <div className="header-content">
          <div className="header-top">
            <div>
              <p className="header-kicker">Experiência otimizada para leitores de tela</p>
              <h1 id="restaurant-title" data-testid="restaurant-title">{pageTitle}</h1>
              <p id="restaurant-context">
                Use o teclado para navegar: Tab para avançar, Shift+Tab para voltar. Pressione Enter no botão "Adicionar ao pedido" para colocar o prato no carrinho.
              </p>
            </div>
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
        </div>

      </header>

      {/* Botão flutuante de carrinho - aparece apenas quando o carrinho está fechado */}
      {!isOpen && (
        <button
          type="button"
          className="floating-cart-button"
          onClick={() => setIsOpen(true)}
          aria-label={`Ver carrinho. ${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'} no carrinho`}
          data-testid="floating-cart-button"
          tabIndex={0}
        >
          <ShoppingCart aria-hidden="true" />
          {cart.items.length > 0 && (
            <span className="floating-cart-badge" aria-label={`${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'}`}>
              {cart.items.length}
            </span>
          )}
        </button>
      )}

      <main id="conteudo-principal" role="main" aria-live="polite" data-testid="main-content">
        <section className="filters-section-accessible" aria-labelledby="filtros-cardapio" data-testid="filters-section">
          <h2 id="filtros-cardapio">Filtros do cardápio</h2>
          <p id="filters-instructions">
            Todos os campos têm rótulos. Informe o termo desejado ou escolha uma categoria para refinar os resultados.
          </p>
          <div className="filters-grid" aria-describedby="filters-instructions" data-testid="filters-grid">
            <div className="filter-field">
              <label htmlFor="search-products">Buscar pratos</label>
              <div className="input-with-icon">
                <Search aria-hidden="true" focusable="false" className="field-icon" />
                <input
                  id="search-products"
                  type="search"
                  className="accessible-input"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  aria-describedby="filters-instructions"
                  aria-controls="lista-categorias"
                  placeholder="Ex: Salada, Lasanha..."
                  data-testid="search-input"
                />
              </div>
            </div>

            <div className="filter-field">
              <label htmlFor="category-select">Filtrar por categoria</label>
              <div className="input-with-icon">
                <Filter aria-hidden="true" focusable="false" className="field-icon" />
                <select
                  id="category-select"
                  className="accessible-select"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  aria-describedby="filters-instructions"
                  data-testid="category-select"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section aria-live="polite" aria-atomic="true" className="results-info-accessible" data-testid="results-section">
          <p id="resultado-contagem">
            {filteredProducts.length} prato(s) encontrados
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
          </p>
        </section>

        <section id="lista-categorias" className="categories-section" data-testid="categories-section">
          {filteredProducts.length === 0 && (
            <div className="empty-state" role="status" aria-live="assertive" data-testid="empty-state">
              <p>Nenhum prato foi localizado com os filtros informados.</p>
              <p className="empty-state-subtitle">Ajuste a busca ou escolha outra categoria.</p>
            </div>
          )}

          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category} className="category-group" aria-labelledby={`categoria-${category}`} data-testid={`category-${category}`}>
              <div className="category-header">
                <h2 id={`categoria-${category}`}>{category}</h2>
                <button
                  type="button"
                  className="read-category-button"
                  onClick={() => readCategory(category)}
                  aria-label={`Ler categoria ${category}`}
                  data-testid={`read-category-${category}`}
                >
                  <ChevronRight aria-hidden="true" />
                  <span className="visually-hidden">Ler categoria</span>
                </button>
              </div>
              <div className="products-grid-accessible" data-testid={`products-grid-${category}`}>
                {items.map((product) => {
                  const productDescriptionId = `descricao-${product.id}`;
                  const productPriceId = `preco-${product.id}`;
                  const productImageCaptionId = `imagem-${product.id}`;
                  return (
                    <article
                      key={product.id}
                      id={`prato-${product.id}`}
                      className="accessible-card"
                      role="article"
                      aria-labelledby={`prato-name-${product.id}`}
                      aria-describedby={`${productImageCaptionId} ${productDescriptionId} ${productPriceId}`}
                      tabIndex={0}
                      onKeyDown={(event) => handleCardKeyDown(event, product)}
                      data-available={product.available}
                      data-testid={`product-card-${product.id}`}
                    >
                      <figure className="card-media">
                        <img
                          src={product.image}
                          alt={`Fotografia em close do prato ${product.name}, categoria ${product.category}. ${product.description}. Apresentado por R$ ${product.price.toFixed(2)}.`}
                          loading="lazy"
                          data-testid={`product-image-${product.id}`}
                        />
                        <figcaption id={productImageCaptionId} className="visually-hidden">
                          {`Imagem do prato ${product.name}, categoria ${product.category}, ${product.available ? 'disponível' : 'indisponível'} por R$ ${product.price.toFixed(2)}. ${product.description}`}
                        </figcaption>
                      </figure>
                      <div className="card-body">
                        <p className="card-category" aria-label={`Categoria ${product.category}`} data-testid={`product-category-${product.id}`}>
                          {product.category}
                        </p>
                        <h3 id={`prato-name-${product.id}`} data-testid={`product-name-${product.id}`}>{product.name}</h3>
                        <p id={productDescriptionId} className="card-description" data-testid={`product-description-${product.id}`}>
                          {product.description}
                        </p>
                        <p id={productPriceId} className="card-price" data-testid={`product-price-${product.id}`}>
                          R$ {product.price.toFixed(2)}
                        </p>
                        {!product.available && (
                          <p className="unavailable-text" role="status" data-testid={`product-unavailable-${product.id}`}>
                            Indisponível no momento
                          </p>
                        )}
                        <div className="card-actions">
                          <button
                            type="button"
                            className="read-product-button"
                            onClick={() => readProduct(product)}
                            aria-label={`Ler informações do prato ${product.name}`}
                            data-testid={`read-product-${product.id}`}
                          >
                            <Volume2 aria-hidden="true" />
                            <span className="visually-hidden">Ler prato</span>
                          </button>
                          <button
                            type="button"
                            className="add-button"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.available}
                            aria-disabled={!product.available}
                            aria-label={`Adicionar ${product.name} ao pedido por R$ ${product.price.toFixed(2)}`}
                            tabIndex={product.available ? 0 : -1}
                            data-testid={`add-to-cart-${product.id}`}
                          >
                            <Plus aria-hidden="true" focusable="false" className="button-icon" />
                            Adicionar ao pedido
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </section>
      </main>
      <CartSidebarAccessibility />
    </div>
  );
};

export default ProductListAccessibility;
