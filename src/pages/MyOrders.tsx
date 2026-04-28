import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../OrderContext';
import { motion } from 'motion/react';
import { Package, ChevronRight, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';
import { useAuth } from '../AuthContext';

const MyOrders = () => {
  const { orders } = useOrders();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const myOrders = orders.filter(o => o.userId === user?.uid);

  if (myOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-brand-accent/20 p-8 rounded-full">
            <Package size={64} className="text-brand-accent" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-brand-text">No orders yet</h1>
          <p className="text-brand-subtext max-w-md mx-auto">
            You haven't placed any orders yet. Start exploring our collection to find your signature scent.
          </p>
        </div>
        <Link
          to="/fragrances"
          className="inline-block bg-brand-button text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all"
        >
          Explore Fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
      <div className="mb-12 space-y-8">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors group"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-brand-accent/10 transition-colors">
            <ChevronRight className="rotate-180" size={18} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
        </Link>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">Account</p>
          <h1 className="text-5xl font-serif text-brand-text">My Orders</h1>
        </div>
      </div>

      <div className="space-y-8">
        {myOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-brand-accent/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="p-4 md:p-8 border-b border-brand-accent/10 bg-brand-bg/20 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center space-x-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Order Number</p>
                  <p className="text-lg font-serif text-brand-text">#{order.orderNumber}</p>
                </div>
                <div className="h-10 w-px bg-brand-accent/20 hidden sm:block"></div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-brand-accent/20 text-brand-text'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Total</p>
                  <p className="text-lg font-bold text-brand-text">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Items */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center space-x-2 text-brand-accent mb-4">
                  <Package size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Items ({order.items.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-0 md:space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center md:space-x-4 group">
                      <div className="w-full md:w-16 aspect-square md:aspect-[4/5] md:h-20 rounded-2xl md:rounded-xl overflow-hidden flex-shrink-0 bg-brand-bg/30 mb-2 md:mb-0 border border-brand-accent/5">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-110" 
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <div className="w-full h-full bg-brand-accent/10" />
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left w-full">
                        <h4 className="text-[10px] md:text-sm font-serif text-brand-text line-clamp-1">{item.name}</h4>
                        <div className="flex flex-col items-center md:items-start space-y-0.5">
                          <p className="text-[8px] md:text-[10px] text-brand-subtext font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="font-bold text-brand-text text-[10px] md:text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-brand-accent">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Order Date</span>
                  </div>
                  <p className="text-sm text-brand-text">{order.date}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-brand-accent">
                    <MapPin size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</span>
                  </div>
                  <div className="text-sm text-brand-text space-y-1">
                    <p className="font-bold">{order.address.name}</p>
                    <p className="text-brand-subtext">{order.address.street}</p>
                    <p className="text-brand-subtext">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
