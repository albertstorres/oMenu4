import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { mockAPI } from '../data/mock';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Clock,
  ChefHat,
  Star
} from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const loadProducts = async () => {
    try {
      const data = await mockAPI.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await mockAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product, quantity = 1) => {
    addItem(product, quantity);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const ProductCard = ({ product }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <div onClick={() => setSelectedProduct(product)}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">Indisponível</Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </CardHeader>
      </div>
      
      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-orange-600">
              R$ {product.price.toFixed(2)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {product.preparationTime} min
            </div>
          </div>
          <Button
            onClick={() => handleAddToCart(product)}
            disabled={!product.available}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const ProductModal = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
      addItem(product, quantity);
      toast({
        title: "Produto adicionado!",
        description: `${quantity}x ${product.name} adicionado ao carrinho.`,
      });
      onClose();
    };

    return (
      <Dialog open={!!product} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{product?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src={product?.image} 
                alt={product?.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product?.category}
                </Badge>
                <p className="text-gray-600">
                  {product?.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Ingredientes:</h4>
                <div className="flex flex-wrap gap-2">
                  {product?.ingredients?.map((ingredient, index) => (
                    <Badge key={index} variant="outline">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {product?.preparationTime} min
                </div>
                <div className="flex items-center">
                  <ChefHat className="h-4 w-4 mr-1" />
                  Disponível
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {product?.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={!product?.available}
                >
                  Adicionar ao Carrinho - R$ {(product?.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nosso Cardápio
          </h1>
          <p className="text-gray-600">
            Descubra os sabores únicos do nosso restaurante
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar seus filtros ou buscar por outro termo
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </div>
  );
};

export default ProductList;