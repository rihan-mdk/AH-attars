import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, LogOut, Menu, X, Package, Home as HomeIcon, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';
import { useOrders } from '../OrderContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const { orders } = useOrders();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  useEffect(() => {
    if (orders.length === 0) return;
    const lastSeenTime = parseInt(localStorage.getItem('admin_last_seen_order_time') || '0');
    const newestOrderTime = orders[0].createdAt?.toDate ? orders[0].createdAt.toDate().getTime() : 0;
    
    if (newestOrderTime > lastSeenTime) {
      setHasNewOrders(true);
    }
  }, [orders]);

  const handleOrdersClick = () => {
    const newestOrderTime = orders[0]?.createdAt?.toDate ? orders[0].createdAt.toDate().getTime() : Date.now();
    localStorage.setItem('admin_last_seen_order_time', newestOrderTime.toString());
    setHasNewOrders(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: hasNewOrders },
    { name: 'Add Product', path: '/admin/add', icon: PlusCircle },
    { name: 'Manage Products', path: '/admin/manage', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-brand-section border-r border-brand-accent/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col p-8">
          <div className="mb-12">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-3xl font-serif tracking-tighter text-brand-text">AH attars</h1>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-brand-button text-white px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.name === 'Orders' ? handleOrdersClick : undefined}
                  className={cn(
                    "flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-white text-brand-text shadow-sm" 
                      : "text-brand-subtext hover:bg-white/50 hover:text-brand-text"
                  )}
                >
                  <item.icon size={20} className={cn(isActive ? "text-brand-text" : "text-brand-subtext group-hover:text-brand-text")} />
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                  {item.badge && (
                    <span className="absolute top-4 right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
            
            <button 
              onClick={handleBackToHome}
              className="w-full flex items-center space-x-4 px-6 py-4 text-brand-subtext hover:text-brand-text transition-colors"
            >
              <HomeIcon size={20} />
              <span className="text-sm font-medium tracking-wide">Back to Home</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 md:h-20 bg-brand-bg/80 backdrop-blur-md border-b border-brand-accent/20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-brand-text hover:bg-brand-section rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl md:text-2xl font-serif text-brand-text truncate max-w-[150px] md:max-w-none">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:block relative">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="bg-brand-section/50 border border-brand-accent/20 rounded-full px-6 py-2 text-sm focus:ring-2 focus:ring-brand-accent outline-none w-64 transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-accent/30 flex items-center justify-center text-brand-text font-serif font-bold uppercase">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
