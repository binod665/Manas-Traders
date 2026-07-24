import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

export const FeaturedProducts: React.FC = () => {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="py-12 bg-slate-100/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0B7A3D] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tikapur Staples</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Grocery Essentials
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Popular household staples handpicked for Tikapur families and wholesale buyers.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#0B7A3D] hover:text-[#086130] inline-flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
