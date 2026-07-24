import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { StoreInfo } from './pages/StoreInfo';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="categories" element={<Categories />} />
                <Route path="cart" element={<Cart />} />
                <Route path="about" element={<About />} />
                <Route path="store-info" element={<StoreInfo />} />
                <Route path="services" element={<Services />} />
                <Route path="contact" element={<Contact />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Standalone Auth & Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
