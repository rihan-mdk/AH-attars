import React from 'react';
import { BLOG_POSTS } from '../constants';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Journal = () => {
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
        <div className="md:col-span-2 group cursor-pointer">
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
            className="group space-y-8"
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
              <Link to="#" className="inline-block border-b border-brand-text pb-1 text-xs font-bold tracking-widest uppercase hover:text-brand-subtext hover:border-brand-subtext transition-all">
                Read More
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-12">
        <button className="px-12 py-4 border border-brand-text rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-button hover:text-white transition-all">
          Load More Stories
        </button>
      </div>
    </div>
  );
};

export default Journal;
