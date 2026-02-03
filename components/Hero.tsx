
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-50/50 rounded-full blur-[160px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-5xl mx-auto"
      >
        <span className="text-[12px] font-bold tracking-[0.4em] text-slate-400 uppercase mb-10 inline-block py-1 border-b border-slate-200">
          Curriculum for International Schools
        </span>
        
        <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.95] tracking-tighter text-slate-900 mb-10">
          High-Impact PSHE <br className="hidden md:block" />
          <span className="text-slate-900">Done for you.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-2xl leading-relaxed font-medium">
          Choose between instant pre-built packages or bespoke custom designs. 
          Ready to teach and culturally responsive.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-6 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[14px] shadow-2xl hover:bg-slate-800 transition-colors"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See Packages
          </motion.button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[14px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1"
          >
            Custom Inquiry
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;