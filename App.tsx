import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import RegionalTicker from './components/RegionalTicker';
import Section from './components/Section';
import BenefitCard from './components/BenefitCard';
import TestimonialCard from './components/TestimonialCard';
import ContactForm from './components/ContactForm';
import Pricing from './components/Pricing';
import LogoTicker from './components/LogoTicker';
import Gallery from './components/Gallery';
import LeadMagnet from './components/LeadMagnet';
import Dashboard from './components/Dashboard';
import CurriculumPlanner from './components/CurriculumPlanner';
import DashboardConcepts from './components/DashboardConcepts';
import AdminLibrary from './components/AdminLibrary';
import AdminLogin from './components/AdminLogin';
import CoordinatorOnboarding from './components/CoordinatorOnboarding';
import ResetPassword from './components/ResetPassword';
import DashboardSidebar from './components/DashboardSidebar';
import { supabase } from './lib/supabase';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import { Flag, Zap, Globe, Heart, MessageSquare, Shield, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

// Shared layout: dark sidebar flush left + white content panel right
const DashboardLayout = ({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }) => (
  <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
    <DashboardSidebar />
    <main className={`flex-1 min-h-screen bg-white relative overflow-x-hidden rounded-l-[2rem] md:rounded-l-[3rem] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-brand-primary/10 ${fullWidth ? '' : 'p-6 md:p-12 lg:p-16'}`}>
      <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className={`relative z-10 h-full ${fullWidth ? '' : 'max-w-7xl mx-auto'}`}>
        {children}
      </div>
    </main>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <AdminLogin
      onLogin={() => navigate('/dashboard/planner')}
      onBack={() => navigate('/')}
      onGuest={() => navigate('/dashboard/planner')}
    />
  );
};

const Home = () => {
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
            Stop Teaching Generic <br />Start Teaching Context.
          </h2>
        </div>
        <div className="space-y-12">
          <BenefitCard
            title="Zero Prep. Total Relevance."
            description="Adapting generic UK PSHE frameworks for international students takes hours of prep time every week, and the content still often misses the cultural mark. Download a fully prepped, regionally aware PSHE lesson that you can teach tomorrow with zero prep."
            image="file:///Users/macbookpro/.gemini/antigravity/brain/08540563-a0b7-4aef-b914-a88477d89f30/curriculum_prebuilt_global_1770791675581.png"
            tags={[
              { icon: <Flag size={16} />, label: "Region-Specific" },
              { icon: <Zap size={16} />, label: "Zero Prep Time" },
              { icon: <Globe size={16} />, label: "Global Standards" }
            ]}
          />
          <BenefitCard
            reverse
            title="Not Just a Curriculum. A Regional Masterclass."
            description="If you have unique cultural needs or specific pastoral challenges, we build custom modules that speak directly to your student body's experience. Stop settling for basic resources; elevate your pastoral care."
            image="file:///Users/macbookpro/.gemini/antigravity/brain/08540563-a0b7-4aef-b914-a88477d89f30/curriculum_custom_bespoke_1770791693260.png"
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
      <Section id="testimonials" className="bg-white py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <span className="text-[12px] font-bold tracking-[0.3em] text-brand-accent uppercase mb-8 block">Validation</span>
            <h2 className="text-6xl md:text-8xl font-black text-brand-primary max-w-5xl mx-auto tracking-tighter font-display leading-[0.9]">
              PSHE curriculum solutions <br />
              <span className="text-brand-accent/40 italic">tailored for regional relevance</span>
            </h2>
          </div>

          <div className="mb-32">
            <LogoTicker />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                quote: "The regional adaptation for Hong Kong was seamless. It's the first time our students felt the PSHE content actually spoke to their local context and pressures.",
                author: "Sarah Chen",
                role: "Pastoral Lead, HK Global Academy"
              },
              {
                quote: "Finally, a curriculum that moves beyond generic advice. The UK statutory alignment combined with bespoke regional modules is a game-changer for our multi-campus schools.",
                author: "Dr. James Aris",
                role: "Head of Wellbeing, British International School"
              },
              {
                quote: "The interface is intuitive, but the content is the star. Our teachers save 10+ hours a week on planning because the regional relevance is already built-in.",
                author: "Elena Rodriguez",
                role: "Director of Curriculum, Madrid Educational Group"
              }
            ].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
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
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:opacity-70 transition-all cursor-pointer">
            <Layout size={14} /> Teacher Planner
          </button>
          <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">
            Admin Dashboard
          </button>
        </div>
        <p className="text-brand-secondary text-sm font-bold tracking-widest uppercase mb-8">© Studio Clarity 2026. Supporting regional curriculum needs worldwide.</p>
      </footer>
    </>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const RequireCoordinator = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();

  if (loading) return null; // Or a general loading spinner

  // If no profile yet or explicitly a teacher, force them to the planner
  if (profile?.role === 'teacher') {
    return <Navigate to="/dashboard/planner" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
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
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Sales Frontend */}
            <Route path="/" element={
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-brand-bg font-sans">
                <Home />
              </motion.div>
            } />

            {/* Auth */}
            <Route path="/login" element={
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoginPage />
              </motion.div>
            } />

            {/* Onboarding */}
            <Route path="/onboarding" element={
              <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CoordinatorOnboarding />
              </motion.div>
            } />

            {/* Password Reset */}
            <Route path="/reset-password" element={
              <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResetPassword />
              </motion.div>
            } />

            {/* Protected Dashboard */}
            <Route path="/dashboard" element={
              <RequireCoordinator>
                <DashboardLayout>
                  <Dashboard onBack={() => window.location.href = '/'} />
                </DashboardLayout>
              </RequireCoordinator>
            } />

            <Route path="/dashboard/planner" element={
              <RequireAuth>
                <DashboardLayout fullWidth>
                  <CurriculumPlanner />
                </DashboardLayout>
              </RequireAuth>
            } />

            {/* Design Explorer */}
            <Route path="/dashboard-concepts" element={
              <motion.div key="concepts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardConcepts />
              </motion.div>
            } />

            <Route path="/dashboard/library" element={
              <RequireCoordinator>
                <DashboardLayout>
                  <AdminLibrary />
                </DashboardLayout>
              </RequireCoordinator>
            } />

            <Route path="/blog" element={<><Navigation /><Blog /></>} />
            <Route path="/blog/:slug" element={<><Navigation /><BlogPost /></>} />
          </Routes>
        </AnimatePresence>
        <Analytics />
      </BrowserRouter >
    </AuthProvider>
  );
};

export default App;
// Build Trigger: Tue Feb  3 18:49:58 HKT 2026
