import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC<{ onHomeClick?: () => void }> = ({ onHomeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      // Small timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onHomeClick) {
      onHomeClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-7xl mx-auto px-10 h-20 flex items-center justify-between rounded-full transition-all duration-300 ${isScrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}>
        <div
          className="text-2xl font-black tracking-tighter text-brand-primary cursor-pointer uppercase font-display"
          onClick={handleLogoClick}
        >
          Clarity
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
          <button onClick={() => scrollTo('benefits')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">Benefits</button>
          <button onClick={() => scrollTo('testimonials')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">Reviews</button>
          <Link to="/blog" className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">Journal</Link>
          <button onClick={() => scrollTo('faq')} className="text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer">FAQ</button>
          <button
            onClick={() => scrollTo('contact')}
            className="px-8 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-accent transition-all duration-300 shadow-xl shadow-brand-primary/20 cursor-pointer font-display"
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
