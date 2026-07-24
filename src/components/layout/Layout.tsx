import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { StickyNavbar } from './StickyNavbar';
import { CartDrawer } from '../cart/CartDrawer';
import { Footer } from './Footer';

export function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#0B7A3D] selection:text-white">
        <StickyNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <CartDrawer />
        <Footer />
      </div>
    </CartProvider>
  );
}
