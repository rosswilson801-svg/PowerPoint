import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialProps } from '../types';

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-12 rounded-3xl bg-white border border-brand-primary/5 shadow-xl shadow-brand-primary/5 flex flex-col gap-8 card-hover"
    >
      <div className="text-brand-accent text-5xl font-display opacity-20">“</div>
      <p className="text-brand-secondary italic leading-relaxed text-lg font-medium">
        {quote}
      </p>
      <div className="mt-auto pt-8 border-t border-brand-primary/5">
        <div className="font-black text-brand-primary font-display uppercase tracking-wider">{author}</div>
        <div className="text-sm font-bold text-brand-accent/60 uppercase tracking-widest mt-1">{role}</div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
