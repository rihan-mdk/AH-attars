import React, { useState } from 'react';
import { BLOG_POSTS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, Calendar, User, Share2 } from 'lucide-react';

const Journal = () => {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-20">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-xs uppercase tracking-widest font-bold">Back to Home</span>
      </Link>
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-6xl font-serif text-brand-text">The Journal</h1>
        <p className="text-brand-subtext text-lg leading-relaxed">
          Exploring the intersections of scent, memory, and art. A collection of stories from the world of AH attars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Featured Post */}
        <div 
          className="md:col-span-2 group cursor-pointer"
          onClick={() => setSelectedPost({
            id: 'featured',
            title: 'The Psychology of Scent: How Fragrance Shapes Our Identity',
            excerpt: 'Beyond mere pleasant aromas, fragrance acts as a powerful psychological tool that influences our mood, evokes deep-seated memories, and even projects our identity to the world.',
            content: "The sense of smell is the only sense directly wired to the limbic system, the area of the brain responsible for emotion and memory. This biological connection explains why a single whiff of a particular note—be it jasmine, sandalwood, or aged oud—can transport us back decades in an instant. At AH attars, we compose our fragrances with this emotional resonance in mind, crafting scents that don't just smell good, but feel like home, power, or tranquility.",
            image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1600',
            date: 'May 1, 2026'
          })}
        >
          <div className="relative aspect-[21/9] overflow-hidden rounded-[40px] mb-8 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1600"
              alt="Featured Post"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
              <p className="text-white/70 text-xs uppercase tracking-[0.3em] font-bold mb-4">Featured Story</p>
              <h2 className="text-white text-4xl md:text-5xl font-serif max-w-2xl leading-tight">The Psychology of Scent: How Fragrance Shapes Our Identity</h2>
            </div>
          </div>
        </div>

        {/* Regular Posts */}
        {BLOG_POSTS.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group space-y-8 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="aspect-[16/10] overflow-hidden rounded-3xl shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">{post.date}</span>
                <span className="w-8 h-[1px] bg-brand-accent"></span>
                <span className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Fragrance Culture</span>
              </div>
              <h3 className="text-3xl font-serif text-brand-text group-hover:text-brand-subtext transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-brand-subtext leading-relaxed">
                {post.excerpt}
              </p>
              <button className="inline-block border-b border-brand-text pb-1 text-xs font-bold tracking-widest uppercase hover:text-brand-subtext hover:border-brand-subtext transition-all">
                Read More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-xl"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-8 right-8 z-10 p-3 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative aspect-[21/9] w-full">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <h2 className="text-white text-3xl md:text-5xl font-serif leading-tight">{selectedPost.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-16 space-y-12">
                <div className="flex flex-wrap items-center gap-8 border-b border-brand-accent/20 pb-8 text-brand-subtext">
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">{selectedPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">AH attars Editorial</span>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Share2 size={18} className="cursor-pointer hover:text-brand-text transition-colors" />
                  </div>
                </div>

                <div className="prose prose-lg prose-brand max-w-none text-brand-text/80 leading-relaxed space-y-8">
                  <p className="text-2xl font-serif text-brand-text italic border-l-4 border-brand-accent pl-8">
                    {selectedPost.excerpt}
                  </p>
                  <div className="text-lg space-y-6">
                    {selectedPost.content || "Full article content coming soon to the AH attars digital library. We are currently curating the most evocative stories from our archives to share with our community of fragrance enthusiasts."}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default Journal;
