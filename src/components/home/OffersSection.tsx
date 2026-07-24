import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Tag, Phone, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export const OffersSection: React.FC = () => {
  const { primaryPhone, secondaryPhone } = useStoreInfo();

  return (
    <section className="py-12 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white my-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC107] text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Special Wholesale & Household Savings
            </span>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white leading-tight">
              Monthly Kitchen Grocery Combo & Wholesale Bulk Deals
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Save big on 25kg Rice Sacks, 5L Oil Jars, Wai Wai noodle cartons, and spice bundles. Order directly by calling Manas Traders in Tikapur.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFC107]" />
                <span>Zero hidden markup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Free store loading in Tikapur</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a href={`tel:${primaryPhone}`}>
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-extrabold text-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {primaryPhone}</span>
                </button>
              </a>

              <Link
                to="/contact"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Inquire Wholesale</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Highlights Banner */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
            <h3 className="font-bold text-lg text-white font-playfair border-b border-white/10 pb-2">
              Hot Deal Highlights
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                <div>
                  <span className="font-bold text-white block">Jeera Masino 25 Kg + 1L Oil</span>
                  <span className="text-slate-400">Monthly Household Saver Pack</span>
                </div>
                <span className="text-[#FFC107] font-extrabold text-sm">रू 2,380</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                <div>
                  <span className="font-bold text-white block">Wai Wai Cartoon (30 Pcs)</span>
                  <span className="text-slate-400">Wholesale Box Rate</span>
                </div>
                <span className="text-[#FFC107] font-extrabold text-sm">रू 600</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                <div>
                  <span className="font-bold text-white block">Mustard Oil 5L Jar</span>
                  <span className="text-slate-400">Cold Pressed Pure Oil</span>
                </div>
                <span className="text-[#FFC107] font-extrabold text-sm">रू 1,250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
