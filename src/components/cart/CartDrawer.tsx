import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Phone,
  Tag,
  ShieldCheck,
  MapPin,
  Truck,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useCart, VALID_COUPONS } from '../../context/CartContext';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    discountAmount,
    shippingOption,
    setShippingOption,
    shippingFee,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { storeInfo, primaryPhone } = useStoreInfo();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleQuickCoupon = (code: string) => {
    const result = applyCoupon(code);
    setCouponFeedback(result);
  };

  // Generate prefilled order message for direct WhatsApp/Phone call
  const orderItemsSummary = cart
    .map(
      (item) =>
        `• ${item.product?.name || 'Item'} (${item.product?.unit || 'unit'}) x${item.quantity} = रू ${((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}`
    )
    .join('%0A');

  const couponSummary = appliedCoupon ? `%0ACoupon Applied: ${appliedCoupon.code} (-रू ${(discountAmount || 0).toLocaleString()})` : '';
  const shippingSummary = `%0ADelivery Method: ${shippingOption === 'pickup' ? 'Store Pickup (Free)' : `Tikapur Home Delivery (रू ${shippingFee})`}`;

  const whatsappMessage = `Namaste Manas Traders! I would like to place a grocery order:%0A%0A${orderItemsSummary}%0A${couponSummary}${shippingSummary}%0A%0A*Subtotal:* रू ${(subtotal || 0).toLocaleString()}%0A*Discount:* -रू ${(discountAmount || 0).toLocaleString()}%0A*Delivery Fee:* रू ${shippingFee}%0A*Grand Total:* रू ${(grandTotal || 0).toLocaleString()}%0A%0A*Delivery Location:* Tikapur, Kailali, Nepal`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B7A3D] flex items-center justify-center text-white shadow-sm">
                  <ShoppingBag className="w-5 h-5 text-[#FFC107]" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight font-playfair">Your Grocery Cart</h2>
                  <p className="text-xs text-emerald-400 font-medium">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in bag
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs font-bold text-[#FFC107] hover:underline px-2 py-1 bg-white/10 rounded-lg"
                >
                  Full View
                </Link>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Delivery/Pickup Option Switcher */}
            <div className="bg-slate-100 p-3 border-b border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Fulfillment Mode:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShippingOption('pickup')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    shippingOption === 'pickup'
                      ? 'bg-[#0B7A3D] text-white border-[#0B7A3D] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Store Pickup (FREE)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingOption('delivery')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    shippingOption === 'delivery'
                      ? 'bg-[#0B7A3D] text-white border-[#0B7A3D] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Tikapur Delivery</span>
                </button>
              </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                /* Empty Cart Screen */
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#0B7A3D]">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-lg">Your Grocery Bag is Empty</h3>
                    <p className="text-slate-500 text-xs max-w-xs mx-auto">
                      Explore fresh Jeera Masino rice, pure mustard oil, pulses, and snacks at Manas Traders in Tikapur.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/products"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-bold text-sm shadow-md transition-all"
                    >
                      <span>Explore Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3 divide-y divide-slate-100">
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {product.unit} • रू {product.price}
                          </p>
                          <span className="text-xs font-extrabold text-[#0B7A3D] block mt-0.5">
                            रू {(product.price * quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-extrabold text-xs">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Box */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[#0B7A3D]" />
                        Have a Promo / Coupon Code?
                      </span>
                      {appliedCoupon && (
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-[11px] text-rose-600 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {appliedCoupon ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-[#0B7A3D]">
                        <div>
                          <span className="font-extrabold block">"{appliedCoupon.code}" Applied!</span>
                          <span className="text-[11px] text-slate-600">{appliedCoupon.description}</span>
                        </div>
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="e.g. TIKAPUR10"
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {couponFeedback && !appliedCoupon && (
                      <p
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponFeedback.message}</span>
                      </p>
                    )}

                    {/* Quick Suggestions */}
                    {!appliedCoupon && (
                      <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                        <span className="text-slate-400 font-medium">Quick Codes:</span>
                        {Object.values(VALID_COUPONS).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleQuickCoupon(c.code)}
                            className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-bold hover:border-[#0B7A3D] hover:text-[#0B7A3D]"
                          >
                            {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer Summary & CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900">रू {subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- रू {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping / Fulfillment</span>
                    {shippingFee === 0 ? (
                      <span className="font-bold text-emerald-700">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">रू {shippingFee}</span>
                    )}
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-[#0B7A3D]">रू {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/9779848500664?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FFC107]" />
                    <span>Order via WhatsApp</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${primaryPhone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-bold text-xs transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Order</span>
                    </a>

                    <Link
                      to="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
                    >
                      <span>Detailed Checkout</span>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tikapur Local Guarantee
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-slate-400 hover:text-rose-600 underline"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
