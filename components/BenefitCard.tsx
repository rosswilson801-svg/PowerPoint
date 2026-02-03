
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingTagProps {
  icon: React.ReactNode;
  label: string;
  delay?: number;
}

const FloatingTag: React.FC<FloatingTagProps> = ({ icon, label, delay = 0 }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl border border-white/10"
  >
    <span className="text-cyan-400">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </motion.div>
);

interface BenefitCardProps {
  title: string;
  description: string;
  image: string;
  tags: { icon: React.ReactNode; label: string }[];
  reverse?: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, description, image, tags, reverse }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 py-16`}>
      <div className="flex-1 space-y-6">
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h3>
        <p className="text-lg text-slate-500 leading-relaxed max-w-md">{description}</p>
      </div>
      <div className="flex-1 relative w-full aspect-[4/3] rounded-[40px] overflow-hidden bg-slate-100 group">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {tags.map((tag, i) => (
            <FloatingTag key={i} {...tag} delay={0.2 + (i * 0.1)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;
