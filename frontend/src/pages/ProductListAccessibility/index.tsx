import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
// Importações de contexto fictícias substituídas por mocks simples para demonstrar o código
// import { useCart } from '../../contexts/CartContext';
// import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

// Estrutura de Produto (Interface/Tipo)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

// Dados de Mock (Simulação de API) - Mantidos consistentes com o design minimalista
const mockProducts: Product[] = [
    { id: '1', name: 'Salada Mediterrânea', description: 'Mix de folhas verdes, tomate cereja, pepino, azeitonas e queijo feta.', price: 35.00, image: 'https://placehold.co/1200x800/eeeeee/1a1a1a?text=Salada', category: 'Entradas', available: true },
    { id: '2', name: 'Sopa de Legumes Cremosa', description: 'Feita com abóbora cabotiá e um toque de gengibre. Vegan.', price: 28.00, image: 'https://placehold.co/1200x800/eeeeee/1a1a1a?text=Sopa', category: 'Entradas', available: true },
    { id: '3', name: 'Bife Ancho Premium', description: 'Corte especial de carne grelhado no ponto, servido com batatas rústicas.', price: 89.90, image: 'https://placehold.co/1200x800/eeeeee/1a1a1a?text=Bife', category: 'Pratos Principais', available: true },
    { id: '4', name: 'Lasanha à Bolonhesa', description: 'Massa fresca intercalada com molho de carne e bechamel.', price: 55.50, image: 'https://placehold.co/1200x800/eeeeee/1a1a1a?text=Lasanha', category: 'Pratos Principais', available: false },
    { id: '5', name: 'Torta Holandesa', description: 'Biscoito, creme e cobertura de chocolate meio amargo.', price: 22.00, image: 'https://placehold.co/1200x800/eeeeee/1a1a1a?text=Torta', category: 'Sobremesas', available: true },
];

const ProductListAccessibility: React.FC = () => {
  // Funções de Mock (Simulação de Contextos)
  const addItem = (product: Product, quantity: number) => console.log(`[Carrinho Fictício] Adicionado ${quantity}x ${product.name}`);
  const user = { name: "Cliente VIP" }; // Simulação de usuário autenticado

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  const pageTitle = user ? `Cardápio de ${user.name}` : 'Cardápio Digital Acessível';

  // Carrega os dados de mock
  const loadProducts = async (): Promise<void> => {
    // Simula o carregamento da API
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setProducts(mockProducts);
    const uniqueCategories = Array.from(new Set(mockProducts.map((product) => product.category)));
    setCategories(uniqueCategories);
    setLoading(false);
  };

  useEffect(() => {
    // 4. Robusto (Robust): Atributo lang="pt-BR"
    document.documentElement.setAttribute('lang', 'pt-BR'); 
    loadProducts();
  }, []);


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
      // Feedback audível para o leitor de tela (Usar um modal acessível ou aria-live region na vida real)
      // Nota: Em um ambiente real, 'alert' deve ser substituído por um modal acessível.
      alert(`Item ${product.name} adicionado ao pedido.`);
    }
  };

  // 2. Operável (Operable): Navegação por Teclado
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, product: Product): void => {
    // Permite que o usuário use Enter ou Espaço no CARD (role="article") para adicionar ao carrinho, 
    // replicando a função do botão para usuários de teclado que não usam o Tab
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // O leitor de tela pode focar no article, então a ação é disparada aqui
      handleAddToCart(product); 
    }
  };

  if (loading) {
    return (
      <div className="product-accessibility-page" role="application" aria-label="Modo acessível do cardápio">
        <div className="loading-state" role="status" aria-live="polite" aria-busy="true">
          <div className="loading-spinner" aria-hidden="true" />
          <p>Carregando cardápio acessível...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-accessibility-page" role="application" aria-label="Modo acessível do cardápio digital oMenu">
      {/* 2. Operável (Operable): Link para Pular Conteúdo */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <header className="accessibility-header" aria-labelledby="restaurant-title">
        <div className="header-content">
          <p className="header-kicker">Experiência otimizada para leitores de tela</p>
          {/* 2. Operável (Operable): Estrutura de Cabeçalhos (H1) */}
          <h1 id="restaurant-title">{pageTitle}</h1>
          <p id="restaurant-context">
            Use o teclado para navegar: Tab para avançar, Shift+Tab para voltar. Pressione Enter no botão "Adicionar ao
            pedido" para colocar o prato no carrinho.
          </p>
        </div>

        {/* 3. Compreensível (Understandable): Consistência de Navegação */}
        <nav className="accessibility-nav" aria-label="Navegação consistente do cardápio">
          <button type="button" className="nav-button" tabIndex={0} aria-label="Voltar ao menu principal">
            Menu principal
          </button>
          <button type="button" className="nav-button" tabIndex={0} aria-label="Ver itens do carrinho">
            Carrinho
          </button>
          <button type="button" className="nav-button" tabIndex={0} aria-label="Fechar conta">
            Fechar conta
          </button>
        </nav>
      </header>

      {/* 4. Robusto (Robust): Marcação Semântica (main) */}
      <main id="conteudo-principal" role="main" aria-live="polite">
        <section className="filters-section-accessible" aria-labelledby="filtros-cardapio">
          {/* 2. Operável (Operable): Estrutura de Cabeçalhos (H2) */}
          <h2 id="filtros-cardapio">Filtros do cardápio</h2>
          <p id="filters-instructions">
            Todos os campos têm rótulos. Informe o termo desejado ou escolha uma categoria para refinar os resultados.
          </p>
          <div className="filters-grid" aria-describedby="filters-instructions">
            
            <div className="filter-field">
              {/* 3. Compreensível (Understandable): Rótulos Explícitos (label for) */}
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
                  // 3.3.2 - Placeholder não é a única identificação
                  placeholder="Ex: Salada, Lasanha..." 
                />
              </div>
            </div>

            <div className="filter-field">
              {/* 3. Compreensível (Understandable): Rótulos Explícitos (label for) */}
              <label htmlFor="category-select">Filtrar por categoria</label>
              <div className="input-with-icon">
                <Filter aria-hidden="true" focusable="false" className="field-icon" />
                <select
                  id="category-select"
                  className="accessible-select"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  aria-describedby="filters-instructions"
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

        {/* Região ao vivo para anunciar resultados de filtro */}
        <section aria-live="polite" aria-atomic="true" className="results-info-accessible">
          <p id="resultado-contagem">
            {filteredProducts.length} prato(s) encontrados
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
          </p>
        </section>

        <section id="lista-categorias" className="categories-section">
          {filteredProducts.length === 0 && (
            <div className="empty-state" role="status" aria-live="assertive">
              <p>Nenhum prato foi localizado com os filtros informados.</p>
              <p className="empty-state-subtitle">Ajuste a busca ou escolha outra categoria.</p>
            </div>
          )}

          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category} className="category-group" aria-labelledby={`categoria-${category}`}>
              {/* 2. Operável (Operable): Estrutura de Cabeçalhos (H2) */}
              <h2 id={`categoria-${category}`}>{category}</h2>
              <div className="products-grid-accessible">
                {items.map((product) => {
                  const productDescriptionId = `descricao-${product.id}`;
                  const productPriceId = `preco-${product.id}`;
                  const productImageCaptionId = `imagem-${product.id}`;
                  return (
                    <article
                      key={product.id}
                      className="accessible-card"
                      role="article"
                      // 2. Operável (Operable) + 4. Robusto (Robust): Marcação Semântica e Associações ARIA
                      aria-labelledby={`prato-${product.id}`} 
                      aria-describedby={`${productImageCaptionId} ${productDescriptionId} ${productPriceId}`}
                      tabIndex={0} // Permite foco pelo teclado
                      onKeyDown={(event) => handleCardKeyDown(event, product)}
                      data-available={product.available}
                    >
                      <figure className="card-media">
                        <img
                          src={product.image}
                          // 1. Perceptível (Perceivable): Texto Alternativo (alt)
                          alt={`Fotografia em close do prato ${product.name}, categoria ${product.category}. ${product.description}. Apresentado por R$ ${product.price.toFixed(2)}.`}
                          loading="lazy"
                        />
                        <figcaption id={productImageCaptionId} className="visually-hidden">
                          {`Imagem do prato ${product.name}, categoria ${product.category}, ${product.available ? 'disponível' : 'indisponível'} por R$ ${product.price.toFixed(2)}. ${product.description}`}
                        </figcaption>
                      </figure>
                      <div className="card-body">
                        <p className="card-category" aria-label={`Categoria ${product.category}`}>
                          {product.category}
                        </p>
                        {/* 2. Operável (Operable): Estrutura de Cabeçalhos (H3) */}
                        <h3 id={`prato-${product.id}`}>{product.name}</h3>
                        <p id={productDescriptionId} className="card-description">
                          {product.description}
                        </p>
                        <p id={productPriceId} className="card-price">
                          R$ {product.price.toFixed(2)}
                        </p>
                        {!product.available && (
                          <p className="unavailable-text" role="status">
                            Indisponível no momento
                          </p>
                        )}
                        {/* 1. Perceptível (Perceivable): Botão nativo com ARIA e label claro */}
                        <button
                          type="button"
                          className="add-button"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.available}
                          aria-disabled={!product.available}
                          aria-label={`Adicionar ${product.name} ao pedido por R$ ${product.price.toFixed(2)}`}
                          tabIndex={product.available ? 0 : -1} // 2. Operável: Remove o foco do botão desabilitado
                        >
                          <Plus aria-hidden="true" focusable="false" className="button-icon" />
                          Adicionar ao pedido
                        </button>
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