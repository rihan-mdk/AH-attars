import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Truck, Calendar, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const orderData = location.state;

  // If no order data, redirect to home
  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const { items, total, address, orderNumber, date } = orderData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center space-y-6 mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-text">Thank You for Your Order</h1>
          <p className="text-brand-subtext text-lg">Your fragrance journey has begun. We've received your order and are preparing it with care.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-brand-section/30 p-8 rounded-[32px] border border-brand-accent/10 space-y-4">
          <div className="flex items-center space-x-3 text-brand-accent">
            <Package size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Order Number</span>
          </div>
          <p className="text-xl font-serif text-brand-text">#{orderNumber}</p>
        </div>

        <div className="bg-brand-section/30 p-8 rounded-[32px] border border-brand-accent/10 space-y-4">
          <div className="flex items-center space-x-3 text-brand-accent">
            <Calendar size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Order Date</span>
          </div>
          <p className="text-xl font-serif text-brand-text">{date}</p>
        </div>

        <div className="bg-brand-section/30 p-8 rounded-[32px] border border-brand-accent/10 space-y-4">
          <div className="flex items-center space-x-3 text-brand-accent">
            <Truck size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Estimated Delivery</span>
          </div>
          <p className="text-xl font-serif text-brand-text">3-5 Business Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="space-y-8">
          <h2 className="text-2xl font-serif text-brand-text">Order Summary</h2>
          <div className="space-y-6">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-brand-bg">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-brand-accent/10" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-brand-text">{item.name}</h4>
                  <p className="text-xs text-brand-subtext">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-brand-text">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-brand-accent/20 flex justify-between items-center">
            <span className="text-lg font-serif text-brand-text">Total Amount</span>
            <span className="text-2xl font-bold text-brand-text">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="space-y-8">
          <h2 className="text-2xl font-serif text-brand-text">Shipping Details</h2>
          <div className="bg-white p-8 rounded-[32px] border border-brand-accent/10 shadow-sm space-y-4">
            <div className="space-y-1">
              <p className="font-bold text-brand-text">{address.name}</p>
              <p className="text-brand-subtext">{address.street}</p>
              <p className="text-brand-subtext">{address.city}, {address.state} {address.zipCode}</p>
            </div>
            <div className="pt-4 border-t border-brand-accent/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">Shipping Method</p>
              <p className="text-sm text-brand-text mt-1">Standard Insured Shipping</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col space-y-4">
            <Link
              to="/fragrances"
              className="flex items-center justify-center space-x-2 bg-brand-button text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all shadow-lg"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/"
              className="text-center text-brand-subtext hover:text-brand-text text-sm font-bold uppercase tracking-widest transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
