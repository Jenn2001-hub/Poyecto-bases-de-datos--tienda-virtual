import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Home from './components/Home';
import Categories from './components/Categories';
import CategoryProducts from './components/CategoryProducts';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import PasswordReset from './components/auth/PasswordReset';
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Loading from './components/shared/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <div className="flex-grow-1">
                <React.Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:categoryId" element={<CategoryProducts />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    
                    <Route element={<ProtectedRoute />}>
                      <Route path="/orders" element={<OrderList />} />
                      <Route path="/orders/:id" element={<OrderDetail />} />
                    </Route>
                    
                    <Route path="*" element={
                      <div className="container py-5 text-center">
                        <h1>404 - Página no encontrada</h1>
                      </div>
                    } />
                  </Routes>
                </React.Suspense>
              </div>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </NotificationProvider>
  );
}

export default App;