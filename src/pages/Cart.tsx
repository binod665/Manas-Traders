import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Check,
  AlertCircle,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { useCart, VALID_COUPONS } from '../context/CartContext';
import { useStoreInfo } from '../hooks/useStoreInfo';

export function Cart() {
  const {
    cart,
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

  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) setCouponInput('');
  };

  const handleQuickCoupon = (code: string) => {
    const result = applyCoupon(code);
    setCouponFeedback(result);
  };

  const orderItemsSummary = cart
    .map(
      (item) =>
        `• ${item.product?.name || 'Item'} (${item.product?.unit || 'unit'}) x${item.quantity} = रू ${((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}`
    )
    .join('%0A');

  const couponSummary = appliedCoupon ? `%0ACoupon: ${appliedCoupon.code} (-रू ${(discountAmount || 0).toLocaleString()})` : '';
  const shippingSummary = `%0AFulfillment: ${shippingOption === 'pickup' ? 'Store Pickup (Free)' : `Tikapur Delivery (रू ${shippingFee})`}`;

  const whatsappMessage = `Namaste Manas Traders! I would like to place a grocery order:%0A%0A${orderItemsSummary}%0A${couponSummary}${shippingSummary}%0A%0A*Subtotal:* रू ${(subtotal || 0).toLocaleString()}%0A*Discount:* -रू ${(discountAmount || 0).toLocaleString()}%0A*Delivery Fee:* रू ${shippingFee}%0A*Grand Total:* रू ${(grandTotal || 0).toLocaleString()}%0A%0A*Delivery Address:* Tikapur, Kailali, Nepal`;

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-[85vh]">
      <SEO
        title="Shopping Cart | Manas Traders Tikapur"
        description="Review your daily groceries, rice, oils, and pulses in cart. Place orders via phone or WhatsApp at Manas Traders in Tikapur, Kailali."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B7A3D] hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Catalog</span>
            </Link>
            <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-slate-900">
              Shopping Cart & Order Summary
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Entire Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart Screen */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 sm:p-20 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#0B7A3D]">
              <ShoppingBag className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="font-playfair text-2xl font-bold text-slate-900">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                You haven't added any items to your cart yet. Explore Jeera Masino fine rice, pure mustard oil, pulses, spices, and snacks from Manas Traders Tikapur.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                <span>Browse Grocery Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Table */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
                  <h2 className="font-bold text-base sm:text-lg font-playfair flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#FFC107]" />
                    Cart Items ({totalItems})
                  </h2>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Tikapur Market Stock
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100 p-4 sm:p-6">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#0B7A3D] bg-emerald-50 px-2 py-0.5 rounded-md">
                            {product.categoryName}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {product.nepaliName} • {product.unit}
                          </p>
                          <span className="text-xs font-bold text-slate-700 block">
                            Unit Price: रू {product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Controls & Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 rounded-xl bg-white text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-extrabold text-sm text-slate-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 rounded-xl bg-white text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-base font-extrabold text-[#0B7A3D] block">
                            रू {(product.price * quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="text-[11px] text-slate-400 hover:text-rose-600 underline transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Fulfillment Selector */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#0B7A3D]" />
                  Select Delivery or Store Pickup
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setShippingOption('pickup')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      shippingOption === 'pickup'
                        ? 'border-[#0B7A3D] bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        shippingOption === 'pickup' ? 'border-[#0B7A3D] bg-[#0B7A3D]' : 'border-slate-300'
                      }`}
                    >
                      {shippingOption === 'pickup' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Store Self Pickup (Free)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pick up directly from {storeInfo.address.fullAddress}. Ready in 30 mins.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setShippingOption('delivery')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      shippingOption === 'delivery'
                        ? 'border-[#0B7A3D] bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        shippingOption === 'delivery' ? 'border-[#0B7A3D] bg-[#0B7A3D]' : 'border-slate-300'
                      }`}
                    >
                      {shippingOption === 'delivery' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Tikapur Local Home Delivery
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Flat रू 50 fee. FREE delivery on orders above रू 2,000!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
                <h3 className="font-bold text-lg text-slate-900 font-playfair border-b border-slate-100 pb-3">
                  Order Cost Summary
                </h3>

                {/* Calculation Rows */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">रू {subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- रू {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment Fee</span>
                    {shippingFee === 0 ? (
                      <span className="font-bold text-emerald-700">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">रू {shippingFee}</span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Grand Total</span>
                    <span className="text-2xl font-extrabold text-[#0B7A3D]">
                      रू {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coupon Input Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-[#0B7A3D]" />
                      Apply Promo Coupon
                    </span>
                    {appliedCoupon && (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-[#0B7A3D]">
                      <div>
                        <span className="font-extrabold block">"{appliedCoupon.code}" Active</span>
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
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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

                  {!appliedCoupon && (
                    <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="text-slate-400 font-medium">Valid Coupons:</span>
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

                {/* Direct Order Actions */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/9779848500664?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FFC107]" />
                    <span>Send Order via WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${primaryPhone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-bold text-sm shadow-xs transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Store Direct ({primaryPhone})</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#0B7A3D]" />
                  <span>100% Guaranteed Fresh Local Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
