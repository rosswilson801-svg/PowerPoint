
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialProps } from '../types';

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
      className="p-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-6"
    >
      <div className="text-amber-500 text-4xl font-serif">“</div>
      <p className="text-slate-700 italic leading-relaxed text-lg">
        {quote}
      </p>
      <div className="mt-4">
        <div className="font-bold text-slate-900">{author}</div>
        <div className="text-sm text-slate-500">{role}</div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
