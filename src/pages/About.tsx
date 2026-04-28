import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Mail, Instagram, MessageCircle, ArrowLeft } from 'lucide-react';

const About = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <div className="pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-widest font-bold">Back to Home</span>
        </Link>
      </div>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=2000"
            alt="About Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-bg/60"></div>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold">Est. 2024</p>
          <h1 className="text-6xl md:text-8xl font-serif text-brand-text tracking-tight">The AH attars Story</h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif text-brand-text leading-tight">A Vision of Olfactory <br />Purity</h2>
            <p className="text-lg text-brand-subtext leading-relaxed">
              AH attars was born from a simple desire: to strip away the noise of the commercial fragrance industry and return to the raw, evocative power of pure ingredients.
            </p>
            <p className="text-lg text-brand-subtext leading-relaxed">
              Our founder, a third-generation perfumer from Grasse, envisioned a brand that treated scent as a form of high art—minimalist in presentation, but maximalist in emotional impact.
            </p>
            <div className="pt-8 grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <p className="text-3xl font-serif text-brand-text">100%</p>
                <p className="text-xs uppercase tracking-widest text-brand-subtext font-bold">Natural Extracts</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-serif text-brand-text">Grasse</p>
                <p className="text-xs uppercase tracking-widest text-brand-subtext font-bold">Heritage Sourcing</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"
              alt="Founder"
              className="rounded-[40px] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-section py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-subtext font-bold">Our Values</p>
            <h2 className="text-4xl font-serif text-brand-text">The Pillars of AH attars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Sustainability', desc: 'From recycled glass to ethically harvested botanicals, we prioritize the planet in every decision.' },
              { title: 'Artisanship', desc: 'Every batch is hand-blended and matured for six weeks to ensure perfect olfactory balance.' },
              { title: 'Transparency', desc: 'We believe you should know exactly what you are wearing. No hidden chemicals, just pure essence.' }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/40 p-10 rounded-3xl text-center space-y-6"
              >
                <h3 className="text-2xl font-serif text-brand-text">{value.title}</h3>
                <p className="text-brand-subtext leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section (Merged from Contact page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-brand-accent/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-brand-text">Get in Touch</h2>
              <p className="text-lg text-brand-subtext leading-relaxed">
                Have a question about our fragrances or an order? Our team is here to help you find your perfect scent.
              </p>
            </div>

            <div className="space-y-6">
              <motion.div 
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start space-x-6 p-4 rounded-3xl transition-all hover:bg-white/40 hover:shadow-md group"
              >
                <div className="bg-brand-accent/20 p-4 rounded-2xl text-brand-text group-hover:bg-brand-button group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Our Studio</h4>
                  <p className="text-brand-subtext">12 Rue de la Paix, 75002 Paris, France</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start space-x-6 p-4 rounded-3xl transition-all hover:bg-white/40 hover:shadow-md group"
              >
                <div className="bg-brand-accent/20 p-4 rounded-2xl text-brand-text group-hover:bg-brand-button group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Call Us</h4>
                  <p className="text-brand-subtext">+33 (0) 1 23 45 67 89</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start space-x-6 p-4 rounded-3xl transition-all hover:bg-white/40 hover:shadow-md group"
              >
                <div className="bg-brand-accent/20 p-4 rounded-2xl text-brand-text group-hover:bg-brand-button group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Email Us</h4>
                  <p className="text-brand-subtext">concierge@ahattars.com</p>
                </div>
              </motion.div>
            </div>

            <div className="pt-12">
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Follow Our Journey</h4>
              <div className="flex space-x-6">
                <a href="#" className="flex items-center justify-center bg-brand-accent/20 p-4 rounded-2xl text-brand-text hover:bg-brand-button hover:text-white transition-all shadow-sm group">
                  <Instagram size={24} />
                </a>
                <a href="#" className="flex items-center justify-center bg-brand-accent/20 p-4 rounded-2xl text-brand-text hover:bg-brand-button hover:text-white transition-all shadow-sm group">
                  <MessageCircle size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-brand-section p-12 rounded-[40px] shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Full Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-white/50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-white/50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-white/50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full py-5 rounded-full text-sm font-bold tracking-widest uppercase flex items-center justify-center space-x-3 transition-all shadow-lg ${
                  submitted ? 'bg-green-600 text-white' : 'bg-brand-button text-white hover:bg-black hover:scale-[1.02]'
                }`}
              >
                {submitted ? (
                  <span>Message Sent</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
