import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors mb-12 group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs uppercase tracking-widest font-bold">Back</span>
    </button>
  );

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10 md:pb-20">
        <BackButton />
        <div className="text-center py-20 space-y-8">
          <div className="flex justify-center">
            <div className="bg-brand-accent/20 p-8 rounded-full">
              <Heart size={64} className="text-brand-accent" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-brand-text">Your wishlist is empty</h1>
            <p className="text-brand-subtext max-w-md mx-auto">
              Save your favorite fragrances here to keep track of what you love.
            </p>
          </div>
          <Link
            to="/fragrances"
            className="inline-block bg-brand-button text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all"
          >
            Explore Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10 md:pb-20">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif text-brand-text">My Wishlist</h1>
          <p className="text-brand-subtext text-lg">Fragrances you've saved for later.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-brand-subtext">
          <span>{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 pt-12 border-t border-brand-accent/20 text-center">
        <p className="text-brand-subtext mb-8 italic">Ready to make them yours?</p>
        <Link
          to="/cart"
          className="inline-flex items-center space-x-3 bg-brand-text text-white px-12 py-5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all shadow-xl"
        >
          <span>Go to Shopping Bag</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
