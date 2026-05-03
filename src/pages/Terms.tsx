import React from 'react';
import { motion } from 'motion/react';
import { Scale, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const Terms = () => {
  return (
    <div className="pt-16 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
        >
          Agreement
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-serif text-brand-text"
        >
          Terms of Service
        </motion.h1>
      </div>

      <div className="prose prose-brand max-w-none space-y-12 text-brand-subtext">
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <Scale size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">1. Acceptance of Terms</h2>
          </div>
          <p className="leading-relaxed">
            By accessing and using the AH attars website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <CheckCircle2 size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">2. Product Authenticity</h2>
          </div>
          <p className="leading-relaxed">
            All AH attars products are guaranteed to be authentic artisanal creations. We maintain complete control over our sourcing and production to ensure the highest quality.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <AlertCircle size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">3. Usage & Safety</h2>
          </div>
          <p className="leading-relaxed">
            Our fragrances are for external use only. While we use high-quality ingredients, we recommend performing a patch test before full application. AH attars is not responsible for any allergic reactions or sensitivities.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-text">
            <Info size={24} className="text-brand-accent" />
            <h2 className="text-2xl font-serif m-0">4. Intellectual Property</h2>
          </div>
          <p className="leading-relaxed">
            All content on this site, including imagery, branding, and fragrance descriptions, is the property of AH attars and protected by international copyright laws. Unauthorized reproduction is strictly prohibited.
          </p>
        </section>

        <div className="p-8 rounded-3xl bg-brand-section border border-brand-accent/10">
          <p className="text-sm leading-relaxed italic">
            For further clarification on our business terms, please contact our legal department at <a href="mailto:ahattars812@gmail.com" className="text-brand-accent hover:underline">ahattars812@gmail.com</a>.
          </p>
        </div>

        <div className="pt-12 text-center text-xs tracking-widest uppercase font-bold text-brand-accent">
          Last Updated: April 29, 2026
        </div>
      </div>
    </div>
  );
};

export default Terms;
