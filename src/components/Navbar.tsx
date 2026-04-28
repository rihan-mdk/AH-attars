import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart, User, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useAuth } from '../AuthContext';
import { useProducts } from '../ProductContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../constants';
import { useCurrency, CurrencyCode } from '../CurrencyContext';
import { ChevronDown, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSearchButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, profile, isAdmin } = useAuth();
  const { products } = useProducts();
  const { currency, setCurrency, allCurrencies } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (query.length > 0) {
      const filtered = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const categoryMatch = product.category.toLowerCase().includes(query);
        const descMatch = product.description?.toLowerCase().includes(query);
        const notesMatch = product.notes?.some(note => note.toLowerCase().includes(query));
        return nameMatch || categoryMatch || descMatch || notesMatch;
      }).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktopSearch = searchRef.current && !searchRef.current.contains(target) &&
        searchButtonRef.current && !searchButtonRef.current.contains(target);
      const isOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(target) &&
        mobileSearchButtonRef.current && !mobileSearchButtonRef.current.contains(target);

      if (isOutsideDesktopSearch && isOutsideMobileSearch) {
        setSuggestions([]);
        if (searchQuery === '') setShowSearch(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(target) &&
        mobileAccountMenuRef.current && !mobileAccountMenuRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(target)) {
        setIsNavMenuOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearchToggle = (isMobile: boolean = false) => {
    if (isMobile) {
      const newState = !showSearch;
      setShowSearch(newState);
      if (newState) setIsOpen(false); // Close mobile menu if opening search
    } else {
      if (!showSearch) {
        setShowSearch(true);
      } else if (searchQuery.trim() !== '' && suggestions.length > 0) {
        handleSuggestionClick(suggestions[0].id);
      } else {
        setShowSearch(false);
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].id);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSuggestions([]);
    setShowSearch(false);
  };

  const handleLinkHover = (path: string) => {
    if (location.pathname === path) return;
    clearHover();
    hoverTimeoutRef.current = setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const clearHover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fragrance', path: '/fragrances' },
    { name: 'Apparel', path: '/apparel' },
    { name: 'About Us', path: '/about' },
    { name: 'Journal', path: '/journal' },
  ];

  const accountLinks = [
    { name: 'Profile', path: '/profile' },
    { name: 'Orders', path: '/orders' },
    { name: 'Address', path: '/addresses' },
    { name: 'Wishlist', path: '/wishlist' },
  ].filter(link => !isAdmin || link.name !== 'Profile');

  const mobileLinks = user ? [...navigationLinks, ...accountLinks] : navigationLinks;
  const allLinks = [...navigationLinks, ...accountLinks];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#F5EFE6]/80 backdrop-blur-xl border-b border-[#D8C7B0]/30 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-[#F5EFE6] border-b border-[#D8C7B0]/20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "grid grid-cols-3 items-center transition-all duration-500",
            scrolled ? "h-16" : "h-20 sm:h-24 md:h-28"
          )}>
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden justify-start relative z-20">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (!isOpen) setShowSearch(false); // Close search if opening menu
                }}
                className="text-[#2C2C2C] hover:text-[#6F6A63] transition-colors p-2 -ml-2"
                aria-label="Open menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-start space-x-4 lg:space-x-6">
              <div
                className="relative"
                ref={navMenuRef}
                onMouseEnter={() => setIsNavMenuOpen(true)}
                onMouseLeave={() => setIsNavMenuOpen(false)}
              >
                <button
                  onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                  className="text-brand-text hover:text-brand-subtext transition-colors p-1"
                  aria-label="Account menu"
                >
                  <Menu size={20} />
                </button>
                <AnimatePresence>
                  {isNavMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-4 w-48 bg-white shadow-2xl rounded-2xl overflow-hidden border border-brand-accent/10 z-50"
                    >
                      <div className="p-2">
                        {user ? (
                          accountLinks.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsNavMenuOpen(false)}
                              className={cn(
                                "block px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-bg transition-colors rounded-xl",
                                location.pathname === link.path ? "text-brand-text font-bold" : "text-brand-text/70"
                              )}
                            >
                              {link.name}
                            </Link>
                          ))
                        ) : (
                          <Link
                            to="/login"
                            onClick={() => setIsNavMenuOpen(false)}
                            className="block px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-bg transition-colors rounded-xl text-brand-text/70"
                          >
                            Login
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => handleLinkHover(link.path)}
                  onMouseLeave={clearHover}
                  className={cn(
                    "text-[11px] uppercase tracking-widest hover:text-brand-subtext transition-colors whitespace-nowrap",
                    location.pathname === link.path ? "font-bold border-b border-brand-text" : "text-brand-text/70"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex justify-center items-center z-10 px-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tighter text-[#2C2C2C] whitespace-nowrap">AH attars</h1>
            </Link>

            {/* Desktop Navigation Right */}
            <div className="hidden md:flex items-center justify-end space-x-6 lg:space-x-8">
              {/* Search, Wishlist, Cart, Account */}
              <div className="relative flex items-center" ref={searchRef}>
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 160, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="mr-2 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full bg-transparent border-b border-brand-text/30 py-1 px-2 text-sm focus:outline-none focus:border-brand-text transition-colors"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  ref={searchButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchToggle(false);
                  }}
                  className="text-brand-text hover:text-brand-subtext transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-72 bg-white shadow-2xl rounded-2xl overflow-hidden border border-brand-accent/10 z-50"
                    >
                      <div className="p-2">
                        <p className="text-[10px] uppercase tracking-widest text-brand-text/40 px-3 py-2">Suggestions</p>
                        {suggestions.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product.id)}
                            className="w-full flex items-center space-x-4 p-3 hover:bg-brand-bg transition-colors rounded-xl text-left"
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-brand-accent/10 rounded-lg" />
                            )}
                            <div>
                              <p className="text-sm font-serif text-brand-text">{product.name}</p>
                              <p className="text-xs text-brand-text/50">{product.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/wishlist" className="relative text-brand-text hover:text-brand-subtext transition-colors" aria-label="Wishlist">
                <Heart size={20} className={wishlist.length > 0 ? "fill-brand-button text-brand-button" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-button text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-brand-text hover:text-brand-subtext transition-colors" aria-label="Cart">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-button text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Account Menu */}
              <div
                className="relative"
                ref={accountMenuRef}
                onMouseEnter={() => user && setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                {user ? (
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center space-x-2 text-[#2C2C2C] hover:text-[#6F6A63] transition-colors p-2"
                  >
                    <User size={20} />
                    <span className="text-xs uppercase tracking-widest hidden lg:inline-block max-w-[80px] lg:max-w-[120px] truncate">
                      {(profile?.displayName || user.displayName || user.email?.split('@')[0])?.split(' ')[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-[0.2em] font-medium text-[#2C2C2C] hover:text-[#6F6A63] transition-colors"
                  >
                    Login
                  </Link>
                )}

                <AnimatePresence>
                  {isAccountOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#D8C7B0]/20 z-50"
                    >
                      <div className="p-4 border-b border-[#D8C7B0]/10">
                        <p className="text-xs font-bold text-[#2C2C2C] truncate">{profile?.displayName || user.displayName}</p>
                        <p className="text-[10px] text-[#6F6A63] truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 text-xs text-[#2C2C2C] hover:bg-[#F5EFE6] rounded-lg transition-colors"
                          >
                            <Settings size={14} />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsAccountOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Switcher (Desktop) */}
              <div className="relative hidden lg:block" ref={currencyRef}>
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center space-x-1.5 text-[#2C2C2C] hover:text-[#6F6A63] transition-colors p-2 text-[10px] font-bold uppercase tracking-widest border border-brand-accent/20 rounded-full px-3"
                >
                  <span>{currency.code}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-300", isCurrencyOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isCurrencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#D8C7B0]/20 z-50"
                    >
                      <div className="p-1">
                        {allCurrencies.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              setCurrency(c.code as CurrencyCode);
                              setIsCurrencyOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors",
                              currency.code === c.code ? "bg-brand-accent/20 text-brand-text" : "text-brand-text/60 hover:bg-brand-bg"
                            )}
                          >
                            <span>{c.code}</span>
                            <span className="text-brand-subtext">{c.symbol}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-4 md:hidden relative z-20">
              <button
                ref={mobileSearchButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearchToggle(true);
                }}
                className="text-[#2C2C2C] p-1.5 transition-opacity hover:opacity-70"
                aria-label="Search"
              >
                {showSearch ? <X size={20} /> : <Search size={20} />}
              </button>
              <Link to="/wishlist" className="relative text-[#2C2C2C] p-1.5 transition-opacity hover:opacity-70" aria-label="Wishlist">
                <Heart size={20} className={wishlist.length > 0 ? "fill-brand-button text-brand-button" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-button text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-[#2C2C2C] p-1.5 transition-opacity hover:opacity-70" aria-label="Cart">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-button text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="relative" ref={mobileAccountMenuRef}>
                {user ? (
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="text-[#2C2C2C] p-1.5 transition-opacity hover:opacity-70"
                    aria-label="Account"
                  >
                    <User size={20} />
                  </button>
                ) : (
                  <Link to="/login" className="text-[#2C2C2C] p-1.5 transition-opacity hover:opacity-70" aria-label="Account">
                    <User size={20} />
                  </Link>
                )}

                <AnimatePresence>
                  {isAccountOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#D8C7B0]/20 z-50"
                    >
                      <div className="p-4 border-b border-[#D8C7B0]/10">
                        <p className="text-xs font-bold text-[#2C2C2C] truncate">{profile?.displayName || user.displayName}</p>
                        <p className="text-[10px] text-[#6F6A63] truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 text-xs text-[#2C2C2C] hover:bg-[#F5EFE6] rounded-lg transition-colors"
                          >
                            <Settings size={14} />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsAccountOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {showSearch && (
            <div className="md:hidden" ref={mobileSearchRef}>
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-full left-4 right-4 mt-4 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden border border-brand-accent/10 z-[60]"
              >
                <div className="p-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full bg-brand-bg/50 border border-brand-accent/10 rounded-2xl py-4 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-button/20 focus:bg-white transition-all"
                      autoFocus
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-subtext" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-subtext hover:text-brand-text"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {suggestions.length > 0 && (
                  <div className="px-3 pb-6 max-h-[60vh] overflow-y-auto">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-subtext font-bold px-4 mb-3">Top Matches</p>
                    <div className="space-y-1">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full flex items-center space-x-4 p-3 hover:bg-brand-bg transition-all rounded-2xl text-left group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-brand-accent/10" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-serif text-brand-text group-hover:text-brand-button transition-colors">{product.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">{product.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery && debouncedQuery === searchQuery && suggestions.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-brand-subtext italic">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </nav>

      {/* Mobile Menu Drawer - Moved outside <nav> to ensure correct fixed positioning */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#F5EFE6] z-[100] md:hidden shadow-2xl flex flex-col border-r border-[#D8C7B0]/20"
            >
              <div className="p-6 flex justify-between items-center border-b border-brand-accent/20 bg-[#F5EFE6] shrink-0">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-serif tracking-tighter text-[#2C2C2C]">AH attars</h2>
                  <div className="flex space-x-1">
                    {allCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code as CurrencyCode)}
                        className={cn(
                          "px-2 py-1 text-[9px] font-bold rounded-md border transition-all",
                          currency.code === c.code
                            ? "bg-brand-button text-white border-brand-button"
                            : "border-brand-accent/30 text-brand-text/50"
                        )}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#2C2C2C] hover:bg-brand-accent/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-16 px-12 min-h-0">
                <div className="flex flex-col space-y-8">
                  {mobileLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block text-[13px] font-serif tracking-[0.5px] uppercase transition-all duration-300 px-4 py-2",
                        location.pathname === link.path
                          ? "text-[#2C2C2C] font-semibold translate-x-2"
                          : "text-[#2C2C2C]/40 hover:text-[#2C2C2C] hover:translate-x-1"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Auth Links for Mobile */}
                  <div className="pt-8 border-t border-brand-accent/10 flex flex-col space-y-8">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block text-[13px] font-serif tracking-[0.5px] uppercase text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-all px-4 py-2"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user ? (
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="block text-left text-[13px] font-serif tracking-[0.5px] uppercase text-red-500/60 hover:text-red-500 transition-all px-4 py-2"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block text-[13px] font-serif tracking-[0.5px] uppercase text-[#2C2C2C] font-semibold px-4 py-2"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-brand-accent/20 bg-[#F5EFE6] shrink-0">
                <p className="text-[10px] text-brand-subtext text-center uppercase tracking-[0.2em]">
                  © 2026 AH attars
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
