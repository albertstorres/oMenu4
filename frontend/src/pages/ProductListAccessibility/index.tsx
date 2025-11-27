import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Search, Filter, Plus, Play, Pause, Square, Moon, Sun, Volume2, ChevronRight } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockAPI } from '../../data/mock';
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
  const { addItem } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAudioControls, setShowAudioControls] = useState<boolean>(true);
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const {
    isReading,
    isPaused,
    read,
    pause,
    resume,
    stop,
    setRate,
    setPitch,
    setVolume,
    rate,
    pitch,
    volume
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
      addItem(product, 1);
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

  const readTitle = () => {
    const text = `${pageTitle}. ${document.getElementById('restaurant-context')?.textContent || ''}`;
    read(text, titleRef.current || undefined);
  };

  const readFilters = () => {
    const text = `Filtros do cardápio. ${document.getElementById('filters-instructions')?.textContent || ''}`;
    read(text, filtersRef.current || undefined);
  };

  const readResults = () => {
    const text = document.getElementById('resultado-contagem')?.textContent || '';
    read(text, resultsRef.current || undefined);
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
    const message = darkMode ? 'Modo claro ativado' : 'Modo escuro ativado';
    read(message);
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

      {/* Controles de Acessibilidade */}
      <div className="accessibility-controls" role="toolbar" aria-label="Controles de acessibilidade" data-testid="accessibility-controls">
        <div className="controls-group">
          <h2 className="controls-title">Controles de Leitura</h2>
          
          <div className="audio-controls" data-testid="audio-controls">
            <button
              type="button"
              className="control-button"
              onClick={isReading && !isPaused ? pause : resume}
              disabled={!isReading && !isPaused}
              aria-label={isReading && !isPaused ? 'Pausar leitura' : 'Retomar leitura'}
              data-testid="play-pause-button"
            >
              {isReading && !isPaused ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              <span className="visually-hidden">{isReading && !isPaused ? 'Pausar' : 'Reproduzir'}</span>
            </button>

            <button
              type="button"
              className="control-button"
              onClick={stop}
              disabled={!isReading && !isPaused}
              aria-label="Parar leitura"
              data-testid="stop-button"
            >
              <Square aria-hidden="true" />
              <span className="visually-hidden">Parar</span>
            </button>

            <div className="speed-control" data-testid="speed-control">
              <label htmlFor="speed-slider">Velocidade</label>
              <input
                id="speed-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label="Velocidade de leitura"
                data-testid="speed-slider"
              />
              <span className="speed-value">{rate.toFixed(1)}x</span>
            </div>

            <div className="volume-control" data-testid="volume-control">
              <label htmlFor="volume-slider">
                <Volume2 aria-hidden="true" />
                <span className="visually-hidden">Volume</span>
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume de leitura"
                data-testid="volume-slider"
              />
              <span className="volume-value">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="navigation-controls" data-testid="navigation-controls">
            <h3 className="navigation-title">Navegação Rápida</h3>
            <button
              type="button"
              className="nav-quick-button"
              onClick={readTitle}
              aria-label="Ler título da página"
              data-testid="read-title-button"
            >
              Ler Título
            </button>
            <button
              type="button"
              className="nav-quick-button"
              onClick={readFilters}
              aria-label="Ler filtros"
              data-testid="read-filters-button"
            >
              Ler Filtros
            </button>
            <button
              type="button"
              className="nav-quick-button"
              onClick={readResults}
              aria-label="Ler resultados"
              data-testid="read-results-button"
            >
              Ler Resultados
            </button>
          </div>
        </div>

        <button
          type="button"
          className="control-button dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          aria-pressed={darkMode}
          data-testid="dark-mode-toggle"
        >
          {darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          <span className="visually-hidden">{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </div>

      <header className="accessibility-header" aria-labelledby="restaurant-title" data-testid="accessibility-header">
        <div className="header-content">
          <p className="header-kicker">Experiência otimizada para leitores de tela</p>
          <h1 id="restaurant-title" ref={titleRef} data-testid="restaurant-title">{pageTitle}</h1>
          <p id="restaurant-context">
            Use o teclado para navegar: Tab para avançar, Shift+Tab para voltar. Pressione Enter no botão "Adicionar ao pedido" para colocar o prato no carrinho.
          </p>
        </div>

        <nav className="accessibility-nav" aria-label="Navegação consistente do cardápio" data-testid="accessibility-nav">
          <button type="button" className="nav-button" tabIndex={0} aria-label="Voltar ao menu principal" data-testid="nav-main-button">
            Menu principal
          </button>
          <button type="button" className="nav-button" tabIndex={0} aria-label="Ver itens do carrinho" data-testid="nav-cart-button">
            Carrinho
          </button>
          <button type="button" className="nav-button" tabIndex={0} aria-label="Fechar conta" data-testid="nav-checkout-button">
            Fechar conta
          </button>
        </nav>
      </header>

      <main id="conteudo-principal" role="main" aria-live="polite" data-testid="main-content">
        <section className="filters-section-accessible" aria-labelledby="filtros-cardapio" ref={filtersRef} data-testid="filters-section">
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

        <section aria-live="polite" aria-atomic="true" className="results-info-accessible" ref={resultsRef} data-testid="results-section">
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
    </div>
  );
};

export default ProductListAccessibility;
