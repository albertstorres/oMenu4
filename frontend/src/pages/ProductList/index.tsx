import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockAPI } from '../../data/mock';
import { Search, Plus, Filter } from 'lucide-react';
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

const ProductList: React.FC = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const productsData = await mockAPI.getProducts();
      setProducts(productsData);
      
      // Extrair categorias únicas
      const uniqueCategories = Array.from(new Set(productsData.map((product: Product) => product.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = (product: Product): void => {
    if (product.available) {
      addItem(product, 1);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Entrada': 'bg-blue-100 text-blue-800',
      'Prato Principal': 'bg-green-100 text-green-800',
      'Sobremesa': 'bg-purple-100 text-purple-800',
      'Bebida': 'bg-orange-100 text-orange-800',
      'Acompanhamento': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="product-list-page">
        <div className="product-list-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Cardápio</h1>
          <p className="page-description">
            Explore nossos produtos e adicione ao carrinho
          </p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="category-filter">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="category-select">
                <Filter className="filter-icon" />
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto encontrado.</p>
              <p className="empty-state-subtitle">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <Badge className={`product-category ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </Badge>
                </div>
                
                <CardContent className="product-content">
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price-row">
                      <span className="product-price">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {!product.available && (
                        <Badge variant="destructive" className="unavailable-badge">
                          Indisponível
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.available}
                    className="add-to-cart-button"
                    size="sm"
                  >
                    <Plus className="add-icon" />
                    Adicionar
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            {filteredProducts.length} produto(s) encontrado(s)
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
