
import React from 'react';
import { motion } from 'framer-motion';
import { ModuleCardProps } from '../types';

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-8 rounded-2xl bg-slate-50 border border-slate-200 glow-border transition-all flex flex-col items-start gap-4 group"
    >
      <div className="p-3 rounded-lg bg-white border border-slate-100 shadow-sm text-cyan-600 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 flex-grow leading-relaxed">{description}</p>
      <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors inline-flex items-center gap-2 group-hover:gap-3 transition-all">
        Learn More <span>→</span>
      </button>
    </motion.div>
  );
};

export default ModuleCard;
