import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useCurrency, CurrencyCode } from '../CurrencyContext';
import { useAuth } from '../AuthContext';
import { cn } from '../lib/utils';

const Footer = () => {
  const { currency } = useCurrency();
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-brand-section pt-20 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif tracking-tighter text-brand-text">AH attars</h2>
            <p className="text-brand-subtext text-sm leading-relaxed">
              Crafting olfactory experiences that linger in the memory. Minimal, elegant, and timeless fragrances for the modern soul.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/ah_attars"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-text hover:text-brand-subtext transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/7259960812"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-text hover:text-brand-subtext transition-colors"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/apparel" className="text-brand-subtext text-sm hover:text-brand-text transition-colors font-medium">All Apparel</Link></li>
              <li><Link to="/fragrances" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">All Fragrances</Link></li>
              <li><Link to="/fragrances?category=Floral" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Floral Collection</Link></li>
              <li><Link to="/fragrances?category=Woody" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Woody Collection</Link></li>
              <li><Link to="/fragrances?category=Oriental" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Oriental Collection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Our Story</Link></li>
              <li><Link to="/journal" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Journal</Link></li>
              {isAdmin && (
                <li><Link to="/admin" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Admin Dashboard</Link></li>
              )}
              <li><Link to="/about#sustainability" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/support" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Support</Link></li>
              <li><Link to="/shipping" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-brand-subtext text-sm hover:text-brand-text transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-accent/30 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
<div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <p className="text-brand-subtext text-xs">© 2026 AH attars. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 grayscale opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 grayscale opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
