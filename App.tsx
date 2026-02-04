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
import LeadMagnet from './components/LeadMagnet';
import Dashboard from './components/Dashboard';
import CurriculumPlanner from './components/CurriculumPlanner'; // New component
import AdminLogin from './components/AdminLogin';
import { supabase } from './lib/supabase';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import { Flag, Zap, Globe, Heart, MessageSquare, Shield, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

const Home = ({ setShowDashboard }: { setShowDashboard: (v: boolean) => void }) => {
  const navigate = useNavigate();
  return (
    <>
      <Navigation onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <Hero />
      <RegionalTicker />
      <Section id="benefits" className="py-32">
        <div className="text-center mb-32">
          <span className="text-[12px] font-bold tracking-[0.3em] text-brand-accent uppercase mb-6 block animate-fade-in">Global Content, Local Relevance</span>
          <h2 className="text-5xl md:text-7xl font-black text-brand-primary tracking-tighter font-display leading-tight">
            Regional Content <br />for Every Context.
          </h2>
        </div>
        <div className="space-y-12">
          <BenefitCard
            title="Pre-built for Your Country"
            description="We deliver English regionally relevant content globally. Our pre-built subscription packages ensure you meet local requirements with zero prep time."
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
            description="If you have unique cultural needs or specific pastoral challenges, we build custom modules that speak directly to your student body's experience and your specific ethos."
            image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
            tags={[
              { icon: <MessageSquare size={16} />, label: "Deep Customization" },
              { icon: <Heart size={16} />, label: "Bespoke Tone" },
              { icon: <Shield size={16} />, label: "Vetted Content" }
            ]}
          />
        </div>
      </Section>
      <Section id="sample" className="py-20">
        <div className="max-w-7xl mx-auto">
          <LeadMagnet />
        </div>
      </Section>
      <Gallery />
      <Pricing />
      <Section id="testimonials" className="bg-brand-primary/5 py-40">
        <div className="text-center mb-24">
          <span className="text-[12px] font-bold tracking-[0.3em] text-brand-accent uppercase mb-6 block">Validation</span>
          <h2 className="text-5xl md:text-7xl font-black text-brand-primary max-w-4xl mx-auto tracking-tighter font-display">Trusted Around the Globe.</h2>
        </div>
      </Section>
      <Section id="faq" centered className="py-40">
        <span className="text-[12px] font-bold tracking-[0.3em] text-brand-accent uppercase mb-6 block">Common Questions</span>
        <h2 className="text-5xl md:text-7xl font-black text-brand-primary mb-24 tracking-tighter font-display">Got Questions?</h2>
        <div className="max-w-4xl mx-auto space-y-16 text-left">
          {[
            { q: "Do you support content for non-English speakers?", a: "While we specialize in English regional relevant content, our modules are used globally in English-medium institutions worldwide." },
            { q: "How do subscriptions work?", a: "Pre-built packages are billed annually. You get instant access to our core library, including all regional updates for your selected territory." },
            { q: "What's the process for a Custom Order?", a: "Custom orders begin with a consultation call. We discuss your specific context, regional requirements, and branding before building your bespoke curriculum." }
          ].map((item, i) => (
            <div key={i} className="pb-16 border-b border-brand-primary/5 last:border-0 group cursor-pointer">
              <h4 className="text-3xl font-black text-brand-primary mb-6 font-display group-hover:text-brand-accent transition-colors">{item.q}</h4>
              <p className="text-xl text-brand-secondary leading-relaxed font-medium">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section id="contact" className="bg-brand-primary text-white py-48" centered>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter font-display">Get in touch.</h2>
          <p className="text-2xl md:text-3xl text-slate-400 mb-24 max-w-2xl mx-auto font-medium leading-relaxed">Let's start a conversation about your unique curriculum needs.</p>
          <ContactForm />
        </motion.div>
      </Section>
      <footer className="py-24 px-6 text-center border-t border-brand-primary/5 bg-white">
        <div className="text-2xl font-black tracking-tighter text-brand-primary uppercase mb-12 font-display">Clarity</div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <button onClick={() => navigate('/planner')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:opacity-70 transition-all cursor-pointer">
            <Layout size={14} /> Teacher Planner (Prototype)
          </button>
          <button onClick={() => setShowDashboard(true)} className="text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">
            Admin Dashboard
          </button>
        </div>
        <p className="text-brand-secondary text-sm font-bold tracking-widest uppercase mb-8">© Studio Clarity 2026. Supporting regional curriculum needs worldwide.</p>
      </footer>
    </>
  );
};

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            showDashboard ? (
              !session ? (
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminLogin onLogin={() => { }} onBack={() => setShowDashboard(false)} />
                </motion.div>
              ) : (
                <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Dashboard onBack={() => setShowDashboard(false)} />
                </motion.div>
              )
            ) : (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-brand-bg font-sans">
                <Home setShowDashboard={setShowDashboard} />
              </motion.div>
            )
          } />
          <Route path="/planner" element={
            <div className="min-h-screen bg-brand-bg md:p-6 lg:p-8">
              <div className="max-w-[1600px] mx-auto">
                <CurriculumPlanner />
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-all cursor-pointer"
                  >
                    ← Back to Website
                  </button>
                </div>
              </div>
            </div>
          } />
          <Route path="/blog" element={<><Navigation /><Blog /></>} />
          <Route path="/blog/:slug" element={<><Navigation /><BlogPost /></>} />
        </Routes>
      </AnimatePresence>
      <Analytics />
    </BrowserRouter>
  );
};

export default App;
// Build Trigger: Tue Feb  3 18:49:58 HKT 2026
