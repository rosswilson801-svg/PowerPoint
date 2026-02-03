
import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = "", centered = false }) => {
  return (
    <section id={id} className={`py-20 px-6 lg:px-10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${centered ? 'text-center' : ''}`}
          >
            {title && <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-slate-500 max-w-2xl mx-auto">{subtitle}</p>}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;
