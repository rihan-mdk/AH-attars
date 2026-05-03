import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Support = () => {
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: `${formState.firstName} ${formState.lastName}`,
          email: formState.email,
          message: formState.message,
          subject: `Support Request from ${formState.firstName}`,
          from_name: "AH attars Support",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Support form submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.4em] text-brand-subtext font-bold"
        >
          Customer Service
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-serif text-brand-text"
        >
          How can we help?
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 rounded-[40px] bg-white/50 backdrop-blur-md border border-brand-accent/10 space-y-6 text-center"
        >
          <div className="inline-flex p-4 rounded-full bg-brand-accent/20 text-brand-accent mb-2">
            <Mail size={24} />
          </div>
          <h3 className="text-2xl font-serif text-brand-text">Email Us</h3>
          <p className="text-brand-subtext">For all inquiries, please reach out via email.</p>
          <a 
            href="mailto:ahattars812@gmail.com" 
            className="block text-brand-accent font-bold tracking-widest uppercase text-xs hover:underline"
          >
            ahattars812@gmail.com
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-10 rounded-[40px] bg-white/50 backdrop-blur-md border border-brand-accent/10 space-y-6 text-center"
        >
          <div className="inline-flex p-4 rounded-full bg-brand-accent/20 text-brand-accent mb-2">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-2xl font-serif text-brand-text">WhatsApp</h3>
          <p className="text-brand-subtext">Quick support via WhatsApp messaging.</p>
          <a 
            href="https://wa.me/7259960812" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-brand-accent font-bold tracking-widest uppercase text-xs hover:underline"
          >
            +91 7259960812
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-10 rounded-[40px] bg-white/50 backdrop-blur-md border border-brand-accent/10 space-y-6 text-center"
        >
          <div className="inline-flex p-4 rounded-full bg-brand-accent/20 text-brand-accent mb-2">
            <Clock size={24} />
          </div>
          <h3 className="text-2xl font-serif text-brand-text">Support Hours</h3>
          <p className="text-brand-subtext">We are here to assist you during these times.</p>
          <div className="text-xs font-bold tracking-widest uppercase text-brand-accent">
            Mon - Sat: 10AM - 8PM IST
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-brand-section p-12 rounded-[60px]">
        <div className="space-y-8">
          <h2 className="text-4xl font-serif text-brand-text">Contact Information</h2>
          <p className="text-brand-subtext leading-relaxed">
            Whether you need help selecting a fragrance or have questions about an existing order, our dedicated team is here to provide a personalized experience.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-brand-text">
              <MapPin size={20} className="text-brand-accent" />
              <span>Headquarters: Karnataka, India</span>
            </div>
            <div className="flex items-center space-x-4 text-brand-text">
              <Phone size={20} className="text-brand-accent" />
              <span>+91 7259960812</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/30 p-8 rounded-[40px] border border-brand-accent/10">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              required
              value={formState.firstName}
              onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
              placeholder="First Name" 
              className="bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
            />
            <input 
              type="text" 
              required
              value={formState.lastName}
              onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
              placeholder="Last Name" 
              className="bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
            />
          </div>
          <input 
            type="email" 
            required
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            placeholder="Email Address" 
            className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
          />
          <textarea 
            required
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            placeholder="How can we help?" 
            rows={4}
            className="w-full bg-white/50 border border-brand-accent/20 rounded-3xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all resize-none"
          ></textarea>
          <button 
            type="submit"
            disabled={submitting || submitted}
            className={cn(
              "w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2",
              submitted ? "bg-green-600 text-white" : "bg-brand-button text-white hover:bg-black",
              submitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {submitting ? (
              <span>Sending...</span>
            ) : submitted ? (
              <>
                <CheckCircle2 size={18} />
                <span>Message Sent</span>
              </>
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
  );
};

export default Support;
