import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  type: 'percent' | 'flat' | 'shipping';
  value: number;
  description: string;
  minSubtotal?: number;
}

export const VALID_COUPONS: Record<string, AppliedCoupon> = {
  TIKAPUR10: {
    code: 'TIKAPUR10',
    type: 'percent',
    value: 10,
    description: '10% OFF on your entire order',
    minSubtotal: 500,
  },
  WELCOME50: {
    code: 'WELCOME50',
    type: 'flat',
    value: 50,
    description: 'Flat रू 50 OFF welcome coupon',
    minSubtotal: 300,
  },
  MANAS100: {
    code: 'MANAS100',
    type: 'flat',
    value: 100,
    description: 'Flat रू 100 OFF on orders above रू 1,000',
    minSubtotal: 1000,
  },
  FREEDEL: {
    code: 'FREEDEL',
    type: 'shipping',
    value: 50,
    description: 'Free Local Home Delivery in Tikapur',
    minSubtotal: 0,
  },
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalAmount: number;
  discountAmount: number;
  shippingOption: 'pickup' | 'delivery';
  setShippingOption: (option: 'pickup' | 'delivery') => void;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('manas_traders_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) => item && item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number'
      );
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shippingOption, setShippingOption] = useState<'pickup' | 'delivery'>('pickup');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('manas_traders_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('manas_traders_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('manas_traders_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('manas_traders_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product) => {
    if (!product || typeof product.price !== 'number') return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product?.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.product?.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = cart.reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 0)), 0);

  // Discount calculation logic
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.minSubtotal && subtotal < appliedCoupon.minSubtotal) {
      discountAmount = 0;
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * (appliedCoupon.value || 0)) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(appliedCoupon.value || 0, subtotal);
    }
  }

  // Shipping fee calculation
  let baseShipping = shippingOption === 'delivery' ? 50 : 0;
  if (shippingOption === 'delivery') {
    if (subtotal >= 2000 || (appliedCoupon && appliedCoupon.type === 'shipping')) {
      baseShipping = 0; // Free delivery over रू 2,000 or with FREEDEL coupon
    }
  }
  const shippingFee = baseShipping;

  // Grand Total calculation
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalAmount = grandTotal;

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[formattedCode];

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try TIKAPUR10, MANAS100, or WELCOME50' };
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return {
        success: false,
        message: `Coupon "${coupon.code}" requires minimum subtotal of रू ${coupon.minSubtotal.toLocaleString()}`,
      };
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Coupon "${coupon.code}" applied! ${coupon.description}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        totalAmount,
        discountAmount,
        shippingOption,
        setShippingOption,
        shippingFee,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
