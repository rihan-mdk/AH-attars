import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAddresses } from '../AddressContext';
import { useOrders } from '../OrderContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, MapPin, ChevronDown, Loader2, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';
import { useAuth } from '../AuthContext';
import { ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { addresses } = useAddresses();
  const { addOrder } = useOrders();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showAddressSelector, setShowAddressSelector] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  React.useEffect(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      setShippingAddress({
        name: defaultAddr.name,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zipCode: defaultAddr.zipCode
      });
    }
  }, [addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (!shippingAddress.name || !shippingAddress.street || !shippingAddress.city) {
      alert("Please provide a shipping address.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load Razorpay Script
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // 2. Razorpay Options (Configured for AH attars)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: totalPrice * 100, // in paise
        currency: "INR",
        name: "AH attars",
        description: "Secure Checkout",
        handler: function (response: any) {
          // Success handled in simulation step below
          console.log("Razorpay success:", response.razorpay_payment_id);
        }
      };

      // 3. Simulate Secure Redirection & Modal
      // In a real app, we would fetch 'order_id' from our backend and call new (window as any).Razorpay(options).open();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 4. Generate Order Data
      const orderNumber = Math.floor(Math.random() * 900000) + 100000;
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const orderData = {
        items: [...cart],
        total: totalPrice,
        address: shippingAddress,
        orderNumber,
        date
      };

      // 5. Save to Firestore (Simulating success from Razorpay Modal)
      await addOrder(orderData);

      // 6. Success Navigation
      navigate('/order-confirmation', { state: orderData });
      clearCart();
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue with the secure payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-20 pb-32 text-center space-y-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors mb-12"
        >
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-widest font-bold">Back to Home</span>
        </Link>
        <div className="flex justify-center">
          <div className="bg-brand-accent/20 p-8 rounded-full">
            <ShoppingBag size={64} className="text-brand-accent" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-brand-text">Your cart is empty</h1>
          <p className="text-brand-subtext max-w-md mx-auto">
            It seems you haven't added any fragrances to your collection yet.
          </p>
        </div>
        <Link
          to="/fragrances"
          className="inline-block bg-brand-button text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors mb-12"
      >
        <ArrowLeft size={18} />
        <span className="text-xs uppercase tracking-widest font-bold">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={`${item.id}-${item.selectedSize || 'no-size'}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center gap-8 bg-white/50 p-6 rounded-3xl shadow-sm"
              >
                <Link to={`/product/${item.id}`} className="w-32 h-40 flex-shrink-0 overflow-hidden rounded-xl bg-brand-bg">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-brand-accent/10" />
                  )}
                </Link>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-subtext font-bold">{item.category}</p>
                  <h3 className="text-xl font-serif text-brand-text">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                    {item.sizeLabel && <span className="text-sm ml-2 text-brand-subtext font-sans">({item.sizeLabel})</span>}
                  </h3>
                  <p className="text-lg font-medium text-brand-text">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-brand-accent rounded-full px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                      className="p-1 hover:text-brand-subtext transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                      className="p-1 hover:text-brand-subtext transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-brand-subtext hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-brand-section p-10 rounded-[40px] space-y-8 sticky top-32">
          <h2 className="text-2xl font-serif text-brand-text">Order Summary</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-brand-subtext">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-brand-subtext">
              <span>Shipping</span>
              <span className="italic">Calculated at checkout</span>
            </div>
            <div className="border-t border-brand-accent/30 pt-4 flex justify-between text-lg font-bold text-brand-text">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="space-y-4 pt-4 border-t border-brand-accent/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-serif text-brand-text">Shipping Address</h3>
              {addresses.length > 0 && (
                <button 
                  onClick={() => setShowAddressSelector(!showAddressSelector)}
                  className="text-[10px] font-bold uppercase tracking-widest text-brand-accent flex items-center space-x-1"
                >
                  <span>Change</span>
                  <ChevronDown size={12} className={cn("transition-transform", showAddressSelector && "rotate-180")} />
                </button>
              )}
            </div>

            {/* Address Selector Dropdown */}
            <AnimatePresence>
              {showAddressSelector && addresses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setShippingAddress({
                            name: addr.name,
                            street: addr.street,
                            city: addr.city,
                            state: addr.state,
                            zipCode: addr.zipCode
                          });
                          setShowAddressSelector(false);
                        }}
                        className="w-full text-left p-4 rounded-2xl border border-brand-accent/10 hover:border-brand-accent/30 bg-white/30 transition-all text-xs"
                      >
                        <p className="font-bold text-brand-text">{addr.name}</p>
                        <p className="text-brand-subtext">{addr.street}, {addr.city}</p>
                      </button>
                    ))}
                    <Link 
                      to="/addresses"
                      className="block text-center p-3 rounded-2xl border border-dashed border-brand-accent/30 text-[10px] font-bold uppercase tracking-widest text-brand-subtext hover:text-brand-text transition-all"
                    >
                      Manage Addresses
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {addresses.length === 0 ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-white/30 border border-brand-accent/10 space-y-2">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-brand-accent mt-1" />
                  <div>
                    <p className="text-sm font-bold text-brand-text">{shippingAddress.name}</p>
                    <p className="text-xs text-brand-subtext leading-relaxed">
                      {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className={cn(
              "w-full bg-brand-button text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 shadow-lg",
              isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Opening Razorpay...</span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span>Pay with UPI / Card</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-brand-subtext">
            <ShieldCheck size={14} className="text-green-600" />
            <p className="text-[10px] text-center uppercase tracking-widest font-bold">
              Secure Razorpay Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
