import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="pt-16 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
        >
          Security
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-serif text-brand-text"
        >
          Privacy Policy
        </motion.h1>
      </div>

      <div className="prose prose-brand max-w-none space-y-12 text-brand-subtext">
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <Eye size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">Information Collection</h2>
          </div>
          <p className="leading-relaxed">
            We collect information you provide directly to us when you create an account, make a purchase, or communicate with our concierge team. This includes your name, email address, shipping address, and payment information.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <Lock size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">How We Use Your Data</h2>
          </div>
          <ul className="space-y-4 list-disc list-inside">
            <li>To process and fulfill your fragrance orders.</li>
            <li>To send you updates regarding your delivery status.</li>
            <li>To provide personalized scent recommendations based on your preferences.</li>
            <li>To protect against fraudulent transactions and ensure a secure shopping experience.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <Shield size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">Data Security</h2>
          </div>
          <p className="leading-relaxed">
            Your security is our priority. We implement industry-standard encryption (SSL) for all data transmissions. Payment processing is handled securely through Razorpay; we never store your full credit card or bank details on our servers.
          </p>
        </section>

        <section className="p-8 rounded-3xl bg-brand-section border border-brand-accent/10 space-y-4">
          <div className="flex items-center space-x-3 text-brand-text">
            <FileText size={20} className="text-brand-accent" />
            <h3 className="text-lg font-serif m-0">Cookies & Analytics</h3>
          </div>
          <p className="text-sm leading-relaxed">
            AH attars uses cookies to enhance your browsing experience, such as remembering your cart items and preferred currency. We also use minimal analytics to understand how our site is used so we can improve our digital atelier.
          </p>
        </section>

        <div className="pt-12 text-center text-xs tracking-widest uppercase font-bold text-brand-accent">
          Last Updated: April 29, 2026
        </div>
      </div>
    </div>
  );
};

export default Privacy;
