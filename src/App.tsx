import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { AddressProvider } from './AddressContext';
import { WishlistProvider } from './WishlistContext';
import { OrderProvider } from './OrderContext';
import { AuthProvider, useAuth } from './AuthContext';
import { CurrencyProvider } from './CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Fragrances from './pages/Fragrances';
import Apparel from './pages/Apparel';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Journal from './pages/Journal';
import About from './pages/About';
import MyAddresses from './pages/MyAddresses';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddScent from './pages/AdminAddScent';
import AdminManageScents from './pages/AdminManageScents';
import AdminOrders from './pages/AdminOrders';
import { AnimatePresence, motion } from 'motion/react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

// Scroll to top or to anchor on route change
const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);
  return null;
};
// Redirect to home on refresh
const RefreshHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always direct to Home page (hero page) after login/signup
    navigate('/', { replace: true });
  }, []);

  return null;
};


const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#D8C7B0] border-t-[#2C2C2C] rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        <PageWrapper>
          {children}
        </PageWrapper>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AddressProvider>
          <WishlistProvider>
            <OrderProvider>
              <CartProvider>
                <CurrencyProvider>
                <Router>
                  <ScrollToTop />
                  <RefreshHandler />

                  <Routes>
                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute adminOnly />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="add" element={<AdminAddScent />} />
                        <Route path="manage" element={<AdminManageScents />} />
                        <Route path="orders" element={<AdminOrders />} />
                      </Route>
                    </Route>

                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/fragrances" element={<PublicLayout><Fragrances /></PublicLayout>} />
                    <Route path="/apparel" element={<PublicLayout><Apparel /></PublicLayout>} />
                    <Route path="/product/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
                    <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
                    <Route path="/journal" element={<PublicLayout><Journal /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                    <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />
                    <Route path="/shipping" element={<PublicLayout><Shipping /></PublicLayout>} />
                    <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
                    <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
                    <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
                    
                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/addresses" element={<PublicLayout><MyAddresses /></PublicLayout>} />
                      <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
                      <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
                      <Route path="/orders" element={<PublicLayout><MyOrders /></PublicLayout>} />
                      <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
                    </Route>
                  </Routes>
                </Router>
                </CurrencyProvider>
              </CartProvider>
            </OrderProvider>
          </WishlistProvider>
        </AddressProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
