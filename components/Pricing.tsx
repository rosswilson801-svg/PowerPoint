
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, PencilRuler, Zap } from 'lucide-react';

const PricingCard = ({ title, price, subtitle, features, badge, icon: Icon, ctaText, ctaOnClick, variant = "light" }: any) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className={`flex-1 p-10 md:p-14 rounded-[48px] border flex flex-col transition-all duration-500 ${
      variant === "dark" 
      ? "bg-slate-900 border-slate-800 text-white shadow-2xl" 
      : "bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-2xl"
    }`}
  >
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-3xl ${variant === "dark" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}>
        <Icon size={28} />
      </div>
      {badge && (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          variant === "dark" ? "bg-cyan-500 text-slate-900" : "bg-cyan-100 text-cyan-700"
        }`}>
          {badge}
        </span>
      )}
    </div>

    <h4 className="text-3xl font-bold tracking-tight mb-2">{title}</h4>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-5xl font-black">{price}</span>
      {price.includes('$') && <span className={`${variant === "dark" ? "text-slate-400" : "text-slate-500"} font-medium ml-2 uppercase text-xs tracking-widest`}>/ Yearly Subscription</span>}
    </div>
    <p className={`text-lg mb-10 ${variant === "dark" ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
    
    <div className="space-y-5 mb-12 flex-grow">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-start gap-4">
          <div className="mt-1">
            <Check size={20} className={variant === "dark" ? "text-cyan-400" : "text-cyan-600"} />
          </div>
          <span className={`text-base font-medium ${variant === "dark" ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={ctaOnClick}
      className={`w-full py-6 rounded-3xl font-bold uppercase tracking-widest text-[13px] transition-all ${
        variant === "dark" 
        ? "bg-white text-slate-900 hover:bg-cyan-400" 
        : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {ctaText}
    </button>
  </motion.div>
);

const Pricing: React.FC = () => {
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="pricing" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[12px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-4 block">Choose Your Path</span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">Subscription or Bespoke.</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Select a ready-to-use regional package or partner with us for a custom curriculum built from the ground up.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          <PricingCard 
            icon={Zap}
            title="Pre-built Packages"
            price="$2,900"
            badge="Instant Access"
            subtitle="Subscription access to our full library of regional-specific courses. Best for immediate impact."
            ctaText="Start Subscription"
            ctaOnClick={() => {}}
            features={[
              "Access to 12+ Core PSHE Modules",
              "UK, US, & International Contexts",
              "Annual Regional Compliance Updates",
              "Full English Resource Portal",
              "Teacher Scripts & Lesson Plans",
              "Instant Digital Delivery"
            ]}
          />
          
          <PricingCard 
            variant="dark"
            icon={PencilRuler}
            title="Custom Orders"
            price="Bespoke"
            badge="Tailored Experience"
            subtitle="Designed exclusively for your school's unique regional identity and cultural requirements."
            ctaText="Request Custom Quote"
            ctaOnClick={scrollToContact}
            features={[
              "Custom Regional Content Mapping",
              "School-Specific Cultural Nuance",
              "White-labeled Visual Identity",
              "On-site/Remote Faculty Training",
              "Bespoke Case Study Development",
              "Exclusive Content Rights"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
