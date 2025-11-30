import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
// TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - OrderProvider é temporário
// import { OrderProvider } from "./contexts/OrderContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductListAccessibility from "./pages/ProductListAccessibility";
import MeuPedido from "./pages/ProductListAccessibility/MeuPedido";

// Componente interno para acessar useLocation
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAccessibilityPage = location.pathname === '/acessibilidade';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/acessibilidade" element={<ProductListAccessibility />} />
          <Route path="/acessibilidade/meuPedidos" element={<MeuPedido />} />
        </Routes>
      </main>
      {/* Renderizar apenas o carrinho normal se NÃO estiver na página de acessibilidade */}
      {!isAccessibilityPage && <CartSidebar />}
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AccessibilityProvider>
          <AuthProvider>
            <CartProvider>
              {/* TODO: REMOVER QUANDO BACKEND FOR IMPLEMENTADO - OrderProvider é temporário */}
              {/* <OrderProvider> */}
                <AppContent />
              {/* </OrderProvider> */}
            </CartProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;