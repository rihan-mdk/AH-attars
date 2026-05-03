import React, { useState } from 'react';
import { useProducts } from '../ProductContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';

const Apparel = () => {
  const { products, loading } = useProducts();
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-button rounded-full animate-spin" />
      </div>
    );
  }

  const apparelProducts = (products || [])
    .filter(p => p && p.category === 'Apparel')
    .sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'featured') {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10 md:pb-20 space-y-12">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors mb-4"
      >
        <ArrowLeft size={18} />
        <span className="text-xs uppercase tracking-widest font-bold">Back to Home</span>
      </Link>
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-brand-text">The Apparel Studio</h1>
        <p className="text-brand-subtext max-w-2xl mx-auto leading-relaxed">
          Discover our curated collection of premium essentials, designed with the same commitment to quality and minimalist aesthetic as our fragrances.
        </p>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center border-y border-brand-accent/30 py-6 gap-6">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <SlidersHorizontal size={18} className="text-brand-subtext mr-2" />
          <span className="text-xs uppercase tracking-widest text-brand-text font-bold">New Arrivals</span>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <span className="text-xs uppercase tracking-widest text-brand-subtext font-bold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12"
      >
        {apparelProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {apparelProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-brand-subtext italic">New arrivals coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default Apparel;
