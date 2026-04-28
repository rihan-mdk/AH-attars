import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Heart, Star } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { useCurrency } from '../CurrencyContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    if (product) {
      setActiveImage(product.image);
    }
  }, [id, product]);

  useEffect(() => {
    if (!id) return;

    const reviewsRef = collection(db, 'products', id, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `products/${id}/reviews`);
    });

    return () => unsubscribe();
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-serif">Fragrance not found</h2>
        <Link to="/fragrances" className="text-brand-button underline">Return to Library</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !id) return;
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewsRef = collection(db, 'products', id, 'reviews');
      await addDoc(reviewsRef, {
        productId: id,
        userId: user.uid,
        userName: profile.displayName || user.email?.split('@')[0] || 'Anonymous',
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}/reviews`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isWishlisted = isInWishlist(product.id);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 md:py-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors mb-12"
      >
        <ArrowLeft size={18} />
        <span className="text-xs uppercase tracking-widest font-bold">Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square md:aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl bg-white flex items-center justify-center p-4 md:p-0"
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain md:object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-brand-accent/10 animate-pulse" />
            )}
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {(product.images && product.images.length > 0 ? product.images : [
              product.image,
              'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80&w=400',
              'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&q=80&w=400',
              'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=400'
            ]).map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-brand-button' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain md:object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-accent/10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">{product.category}</p>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-text leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <p className="text-3xl font-light text-brand-text">{formatPrice(product.price)}</p>
              {averageRating && (
                <div className="flex items-center space-x-1 bg-brand-accent/10 px-3 py-1 rounded-full">
                  <Star size={14} className="fill-brand-button text-brand-button" />
                  <span className="text-sm font-medium">{averageRating}</span>
                  <span className="text-xs text-brand-subtext">({reviews.length})</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">
              {product.category === 'Apparel' ? 'Product Details' : 'The Scent'}
            </h4>
            <p className="text-lg text-brand-subtext leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {product.material && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">Material</h4>
              <p className="text-brand-subtext font-medium">{product.material}</p>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">Available Sizes</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button 
                    key={size}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-brand-accent/30 hover:border-brand-button transition-colors text-sm font-bold"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.notes && product.notes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">Notes</h4>
              <div className="flex flex-wrap gap-3">
                {product.notes.map((note) => (
                  <span key={note} className="px-4 py-2 bg-brand-accent/20 rounded-full text-xs font-medium text-brand-text">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center justify-between sm:justify-start border border-brand-accent rounded-full px-6 py-3 sm:py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-brand-subtext transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-medium text-lg sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-brand-subtext transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${
                    added
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-button text-white hover:bg-black shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {added ? <Check size={20} /> : <ShoppingBag size={20} />}
                  <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-brand-button/10 border-brand-button text-brand-button'
                      : 'border-brand-accent text-brand-text hover:bg-brand-accent/10'
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={24} className={isWishlisted ? "fill-brand-button" : ""} />
                </button>
              </div>
            </div>

            <p className="text-xs text-brand-subtext text-center italic">
              Free shipping on all orders over {formatPrice(150)}.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 pt-20 border-t border-brand-accent/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Review Summary & Form */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-brand-text">Customer Reviews</h2>
              {averageRating ? (
                <div className="flex items-center space-x-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={star <= Math.round(Number(averageRating)) ? "fill-brand-button text-brand-button" : "text-brand-accent"}
                      />
                    ))}
                  </div>
                  <p className="text-lg font-medium">{averageRating} out of 5</p>
                </div>
              ) : (
                <p className="text-brand-subtext italic">No reviews yet. Be the first to share your thoughts.</p>
              )}
            </div>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-6 bg-brand-section p-8 rounded-3xl">
                <h3 className="text-xl font-serif text-brand-text">Write a Review</h3>
                
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-widest text-brand-text">Rating</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={star <= newRating ? "fill-brand-button text-brand-button" : "text-brand-accent/40"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="comment" className="text-sm font-bold uppercase tracking-widest text-brand-text block">
                    Your Experience
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent outline-none text-brand-text"
                    placeholder="Tell us about the scent, longevity, and how it makes you feel..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-brand-button text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all shadow-lg disabled:opacity-50"
                >
                  {submittingReview ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="bg-brand-section p-8 rounded-3xl text-center space-y-4">
                <p className="text-brand-subtext">Please sign in to share your experience.</p>
                <Link to="/login" className="inline-block bg-brand-button text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-black transition-all">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-12">
            {reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-brand-accent/20 pb-8 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex space-x-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating ? "fill-brand-button text-brand-button" : "text-brand-accent/30"}
                            />
                          ))}
                        </div>
                        <h4 className="font-bold text-brand-text">{review.userName}</h4>
                        <p className="text-xs text-brand-subtext">
                          {review.createdAt?.toDate().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-brand-subtext leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-brand-accent/20 rounded-[40px] p-12">
                <p className="text-brand-subtext italic">No reviews to display yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Placeholder */}
      <section className="mt-20 md:mt-32 pt-20 border-t border-brand-accent/30">
        <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-8 md:mb-12">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
            <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="aspect-square md:aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-white p-2 md:p-0">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand-accent/10" />
                )}
              </div>
              <h3 className="font-serif text-lg">{p.name}</h3>
              <p className="text-brand-subtext text-sm">{formatPrice(p.price)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
