
import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import RegionalTicker from './components/RegionalTicker';
import Section from './components/Section';
import BenefitCard from './components/BenefitCard';
import TestimonialCard from './components/TestimonialCard';
import ContactForm from './components/ContactForm';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import { Sparkles, Shield, Zap, Globe, Heart, MessageSquare, Flag } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-cyan-100 selection:text-cyan-900">
      <Navigation />
      
      <Hero />
      
      <RegionalTicker />

      <Section id="benefits" className="py-24">
        <div className="text-center mb-24">
          <span className="text-[12px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">Global Content, Local Relevance</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Regional English Content <br/>for Every Context.</h2>
        </div>

        <BenefitCard 
          title="Pre-built for Your Country"
          description="We deliver English regionally relevant content for schools in the UK, Spain, America, Hong Kong, China, and Germany. Our pre-built subscription packages ensure you meet local requirements with zero prep time."
          image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
          tags={[
            { icon: <Flag size={16} />, label: "Region-Specific" },
            { icon: <Zap size={16} />, label: "Subscription-Ready" },
            { icon: <Globe size={16} />, label: "Global Standards" }
          ]}
        />

        <BenefitCard 
          reverse
          title="Custom Orders for Specific Cultures"
          description="If your school has unique cultural needs or specific pastoral challenges, we build custom modules that speak directly to your student body's experience and your school's ethos."
          image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
          tags={[
            { icon: <MessageSquare size={16} />, label: "Deep Customization" },
            { icon: <Heart size={16} />, label: "Bespoke Tone" },
            { icon: <Shield size={16} />, label: "Vetted Content" }
          ]}
        />
      </Section>

      <Gallery />

      <Pricing />

      <Section id="testimonials" className="bg-slate-50/50 py-32">
        <div className="text-center mb-20">
          <span className="text-[12px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">Validation</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 max-w-3xl mx-auto tracking-tight">Trusted Around the Globe.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <TestimonialCard 
            quote="The regional specificity of the UK package was perfect for our needs. It wasn't just generic content; it felt like it was made for our specific curriculum requirements."
            author="Valentina D'Efilippo"
            role="Head of Pastoral, UK Academy"
          />
          <TestimonialCard 
            quote="Implementing the custom module for our HK campus was seamless. Clarity managed to capture the cultural nuances of our students perfectly."
            author="Shawn Cao"
            role="Wellbeing Lead, International School HK"
          />
          <TestimonialCard 
            quote="Whether you are in Germany, China, or Spain, the quality of the English content remains world-class while being locally relevant. An essential subscription."
            author="Amos Ker"
            role="Director of Student Life"
          />
        </div>
      </Section>

      <Section id="faq" centered className="py-32">
        <span className="text-[12px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">Details</span>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-20 tracking-tight">Got Questions?</h2>
        
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          {[
            { q: "Do you support content for non-English speakers?", a: "While we specialize in English regional relevant content, our modules are used globally in English-medium international schools in Spain, Germany, China, and beyond." },
            { q: "How do subscriptions work?", a: "Pre-built packages are billed annually. You get instant access to our core library, including all regional updates for your selected territory." },
            { q: "What's the process for a Custom Order?", a: "Custom orders begin with a consultation call. We discuss your specific school context, regional requirements, and branding before building your bespoke curriculum." }
          ].map((item, i) => (
            <div key={i} className="pb-10 border-b border-slate-100 last:border-0">
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{item.q}</h4>
              <p className="text-lg text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" className="bg-slate-900 text-white py-40" centered>
        <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter">Get in touch today.</h2>
        <p className="text-2xl text-slate-400 mb-20 max-w-xl mx-auto font-medium leading-relaxed">Let's start a conversation about your school's unique curriculum needs.</p>
        <ContactForm />
      </Section>

      <footer className="py-16 px-6 text-center border-t border-slate-100">
        <div className="text-xl font-black tracking-tighter text-slate-900 uppercase mb-4">Clarity</div>
        <p className="text-slate-400 text-sm font-medium">© Studio Clarity 2026. Supporting schools in the UK, Spain, US, HK, China, and Germany.</p>
      </footer>
    </div>
  );
};

export default App;
