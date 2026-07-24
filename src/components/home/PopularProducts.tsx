import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

export const PopularProducts: React.FC = () => {
  const { t } = useTranslation();
  // Filter popular products or sort by rating/reviews
  const popular = PRODUCTS.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('products.popularTitle')}</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t('products.popularTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {t('products.popularSubtitle')}
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#0B7A3D] dark:text-emerald-400 hover:underline inline-flex items-center gap-1 group"
          >
            <span>{t('products.viewDetails')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popular.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
