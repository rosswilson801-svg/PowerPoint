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
    className="bg-brand-primary/90 backdrop-blur-md text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-xl border border-white/10"
  >
    <span className="text-brand-accent">{icon}</span>
    <span className="text-sm font-bold tracking-wide uppercase">{label}</span>
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
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 py-20`}>
      <div className="flex-1 space-y-8">
        <h3 className="text-4xl md:text-5xl font-black text-brand-primary font-display leading-[1.1] tracking-tight">{title}</h3>
        <p className="text-lg text-brand-secondary leading-relaxed max-w-xl font-medium">{description}</p>
      </div>
      <div className="flex-1 relative w-full aspect-[4/3] rounded-[48px] overflow-hidden bg-brand-bg group card-hover shadow-2xl shadow-brand-primary/5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          {tags.map((tag, i) => (
            <FloatingTag key={i} {...tag} delay={0.3 + (i * 0.1)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;
