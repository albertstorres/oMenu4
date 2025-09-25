import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AccessibilityProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/produtos" element={<ProductList />} />
                  </Routes>
                </main>
                <CartSidebar />
                <Toaster />
              </div>
            </CartProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;