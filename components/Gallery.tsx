
import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const DURATION = 0.4;

const galleryImages = [
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770092889/Screenshot_2026-02-03_at_12.14.47_PM_jywoj5.png",
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770092892/Screenshot_2026-02-03_at_12.15.10_PM_aqkehr.png",
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770092890/Screenshot_2026-02-03_at_12.17.18_PM_awgzls.png",
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770092889/Screenshot_2026-02-03_at_12.19.11_PM_zwxnem.png",
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770093061/Screenshot_2026-02-03_at_12.30.51_PM_drhhet.png",
  "https://res.cloudinary.com/dziptxu0l/image/upload/v1770092996/Screenshot_2026-02-03_at_12.29.45_PM_jk8qbn.png"
];

const GalleryCard: React.FC<{ image: string; index: number }> = ({ image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.8, 
        ease: EASE 
      }}
      whileHover={{ 
        y: -10,
        scale: 1.03,
        transition: { duration: DURATION, ease: EASE }
      }}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(34,211,238,0.3)] group-hover:border-cyan-400/40">
        
        {/* The Slide Image */}
        <img 
          src={image} 
          alt={`Curriculum Slide ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Animated Border Beam */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[border-beam_3s_linear_infinite]" 
               style={{ 
                 backgroundSize: '200% 100%',
                 mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                 maskComposite: 'exclude',
                 WebkitMaskComposite: 'destination-out',
                 padding: '2.5px'
               }}
          />
        </div>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      </div>

      <style>{`
        @keyframes border-beam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {galleryImages.map((image, i) => (
            <GalleryCard key={i} image={image} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
