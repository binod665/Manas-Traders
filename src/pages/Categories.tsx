import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { CATEGORIES } from '../data/categories';
import { Check, ArrowRight, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Categories() {
  const navigate = useNavigate();
  const { setSelectedCategory } = useCart();

  const handleSelect = (catId: string) => {
    setSelectedCategory(catId);
    navigate(`/products?category=${catId}`);
  };

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-[85vh]">
      <SEO
        title="Grocery Categories | Manas Traders"
        description="Explore daily grocery categories at Manas Traders in Tikapur, Kailali, Nepal."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0B7A3D] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Full Store Taxonomy
          </span>
          <h1 className="font-playfair text-3xl font-bold text-slate-900">
            Grocery Categories at Manas Traders
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Select a category to view fresh rice, edible oils, pulses, tea, spices, dairy, and snacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-[#0B7A3D] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {cat.itemCount} Items
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0B7A3D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#0B7A3D] font-bold mb-3">
                  {cat.nepaliName}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Popular Items:
                  </span>
                  {cat.popularItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B7A3D]">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
