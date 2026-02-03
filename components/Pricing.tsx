import React from 'react';
import { motion } from 'framer-motion';
import { Check, PencilRuler, Zap } from 'lucide-react';

const PricingCard = ({ title, subtitle, features, badge, icon: Icon, ctaText, ctaOnClick, variant = "light" }: any) => (
  <motion.div
    whileHover={{ y: -8 }}
    className={`flex-1 p-10 md:p-14 rounded-[48px] border flex flex-col transition-all duration-500 ${variant === "dark"
        ? "bg-brand-primary border-brand-primary text-white shadow-2xl"
        : "bg-white border-brand-primary/5 text-brand-primary shadow-xl shadow-brand-primary/5 hover:shadow-2xl"
      }`}
  >
    <div className="flex justify-between items-start mb-10">
      <div className={`p-5 rounded-3xl ${variant === "dark" ? "bg-white/10 text-white" : "bg-brand-bg text-brand-accent focus:bg-brand-accent focus:text-white"}`}>
        <Icon size={32} />
      </div>
      {badge && (
        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${variant === "dark" ? "bg-brand-accent text-white" : "bg-brand-accent/10 text-brand-accent"
          }`}>
          {badge}
        </span>
      )}
    </div>

    <h4 className="text-4xl font-black tracking-tight mb-6 font-display uppercase">{title}</h4>
    <p className={`text-lg mb-12 font-medium leading-relaxed ${variant === "dark" ? "text-slate-400" : "text-brand-secondary"}`}>{subtitle}</p>

    <div className="space-y-6 mb-16 flex-grow">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-start gap-5">
          <div className="mt-1">
            <Check size={22} className={variant === "dark" ? "text-brand-accent" : "text-brand-accent"} />
          </div>
          <span className={`text-base font-bold ${variant === "dark" ? "text-slate-300" : "text-brand-secondary"}`}>{f}</span>
        </div>
      ))}
    </div>

    <button
      onClick={ctaOnClick}
      className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-[14px] transition-all duration-300 cta-shadow font-display focus:scale-95 ${variant === "dark"
          ? "bg-white text-brand-primary hover:bg-brand-accent hover:text-white"
          : "bg-brand-primary text-white hover:bg-brand-accent"
        }`}
    >
      {ctaText}
    </button>
  </motion.div>
);

const Pricing: React.FC = () => {
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="pricing" className="py-40 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-28">
          <span className="text-[12px] font-bold tracking-[0.4em] text-brand-accent uppercase mb-6 block">Choose Your Path</span>
          <h2 className="text-5xl md:text-8xl font-black text-brand-primary tracking-tighter mb-10 font-display">Subscription or <br className="hidden md:block" />Bespoke.</h2>
          <p className="text-2xl text-brand-secondary max-w-3xl mx-auto font-medium leading-relaxed">
            Select a ready-to-use regional package or partner with us for a custom curriculum built from the ground up.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          <PricingCard
            icon={Zap}
            title="Pre-built Packages"
            badge="Instant Access"
            subtitle="Subscription access to our full library of regional-specific courses. Best for immediate impact."
            ctaText="Start Subscription"
            ctaOnClick={scrollToContact}
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
            badge="Tailored Experience"
            subtitle="Designed exclusively for your unique regional identity and cultural requirements."
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
