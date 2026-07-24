import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  Wheat,
  Droplet,
  Flame,
  UtensilsCrossed,
  Sparkle,
  Layers,
  User,
  Heart,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useStoreInfo } from '../../hooks/useStoreInfo';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';

export const StickyNavbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, themeSetting, toggleTheme, setThemeSetting } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { primaryPhone, secondaryPhone } = useStoreInfo();
  const { totalItems, totalAmount, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.categories'), path: '/categories' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
    { label: t('nav.admin'), path: '/admin' },
  ];

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nepaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchPopover(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'grains': return <Wheat className="w-5 h-5 text-amber-500" />;
      case 'oils': return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'pulses': return <Layers className="w-5 h-5 text-emerald-500" />;
      case 'spices': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'snacks': return <UtensilsCrossed className="w-5 h-5 text-sky-500" />;
      default: return <Sparkle className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B7A3D]/25 text-emerald-400 font-semibold text-[11px] border border-[#0B7A3D]/40">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{t('topbar.location')}</span>
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              {t('topbar.hours')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-white">
            <a href={`tel:${primaryPhone}`} className="text-[#FFC107] hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{primaryPhone}</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href={`tel:${secondaryPhone}`} className="text-[#FFC107] hover:underline">
              {secondaryPhone}
            </a>
            <span className="text-slate-600">•</span>
            <Link to="/admin" className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('nav.admin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-[#0B7A3D] flex items-center justify-center text-white shadow-md shadow-[#0B7A3D]/20 group-hover:scale-105 transition-transform duration-200">
                <BuildingStorefrontIcon className="w-6 h-6 text-[#FFC107]" />
              </div>
              <div>
                <span className="font-playfair text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#0B7A3D] dark:group-hover:text-emerald-400 transition-colors block leading-none">
                  {currentLang === 'ne' ? t('brand.nepaliName') : t('brand.name')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                  {t('brand.tagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchPopover(true);
                }}
                onFocus={() => setShowSearchPopover(true)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-10 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0B7A3D] transition-all shadow-inner placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Search Popover Results */}
            <AnimatePresence>
              {showSearchPopover && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-2 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('search.quickMatches')}
                  </div>
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setShowSearchPopover(false);
                        navigate(`/products?id=${prod.id}`);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {currentLang === 'ne' ? prod.nepaliName : prod.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {prod.unit}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-[#0B7A3D] dark:text-emerald-400">
                        रू {prod.price}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Controls: Language, Dark Mode, Cart Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/80 dark:border-slate-700"
              title="Switch Language / भाषा फेर्नुहोस्"
            >
              <Globe className="w-3.5 h-3.5 text-[#0B7A3D] dark:text-emerald-400" />
              <span>{currentLang === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Dark / Light / System Theme Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 text-xs transition-all border border-slate-200/80 dark:border-slate-700 flex items-center gap-1"
                title={`Theme: ${themeSetting.toUpperCase()} (${theme})`}
                aria-label="Toggle Theme Mode"
              >
                {themeSetting === 'system' ? (
                  <Monitor className="w-4 h-4 text-sky-500" />
                ) : theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    onMouseLeave={() => setThemeMenuOpen(false)}
                    className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 space-y-1 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setThemeSetting('light');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-all ${
                        themeSetting === 'light'
                          ? 'bg-[#0B7A3D] text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setThemeSetting('dark');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-all ${
                        themeSetting === 'dark'
                          ? 'bg-[#0B7A3D] text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setThemeSetting('system');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-all ${
                        themeSetting === 'system'
                          ? 'bg-[#0B7A3D] text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5 text-sky-400" />
                      <span>Auto System</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Link Button */}
            <Link
              to="/dashboard?tab=wishlist"
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs transition-all border border-slate-200/80 dark:border-slate-700"
              title="Saved Wishlist Items"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {user?.wishlist?.length ? (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                  {user.wishlist.length}
                </span>
              ) : null}
            </Link>

            {/* Customer Account Trigger & Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-emerald-200 dark:border-slate-700 text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                    alt={user?.fullName}
                    className="w-6 h-6 rounded-full object-cover border border-[#0B7A3D]"
                  />
                  <span className="hidden md:inline line-clamp-1 max-w-[90px]">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/80 dark:border-slate-700"
                >
                  <User className="w-3.5 h-3.5 text-[#0B7A3D] dark:text-emerald-400" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 space-y-1 text-xs"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <UserCheck className="w-4 h-4 text-[#0B7A3D]" />
                      <span>Customer Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Wishlist</span>
                    </Link>

                    {user?.role === 'admin' || user?.role === 'manager' ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 font-bold text-amber-700 dark:text-amber-400"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Admin Portal</span>
                      </Link>
                    ) : null}

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-rose-600 dark:text-rose-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-bold text-xs shadow-md shadow-[#0B7A3D]/20 transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFC107]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-emerald-200 font-semibold uppercase">
                  {totalItems === 0 ? t('nav.cart') : `${totalItems} Items`}
                </span>
                <span className="font-extrabold text-white text-xs">
                  रू {(totalAmount ?? 0).toLocaleString()}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Desktop Nav Bar & Mega Menu */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-6 relative">
            {/* Mega Menu Category Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                onMouseEnter={() => setMegaMenuOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A3D] dark:text-emerald-400 font-extrabold border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Menu className="w-4 h-4 text-[#0B7A3D] dark:text-emerald-400" />
                <span>{t('nav.megaMenu')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-[540px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 grid grid-cols-2 gap-3"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/categories?id=${cat.id}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                      >
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800 shrink-0">
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#0B7A3D] dark:group-hover:text-emerald-400 text-xs block">
                            {currentLang === 'ne' ? cat.nepaliName : cat.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal line-clamp-1">
                            {cat.itemCount} items available
                          </span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-[#0B7A3D] dark:hover:text-emerald-400 ${
                    isActive ? 'text-[#0B7A3D] dark:text-emerald-400 font-extrabold border-b-2 border-[#0B7A3D] dark:border-emerald-400 pb-1' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-normal">
            <span>{t('nav.wholesaleSupply')}:</span>
            <a href={`tel:${primaryPhone}`} className="font-bold text-[#0B7A3D] dark:text-emerald-400 hover:underline">
              +977 {primaryPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 shadow-lg"
          >
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-[#0B7A3D] dark:text-emerald-400 font-extrabold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={`tel:${primaryPhone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B7A3D] text-white font-bold text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store: +977 {primaryPhone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
