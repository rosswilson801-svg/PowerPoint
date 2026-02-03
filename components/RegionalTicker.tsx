
import React from 'react';
import { Globe } from 'lucide-react';

const regions = [
  { name: "United Kingdom", code: "UK" },
  { name: "Spain", code: "ES" },
  { name: "United States", code: "US" },
  { name: "Hong Kong", code: "HK" },
  { name: "China", code: "CN" },
  { name: "Germany", code: "DE" }
];

const RegionalTicker: React.FC = () => {
  return (
    <div className="w-full py-10 border-t border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 text-slate-400">
            <Globe size={20} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Regional Expertise</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {regions.map((region) => (
              <div key={region.code} className="group cursor-default">
                <span className="text-sm font-bold tracking-widest text-slate-300 group-hover:text-slate-900 transition-colors duration-300 uppercase">
                  {region.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalTicker;
