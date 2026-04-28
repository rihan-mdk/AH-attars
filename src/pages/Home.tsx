import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BLOG_POSTS } from '../constants';
import { useProducts } from '../ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';

const Home = () => {
  const { products, loading } = useProducts();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredProducts = products.filter(p => p.featured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5);

  React.useEffect(() => {
    if (displayProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [displayProducts.length]);

  const currentHero = displayProducts[currentIndex];
  const displayFragrances = products.filter(p => p.category !== 'Apparel').slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
        <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-button rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError(null);

    try {
      // Check if already subscribed
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubscribed(true);
        setEmail('');
        return;
      }

      // Add new subscriber
      await addDoc(subscribersRef, {
        email: email.toLowerCase(),
        createdAt: serverTimestamp()
      });

      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 md:space-y-24 pb-12 md:pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-[90vh] flex items-center overflow-hidden pt-24 md:pt-0 pb-12 md:pb-0 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 z-10 text-center md:text-left order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-2">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
                  >
                    Featured {currentHero?.category === 'Apparel' ? 'Apparel' : 'Fragrance'}
                  </motion.p>
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif leading-[1.1] text-brand-text tracking-tight">
                    {currentHero?.name?.split(' ')[0] || 'AH'} <br />
                    <span className="italic">{currentHero?.name?.split(' ').slice(1).join(' ') || 'Signature'}</span>
                  </h1>
                </div>
                
                <p className="text-base md:text-lg text-brand-subtext max-w-md mx-auto md:mx-0 leading-relaxed h-20 md:h-24">
                  {currentHero?.description || "Experience the pinnacle of luxury with our curated collection of artisanal products."}
                </p>
                
                <div className="hidden md:flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
                  <Link
                    to={currentHero ? `/product/${currentHero.id}` : "/fragrances"}
                    className="inline-block bg-brand-button text-white px-10 py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-black transition-all hover:scale-105 shadow-xl"
                  >
                    Shop Collection
                  </Link>
                  <Link
                    to={currentHero?.category === 'Apparel' ? "/apparel" : "/fragrances"}
                    className="inline-block border border-brand-button/30 text-brand-button px-10 py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-brand-bg transition-all"
                  >
                    View All
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center space-y-8 order-1 md:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero?.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 1 }}
                className="relative h-full flex justify-center items-center"
              >
                <div className="absolute inset-0 bg-brand-accent/30 rounded-full blur-[120px] -z-10 transform scale-75 opacity-40 animate-pulse"></div>
                <img
                  src={currentHero?.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000"}
                  alt={currentHero?.name || "Featured Product"}
                  className="w-full max-w-[280px] md:max-w-md object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.15)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Buttons */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentHero?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 w-full max-w-[280px] md:hidden"
              >
                <Link
                  to={currentHero ? `/product/${currentHero.id}` : "/fragrances"}
                  className="w-full bg-brand-button text-white py-4 rounded-full text-xs font-bold tracking-widest uppercase text-center hover:bg-black transition-all shadow-xl"
                >
                  Shop Now
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {displayProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1 transition-all duration-500 rounded-full",
                idx === currentIndex ? "w-12 bg-brand-button" : "w-4 bg-brand-button/20"
              )}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">The Collection</p>
            <h2 className="text-4xl font-serif text-brand-text">Featured Fragrances</h2>
          </div>
          <Link to="/fragrances" className="text-sm font-medium tracking-widest uppercase flex items-center space-x-2 hover:text-brand-subtext transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayFragrances.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Section Split */}
      <section className="bg-brand-section py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">Our Philosophy</p>
            <h2 className="text-5xl font-serif text-brand-text leading-tight">Crafted with Intention, <br />Worn with Soul</h2>
            <p className="text-lg text-brand-subtext leading-relaxed">
              At AH attars, we believe a fragrance is more than just a scent—it's an extension of your identity. Each bottle is a result of months of meticulous blending, sourcing the finest botanicals from Grasse to the Himalayas.
            </p>
            <Link
              to="/about"
              className="inline-block border-b-2 border-brand-text pb-1 text-sm font-bold tracking-widest uppercase hover:text-brand-subtext hover:border-brand-subtext transition-all"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-brand-button rounded-[32px] md:rounded-[40px] overflow-hidden p-8 md:p-24 text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000"
              alt="Signature"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-serif leading-tight">The Signature <br />Collection</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Experience the pinnacle of our craft. Three limited edition scents that redefine luxury perfumery.
            </p>
            <Link
              to="/fragrances"
              className="inline-block bg-white text-brand-button px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-brand-accent transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Journal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">The Journal</p>
          <h2 className="text-4xl font-serif text-brand-text">Olfactory Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post) => (
            <motion.div key={post.id} whileHover={{ y: -5 }} className="group space-y-6">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs text-brand-subtext uppercase tracking-widest">{post.date}</p>
                <h3 className="text-xl font-serif text-brand-text group-hover:text-brand-subtext transition-colors">
                  <Link to="/journal">{post.title}</Link>
                </h3>
                <p className="text-sm text-brand-subtext leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-brand-accent/20 py-12 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-serif text-brand-text">Join the AH attars Circle</h2>
          <p className="text-brand-subtext leading-relaxed">
            Subscribe to receive updates on new launches, exclusive events, and olfactory insights.
          </p>
          
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl shadow-xl space-y-4 flex flex-col items-center"
            >
              <CheckCircle2 size={48} className="text-green-600" />
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-brand-text">Thank you for joining!</h3>
                <p className="text-brand-subtext">You've been successfully added to our circle.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-white border-none px-6 py-4 rounded-full focus:ring-2 focus:ring-brand-accent outline-none"
                  required
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-button text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50"
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
