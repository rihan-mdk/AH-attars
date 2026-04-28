import React from 'react';
import { useOrders } from '../OrderContext';
import { useCurrency } from '../CurrencyContext';
import { motion } from 'motion/react';
import { Package, MapPin, Calendar, DollarSign, User, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { formatPrice } = useCurrency();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-brand-text">Order Management</h1>
          <p className="text-brand-subtext">View and manage customer fulfillment requests.</p>
        </div>
        <div className="bg-brand-accent/10 px-6 py-3 rounded-2xl border border-brand-accent/20">
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Total Orders: {orders.length}</span>
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center border border-brand-accent/10">
            <div className="flex justify-center mb-6">
              <div className="bg-brand-accent/10 p-6 rounded-full">
                <ShoppingBag size={48} className="text-brand-accent" />
              </div>
            </div>
            <h3 className="text-xl font-serif text-brand-text">No orders yet</h3>
            <p className="text-brand-subtext max-w-xs mx-auto mt-2">When customers start shopping, their orders will appear here.</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[40px] shadow-sm border border-brand-accent/10 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                {/* Header Info */}
                <div className="flex flex-wrap gap-8 items-center justify-between pb-8 border-b border-brand-accent/5">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-bg p-4 rounded-2xl">
                      <Package className="text-brand-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-subtext">Order Number</p>
                      <h3 className="text-lg font-serif text-brand-text">#{order.orderNumber}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-bg p-4 rounded-2xl">
                      <Calendar className="text-brand-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-subtext">Order Date</p>
                      <h3 className="text-lg font-serif text-brand-text">{order.date}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-bg p-4 rounded-2xl">
                      <DollarSign className="text-brand-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-subtext">Total Amount</p>
                      <h3 className="text-lg font-serif text-brand-text">{formatPrice(order.total)}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {['Processing', 'Shipped', 'Delivered'].map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusUpdate(order.id, status)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                          order.status === status
                            ? "bg-brand-button text-white shadow-md"
                            : "bg-brand-bg text-brand-subtext hover:bg-brand-accent/10"
                        )}
                      >
                        {updatingId === order.id && order.status !== status ? '...' : status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                  {/* Customer & Address */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-brand-accent">
                      <User size={18} />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Customer Details</h4>
                    </div>
                    <div className="bg-brand-bg/30 p-8 rounded-[32px] space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin size={20} className="text-brand-accent mt-1" />
                        <div className="space-y-1">
                          <p className="font-bold text-brand-text">{order.address?.name || 'Customer'}</p>
                          <p className="text-brand-subtext leading-relaxed">
                            {order.address?.street || 'No street provided'}<br />
                            {order.address?.city || ''}, {order.address?.state || ''} {order.address?.zipCode || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-brand-accent">
                      <ShoppingBag size={18} />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Order Items</h4>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-brand-bg/20 p-4 rounded-2xl border border-brand-accent/5">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-16 rounded-xl object-cover shadow-sm"
                          />
                          <div className="flex-1">
                            <h5 className="text-sm font-serif text-brand-text">{item.name}</h5>
                            <p className="text-xs text-brand-subtext">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-brand-text">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
