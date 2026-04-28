import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../constants';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion } from 'motion/react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white/50 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-lg md:rounded-xl aspect-[1/1] md:aspect-[4/5] bg-brand-bg/50 p-2 md:p-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-brand-accent/10" />
        )}
      </Link>

      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <span className="bg-brand-button text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
            Featured
          </span>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-all z-10"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} className={isWishlisted ? "fill-brand-button text-brand-button" : "text-brand-text"} />
      </button>

      <div className="mt-3 md:mt-6 space-y-1 md:space-y-2 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
          <div>
            <h3 className="text-sm md:text-lg font-serif text-brand-text group-hover:text-brand-subtext transition-colors line-clamp-1">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-[10px] md:text-xs text-brand-subtext uppercase tracking-widest">{product.category}</p>
          </div>
          <p className="text-sm md:text-lg font-medium text-brand-text">{formatPrice(product.price)}</p>
        </div>

        <p className="hidden md:block text-sm text-brand-subtext line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-2 md:mt-4 flex items-center justify-center space-x-2 bg-brand-button text-white py-2 md:py-3 rounded-lg text-[10px] md:text-sm font-medium tracking-widest uppercase hover:bg-black transition-colors"
        >
          <ShoppingBag size={14} className="md:w-4 md:h-4" />
          <span>Add</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
