
import React from 'react';
import { motion } from 'framer-motion';

const logos = ["Basis", "Illuminate", "NIX", "Linkup", "Vertex", "Summit"];

const LogoTicker: React.FC = () => {
  return (
    <div className="w-full py-12 border-t border-b border-slate-100 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <div key={logo} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900" />
              <span className="text-xl font-bold tracking-tight text-slate-900">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
