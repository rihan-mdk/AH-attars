import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "What makes AH attars different from commercial perfumes?",
    answer: "Unlike mass-produced fragrances that rely heavily on synthetic boosters, AH attars focuses on pure, high-concentration oils (attars) and natural botanicals. We prioritize olfactory depth and skin-safe ingredients, creating scents that evolve uniquely on your skin over time."
  },
  {
    question: "How long do the fragrances typically last?",
    answer: "Because of our high oil concentration, our fragrances typically last between 8 to 12 hours on the skin. Base notes like Oud, Sandalwood, and Amber can often be detected even longer, up to 24 hours."
  },
  {
    question: "Are your products cruelty-free and vegan?",
    answer: "Yes, all AH attars products are 100% cruelty-free. We do not test on animals, and we do not use animal-derived ingredients like civet or musk deer. We use high-quality ethical alternatives for these notes."
  },
  {
    question: "Do you offer international shipping?",
    answer: "We currently ship to over 50 countries. Shipping times and costs vary by location. Please refer to our Shipping & Returns page for a full list of supported regions and estimated delivery times."
  },
  {
    question: "Can I return a fragrance if I don't like the scent?",
    answer: "Scent is deeply personal. While we cannot accept returns on opened full-sized bottles for hygiene reasons, we highly recommend purchasing our Discovery Set first. If a bottle is still sealed in its original cellophane, it can be returned within 14 days."
  },
  {
    question: "How should I store my fragrances?",
    answer: "To preserve the integrity of the natural oils, store your AH attars in a cool, dark place away from direct sunlight and extreme temperature fluctuations (like bathrooms). Keeping them in their original box is an excellent way to protect them."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="pt-16 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-brand-accent/20 p-4 rounded-full">
            <HelpCircle size={32} className="text-brand-accent" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
        >
          Concierge
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-serif text-brand-text"
        >
          Frequently Asked Questions
        </motion.h1>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="border border-brand-accent/20 rounded-3xl overflow-hidden bg-white/30 backdrop-blur-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-brand-accent/5 transition-colors"
            >
              <span className="text-lg font-serif text-brand-text pr-8">{faq.question}</span>
              <div className="shrink-0 text-brand-accent">
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="p-6 pt-0 text-brand-subtext leading-relaxed border-t border-brand-accent/10 mt-0">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 rounded-[40px] bg-brand-button text-white text-center space-y-6">
        <h2 className="text-3xl font-serif">Still have questions?</h2>
        <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
          Our concierge team is available to assist you with scent recommendations, order tracking, and more.
        </p>
        <button 
          onClick={() => window.location.href = 'mailto:ahattars812@gmail.com'}
          className="bg-white text-brand-button px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-all"
        >
          Contact Concierge
        </button>
      </div>
    </div>
  );
};

export default FAQ;
