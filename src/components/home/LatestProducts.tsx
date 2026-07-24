import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

export const LatestProducts: React.FC = () => {
  const latest = PRODUCTS.filter((p) => p.isLatest || p.isOffer).slice(0, 4);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Fresh Stock Arrivals</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Latest Arrivals at Manas Traders
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Recently received fresh harvests, tea blends, dairy, and snack packs.
          </p>
        </div>

        <Link
          to="/products?filter=latest"
          className="text-xs font-bold text-[#0B7A3D] hover:text-[#086130] inline-flex items-center gap-1 group"
        >
          <span>Explore Latest</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latest.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
