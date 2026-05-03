import React from 'react';
import { motion } from 'motion/react';
import { Truck, RefreshCcw, ShieldCheck, Globe } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="pt-16 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
        >
          Policies
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-serif text-brand-text"
        >
          Shipping & Returns
        </motion.h1>
      </div>

      <div className="space-y-20">
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-accent/20 rounded-2xl text-brand-accent">
              <Truck size={28} />
            </div>
            <h2 className="text-3xl font-serif text-brand-text">Shipping Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[40px] bg-white/50 backdrop-blur-md border border-brand-accent/10 space-y-4">
              <h3 className="text-xl font-serif text-brand-text">Domestic (India)</h3>
              <p className="text-brand-subtext leading-relaxed">
                We offer complimentary standard shipping on all orders within India.
              </p>
              <ul className="space-y-2 text-sm text-brand-subtext list-disc list-inside">
                <li>Processing time: 1-2 business days</li>
                <li>Delivery time: 3-5 business days</li>
                <li>Tracking provided via email & SMS</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-[40px] bg-white/50 backdrop-blur-md border border-brand-accent/10 space-y-4">
              <div className="flex items-center space-x-2 text-brand-accent">
                <Globe size={20} />
                <h3 className="text-xl font-serif text-brand-text">International</h3>
              </div>
              <p className="text-brand-subtext leading-relaxed">
                Standard international shipping fee of $25 (USD). Free on orders over $250.
              </p>
              <ul className="space-y-2 text-sm text-brand-subtext list-disc list-inside">
                <li>Processing time: 2-3 business days</li>
                <li>Delivery time: 7-14 business days</li>
                <li>Duties & taxes may apply upon arrival</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-accent/20 rounded-2xl text-brand-accent">
              <RefreshCcw size={28} />
            </div>
            <h2 className="text-3xl font-serif text-brand-text">Return Policy</h2>
          </div>
          
          <div className="prose prose-brand max-w-none text-brand-subtext space-y-6">
            <p className="leading-relaxed">
              At AH attars, we strive for perfection in every bottle. However, due to the artisanal nature of our products and strict hygiene standards, our return policy is as follows:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-4">
                <h4 className="text-lg font-serif text-brand-text">What can be returned?</h4>
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>Sealed products in original cellophane packaging.</li>
                  <li>Items that arrived damaged during transit.</li>
                  <li>Incorrect items received.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-serif text-brand-text">What cannot be returned?</h4>
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>Opened or used fragrance bottles.</li>
                  <li>Discovery Set samples.</li>
                  <li>Items purchased during a final sale event.</li>
                </ul>
              </div>
            </div>
            <p className="p-6 bg-brand-section rounded-3xl text-sm italic">
              * Note: For damaged items, please provide photo evidence of the packaging and product within 24 hours of delivery to ahattars812@gmail.com.
            </p>
          </div>
        </section>

        <section className="p-12 rounded-[60px] bg-brand-button text-white">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-4xl font-serif">Safe & Secure Delivery</h2>
            <p className="text-white/70 leading-relaxed">
              Every AH attars fragrance is meticulously hand-packed in our custom-designed, shock-absorbent packaging to ensure your scent arrives in pristine condition. All shipments are fully insured against loss or damage.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
