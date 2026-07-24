import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { Search, SlidersHorizontal, ShoppingBag, Database } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export function Products() {
  const { products, categories, loading, isFromSupabase } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [localSearch, setLocalSearch] = useState<string>(searchParam);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.categoryId === activeCategory;
      const matchesSearch =
        !localSearch.trim() ||
        product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        product.nepaliName.toLowerCase().includes(localSearch.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(localSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeCategory, localSearch, sortBy]);

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <SEO
        title="Products Catalog | Manas Traders"
        description="Browse fresh groceries, rice bags, mustard oil, pulses, and snacks at Manas Traders in Tikapur, Kailali, Nepal."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0B7A3D] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Tikapur Store Catalog
                </span>
                {isFromSupabase && (
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 flex items-center gap-1">
                    <Database className="w-3 h-3 text-sky-600" />
                    Supabase Connected
                  </span>
                )}
              </div>
              <h1 className="font-playfair text-3xl font-bold text-slate-900 mt-2">
                All Grocery & Wholesale Products
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Showing {filteredProducts.length} items available at Manas Traders
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter by name or item..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchParams({});
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#0B7A3D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchParams({ category: cat.id });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0B7A3D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & Controls bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-white px-4 py-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0B7A3D]" />
            <span>Sort Products:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs font-bold text-slate-800"
          >
            <option value="default">Default Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-slate-200 rounded-3xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No matching products found</h3>
            <p className="text-slate-500 text-xs">
              Try adjusting your search query or choosing another category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setLocalSearch('');
                setSearchParams({});
              }}
              className="mt-2 px-4 py-2 bg-[#0B7A3D] text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
