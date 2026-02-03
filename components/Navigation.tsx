import React, { useEffect, useState } from 'react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-7xl mx-auto px-6 h-16 flex items-center justify-between rounded-full transition-all duration-300 ${isScrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}>
        <div
          className="text-2xl font-black tracking-tighter text-brand-primary cursor-pointer uppercase font-display"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Clarity
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-widest">
          <button onClick={() => scrollTo('benefits')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">Benefits</button>
          <button onClick={() => scrollTo('testimonials')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">Reviews</button>
          <button onClick={() => scrollTo('faq')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">FAQ</button>
          <button
            onClick={() => scrollTo('contact')}
            className="px-6 py-2 bg-brand-accent text-white rounded-full hover:scale-105 transition-all duration-300 cta-shadow cursor-pointer font-display"
          >
            Get Started
          </button>
        </nav>

        <div className="md:hidden font-bold text-brand-primary cursor-pointer px-4">Menu</div>
      </div>
    </header>
  );
};

export default Navigation;
