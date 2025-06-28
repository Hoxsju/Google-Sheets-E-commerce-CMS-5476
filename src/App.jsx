import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { SupabaseDataProvider } from './contexts/SupabaseDataContext';
import { SupabaseCartProvider } from './contexts/SupabaseCartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SupabaseNavbar from './components/layout/SupabaseNavbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import SupabaseLogin from './pages/SupabaseLogin';
import SupabaseRegister from './pages/SupabaseRegister';
import Admin from './pages/Admin';
import TestSignup from './pages/TestSignup';
import SupabaseProtectedRoute from './components/auth/SupabaseProtectedRoute';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <ThemeProvider>
      <SupabaseAuthProvider>
        <SupabaseDataProvider>
          <SupabaseCartProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <SupabaseNavbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route 
                      path="/checkout" 
                      element={
                        <SupabaseProtectedRoute>
                          <Checkout />
                        </SupabaseProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/account" 
                      element={
                        <SupabaseProtectedRoute>
                          <Account />
                        </SupabaseProtectedRoute>
                      } 
                    />
                    <Route path="/login" element={<SupabaseLogin />} />
                    <Route path="/register" element={<SupabaseRegister />} />
                    <Route 
                      path="/admin" 
                      element={
                        <SupabaseProtectedRoute adminOnly>
                          <Admin />
                        </SupabaseProtectedRoute>
                      } 
                    />
                    <Route path="/test-signup" element={<TestSignup />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </Router>
          </SupabaseCartProvider>
        </SupabaseDataProvider>
      </SupabaseAuthProvider>
    </ThemeProvider>
  );
}

export default App;