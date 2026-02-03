import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center overflow-hidden gradient-hero">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 text-brand-accent mb-12 animate-fade-in shadow-sm">
          <Shield size={16} />
          <span className="text-[12px] font-bold tracking-[0.2em] uppercase">Trusted around the world</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black leading-[0.9] tracking-tighter text-brand-primary mb-12 font-display">
          Global PSHE <br className="hidden md:block" />
          <span className="text-brand-accent">Excellence.</span>
        </h1>

        <p className="text-xl md:text-2xl text-brand-secondary mb-16 max-w-2xl leading-relaxed font-medium">
          Premium PSHE curriculum solutions tailored for regional relevance.
          Ready-to-teach modules for schools in the UK, HK, US, and beyond.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-24">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-6 bg-brand-accent text-white rounded-full font-bold uppercase tracking-widest text-[14px] cta-shadow hover:bg-brand-accent/90 transition-all duration-300 cursor-pointer font-display"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Packages
          </motion.button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[14px] font-bold uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary pb-1 cursor-pointer font-display"
          >
            Custom Module Inquiry
          </button>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-brand-primary/5 w-full max-w-2xl opacity-60">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={24} className="text-brand-accent" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-primary">Accredited Content</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield size={24} className="text-brand-accent" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-primary">Vetted Quality</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;