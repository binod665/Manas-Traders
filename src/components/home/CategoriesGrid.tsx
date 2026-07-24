import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CategoriesGrid: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useCart();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    navigate(`/products?category=${catId}`);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0B7A3D] mb-1">
            Browse By Category
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Explore Daily Grocery Categories
          </h2>
        </div>

        <Link
          to="/categories"
          className="text-xs font-bold text-[#0B7A3D] hover:text-[#086130] flex items-center gap-1 group"
        >
          <span>See All Categories</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Blinkit style Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCategoryClick(category.id)}
            className="cursor-pointer group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0B7A3D] hover:shadow-md transition-all duration-300"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-[#0B7A3D] transition-colors">
              {category.name}
            </h3>
            <span className="text-[10px] text-slate-500 font-medium block">
              {category.nepaliName}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
