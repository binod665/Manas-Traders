import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Sparkles, Clock, ShoppingBag } from 'lucide-react';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export const HeroBanner: React.FC = () => {
  const { storeInfo, primaryPhone } = useStoreInfo();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'Fresh Daily Essentials in Tikapur',
      title: 'Jeera Masino, Pure Mustard Oil & Fresh Groceries',
      subtitle: 'Stock your kitchen with 100% authentic Nepalese staples. Sourced for Tikapur families and restaurants.',
      bgGradient: 'from-[#0B7A3D] via-teal-900 to-slate-900',
      ctaText: 'Shop Products',
      ctaLink: '/products',
      tagline: '100% Authentic Quality Guaranteed',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    },
    {
      id: 2,
      badge: 'Wholesale & Retail Supplier',
      title: 'Bulk Rice Bags, Oils & Spices at Wholesale Rates',
      subtitle: 'Special discounted tiers for hotels, hostels, and shopkeepers across Kailali district.',
      bgGradient: 'from-amber-900 via-slate-900 to-[#0B7A3D]',
      ctaText: 'Inquire Wholesale Rates',
      ctaLink: '/contact',
      tagline: 'Call 9848500664 for Fast Orders',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white my-4 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className={`relative bg-gradient-to-r ${slide.bgGradient} p-8 sm:p-12 lg:p-16 min-h-[420px] flex items-center`}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,193,7,0.15),transparent_50%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
            {/* Text left */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFC107] text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#FFC107]" />
                <span>{slide.badge}</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {slide.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={slide.ctaLink}
                  className="px-6 py-3.5 rounded-2xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${primaryPhone}`}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#FFC107]" />
                  <span>Call {primaryPhone}</span>
                </a>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-emerald-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#FFC107]" />
                <span>{slide.tagline}</span>
              </div>
            </div>

            {/* Image right */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl aspect-4/3">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                  <div className="flex justify-between text-slate-200">
                    <span className="font-semibold">{storeInfo.name}</span>
                    <span className="text-[#FFC107] font-bold">Tikapur Store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeSlide === idx ? 'bg-[#FFC107] w-6' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
