
import React from 'react';

const Navigation: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
        <div 
          className="text-xl font-black tracking-tighter text-slate-900 cursor-pointer uppercase"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Clarity
        </div>
        
        <nav className="hidden md:flex items-center gap-12 text-[12px] font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollTo('benefits')} className="hover:text-slate-900 transition-colors">Benefits</button>
          <button onClick={() => scrollTo('testimonials')} className="hover:text-slate-900 transition-colors">Reviews</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-slate-900 transition-colors">FAQ</button>
          <button onClick={() => scrollTo('contact')} className="px-6 py-3 border border-slate-900 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white transition-all">Book a Call</button>
        </nav>

        <div className="md:hidden font-bold text-slate-900">Menu</div>
      </div>
    </header>
  );
};

export default Navigation;
