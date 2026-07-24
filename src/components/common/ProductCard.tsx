import React from 'react';
import { motion } from 'motion/react';
import { Star, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0B7A3D]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      <div>
        {/* Top Image area */}
        <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 bg-[#0B7A3D] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}

          {/* Discount Tag */}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="absolute top-2.5 right-2.5 bg-[#FFC107] text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              {product.discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Content area */}
        <div className="p-4 space-y-2">
          {/* Unit & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
              {product.unit}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Titles */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#0B7A3D] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {product.nepaliName}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-[#0B7A3D]">
              रू {(product.price ?? 0).toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                रू {product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">Tikapur Stock</span>
        </div>

        {/* Add/Quantity Buttons (Blinkit style) */}
        <div>
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="px-4 py-1.5 rounded-xl border-2 border-[#0B7A3D] text-[#0B7A3D] hover:bg-[#0B7A3D] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#0B7A3D] text-white rounded-xl px-2 py-1 shadow-xs font-bold text-xs gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="hover:bg-black/20 p-0.5 rounded transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[16px] text-center font-extrabold text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="hover:bg-black/20 p-0.5 rounded transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
