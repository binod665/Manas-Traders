import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Camera,
  Edit3,
  ShieldCheck,
  ShoppingBasket,
  ChevronRight,
  Phone,
  Mail,
  Store,
} from 'lucide-react';
import { useAuth, UserAddress } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { getOrdersFromSupabase, OrderRecord } from '../services/supabase';
import { SEO } from '../components/ui/SEO';

export function CustomerDashboard() {
  const { user, logout, updateProfile, changePassword, saveAddress, deleteAddress, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  // State for forms and orders
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState(user?.fullName || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrLine, setAddrLine] = useState('');
  const [addrWard, setAddrWard] = useState('Tikapur-01');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Selected Order for detail popup
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadOrders() {
      setLoadingOrders(true);
      const data = await getOrdersFromSupabase();
      // Filter for current user's phone or show sample orders if matching customer
      if (user) {
        const userOrders = data.filter(
          (o) =>
            o.customerPhone.includes(user.phone) ||
            o.customerName.toLowerCase().includes(user.fullName.toLowerCase()) ||
            user.phone === '9848501234'
        );
        setOrders(userOrders.length > 0 ? userOrders : data.slice(0, 3));
      } else {
        setOrders(data.slice(0, 3));
      }
      setLoadingOrders(false);
    }

    loadOrders();
  }, [user]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    const res = await updateProfile({
      fullName,
      phone,
      avatarUrl,
    });

    if (res.success) {
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } else {
      setProfileError(res.error || 'Failed to update profile.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } else {
      setPasswordError(res.error || 'Password update failed.');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    const newAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      title: addrTitle,
      recipientName: addrRecipient || user?.fullName || 'Customer',
      phone: addrPhone || user?.phone || '9848500000',
      addressLine: addrLine,
      wardNo: addrWard,
      city: 'Tikapur, Kailali',
      isDefault: addrIsDefault,
    };

    saveAddress(newAddress);
    setShowAddressModal(false);
    setAddrLine('');
  };

  const wishlistProducts = PRODUCTS.filter((p) => user?.wishlist?.includes(p.id));

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#0B7A3D] dark:text-emerald-400 font-extrabold text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-extrabold text-[11px] flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 font-extrabold text-[11px] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <SEO
        title="Customer Account Dashboard | Manas Traders Tikapur"
        description="View your order history, delivery addresses, wishlist items, and personal profile."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B7A3D] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 sm:gap-6 z-10">
            <div className="relative group">
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                }
                alt={user?.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl bg-slate-800"
              />
              <button
                type="button"
                onClick={() => handleTabChange('profile')}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-[#FFC107] text-slate-950 shadow-md hover:scale-110 transition-transform"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFC107]" />
                <span>Verified Customer • Tikapur</span>
              </div>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight">
                Namaste, {user?.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#FFC107]" /> {user?.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#FFC107]" /> {user?.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <Link
              to="/products"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <ShoppingBasket className="w-4 h-4 text-[#FFC107]" />
              <span>Shop Groceries</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1">
              <button
                type="button"
                onClick={() => handleTabChange('overview')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Account Overview</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-slate-700 text-[#0B7A3D] dark:text-emerald-400 text-[10px] font-extrabold">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Saved Wishlist</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-slate-700 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">
                  {user?.wishlist?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Addresses</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                  {user?.addresses?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('security')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'security'
                    ? 'bg-[#0B7A3D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4" />
                  <span>Security & Password</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#0B7A3D] dark:text-emerald-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Total Orders</p>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{orders.length}</h3>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Saved Wishlist</p>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {user?.wishlist?.length || 0}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Saved Addresses</p>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {user?.addresses?.length || 0}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Recent Order Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#0B7A3D]" />
                      <span>Recent Orders</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleTabChange('orders')}
                      className="text-xs font-bold text-[#0B7A3D] dark:text-emerald-400 hover:underline"
                    >
                      View All ({orders.length})
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">No orders placed yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                                {ord.orderNumber}
                              </span>
                              {getStatusBadge(ord.status)}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              {ord.totalItems} items • Delivered to: {ord.deliveryAddress}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-sm font-extrabold text-[#0B7A3D] dark:text-emerald-400">
                              रू {ord.grandTotal.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Order History</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Track current grocery deliveries and past receipts</p>
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#0B7A3D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Loading order records...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">You haven't placed any orders yet.</p>
                    <Link
                      to="/products"
                      className="inline-block px-5 py-2.5 rounded-2xl bg-[#0B7A3D] text-white text-xs font-bold shadow-md"
                    >
                      Browse Grocery Store
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                                Order #{ord.orderNumber}
                              </span>
                              {getStatusBadge(ord.status)}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Date: {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-[#0B7A3D] dark:text-emerald-400 block">
                              रू {ord.grandTotal.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {ord.shippingOption === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                            </span>
                          </div>
                        </div>

                        {/* Items breakdown preview */}
                        <div className="space-y-1.5">
                          {ord.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                              <span>
                                {item.product?.name || 'Grocery Item'} x {item.quantity}
                              </span>
                              <span className="font-semibold">
                                रू {((item.product?.price || 0) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
                          >
                            View Order Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Wishlist Items</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your favorite daily grocery items saved for fast ordering</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Your wishlist is empty.</p>
                    <Link
                      to="/products"
                      className="inline-block px-5 py-2.5 rounded-2xl bg-[#0B7A3D] text-white text-xs font-bold shadow-md"
                    >
                      Explore Grocery Items
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                      >
                        <div className="relative mb-2">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-32 object-cover rounded-xl bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</h4>
                          <p className="text-[10px] text-slate-500">{prod.unit}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#0B7A3D] dark:text-emerald-400">
                              रू {prod.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(prod, 1)}
                              className="px-3 py-1.5 rounded-xl bg-[#0B7A3D] text-white text-[11px] font-bold shadow-sm hover:bg-[#086130]"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Delivery Addresses</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage addresses in Tikapur for 1-click order delivery</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#0B7A3D] text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                </div>

                {user?.addresses?.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">No delivery addresses saved yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border ${
                          addr.isDefault
                            ? 'border-[#0B7A3D] bg-emerald-50/50 dark:bg-emerald-950/30'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                        } space-y-3 relative`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#0B7A3D]" />
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-[#0B7A3D] text-white text-[10px] font-extrabold">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{addr.recipientName} ({addr.phone})</p>
                          <p>{addr.addressLine}, {addr.wardNo}</p>
                          <p>{addr.city}</p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Personal Profile</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your customer name, contact phone, and avatar photo</p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0B7A3D]" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Profile Picture Image URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#0B7A3D] text-white font-extrabold text-xs shadow-md hover:bg-[#086130] transition-all"
                  >
                    Save Profile Updates
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Change your account password safely</p>
                </div>

                {passwordSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0B7A3D]" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#0B7A3D] text-white font-extrabold text-xs shadow-md hover:bg-[#086130] transition-all"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Delivery Address (Tikapur)</h3>

              <form onSubmit={handleSaveNewAddress} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address Label</label>
                  <input
                    type="text"
                    required
                    value={addrTitle}
                    onChange={(e) => setAddrTitle(e.target.value)}
                    placeholder="Home, Shop, Hotel"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Recipient Name & Phone</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs"
                    />
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="9848500000"
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address Line</label>
                  <input
                    type="text"
                    required
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    placeholder="e.g. Hospital Line, Near Bus Park"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="w-4 h-4 text-[#0B7A3D]"
                  />
                  <label htmlFor="isDefault" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0B7A3D] text-white text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Receipt Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Receipt #{selectedOrder.orderNumber}</h3>
                  <p className="text-[11px] text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                <p><strong>Delivery Location:</strong> {selectedOrder.deliveryAddress}</p>
              </div>

              <div className="border-t border-b border-slate-200 dark:border-slate-700 py-3 space-y-2">
                <span className="font-bold text-xs uppercase text-slate-400">Order Items</span>
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span>{item.product?.name} x {item.quantity}</span>
                    <span className="font-bold">रू {((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>रू {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-रू {selectedOrder.discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-[#0B7A3D] dark:text-emerald-400 pt-1 border-t">
                  <span>Grand Total</span>
                  <span>रू {selectedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
