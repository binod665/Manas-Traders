import React from 'react';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export const CTASection: React.FC = () => {
  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();

  return (
    <section className="py-12 bg-[#0B7A3D] text-white my-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-[#FFC107] flex items-center justify-center mx-auto">
          <Phone className="w-6 h-6" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white">
          Need Fresh Groceries or Bulk Wholesale in Tikapur?
        </h2>

        <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Call <strong className="text-white">{storeInfo.name}</strong> today at <span className="text-[#FFC107] font-bold">{primaryPhone}</span> or <span className="text-[#FFC107] font-bold">{secondaryPhone}</span>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${primaryPhone}`}
            className="px-6 py-3.5 rounded-2xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call Direct Order</span>
          </a>

          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <span>Send Online Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-4 text-xs text-emerald-200 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-[#FFC107]" />
          <span>{storeInfo.address.fullAddress}</span>
        </div>
      </div>
    </section>
  );
};
