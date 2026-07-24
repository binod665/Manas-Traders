import React, { useState, useEffect } from 'react';
import { SEO } from '../components/ui/SEO';
import { useAuth, UserRole } from '../context/AuthContext';
import { ImageUpload } from '../components/admin/ImageUpload';
import {
  getProductsFromSupabase,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
  getCategoriesFromSupabase,
  addCategoryToSupabase,
  getOrdersFromSupabase,
  updateOrderStatus,
  getCustomersFromSupabase,
  getContactMessagesFromSupabase,
  updateMessageStatus,
  OrderRecord,
  CustomerRecord,
  ContactMessageRecord,
  isSupabaseConfigured,
} from '../services/supabase';
import { Product } from '../data/products';
import { Category } from '../data/categories';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  MessageSquare,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Database,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  X,
  Phone,
  Eye,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export function Admin() {
  const { user, isAuthenticated, login, loginAsDemoAdmin, logout, role } = useAuth();

  // Auth form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'messages'>('overview');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nepaliName: '',
    categoryId: 'rice-atta-ghee',
    categoryName: 'Rice, Atta & Ghee',
    price: 0,
    originalPrice: 0,
    unit: '1 Kg Pack',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    inStock: true,
    isFeatured: false,
    isLatest: false,
    isOffer: false,
    badge: '',
    description: '',
  });

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    nepaliName: '',
    icon: 'ShoppingBag',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  });

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [prods, cats, ords, custs, msgs] = await Promise.all([
        getProductsFromSupabase(),
        getCategoriesFromSupabase(),
        getOrdersFromSupabase(),
        getCustomersFromSupabase(),
        getContactMessagesFromSupabase(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setCustomers(custs);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    const res = await login(emailInput, passwordInput);
    if (!res.success) {
      setAuthError(res.error || 'Failed to authenticate');
    }
    setAuthSubmitting(false);
  };

  // Product save handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      // Update
      const updatedData: Partial<Product> = {
        name: productForm.name,
        nepaliName: productForm.nepaliName || productForm.name,
        categoryId: productForm.categoryId,
        categoryName: categories.find((c) => c.id === productForm.categoryId)?.name || productForm.categoryName,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        unit: productForm.unit,
        image: productForm.image,
        inStock: productForm.inStock,
        isFeatured: productForm.isFeatured,
        isLatest: productForm.isLatest,
        isOffer: productForm.isOffer,
        badge: productForm.badge || undefined,
        description: productForm.description,
      };

      await updateProductInSupabase(editingProduct.id, updatedData);
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updatedData } : p)));
    } else {
      // Add
      const selectedCat = categories.find((c) => c.id === productForm.categoryId);
      const newProd = {
        name: productForm.name,
        nepaliName: productForm.nepaliName || productForm.name,
        categoryId: productForm.categoryId,
        categoryName: selectedCat?.name || productForm.categoryName,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        unit: productForm.unit,
        image: productForm.image,
        inStock: productForm.inStock,
        isFeatured: productForm.isFeatured,
        isLatest: productForm.isLatest,
        isOffer: productForm.isOffer,
        badge: productForm.badge || undefined,
        description: productForm.description,
        rating: 5.0,
        reviewsCount: 1,
      };

      const res = await addProductToSupabase(newProd);
      if (res.data) {
        setProducts((prev) => [res.data, ...prev]);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      nepaliName: prod.nepaliName,
      categoryId: prod.categoryId,
      categoryName: prod.categoryName,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      unit: prod.unit,
      image: prod.image,
      inStock: prod.inStock !== false,
      isFeatured: !!prod.isFeatured,
      isLatest: !!prod.isLatest,
      isOffer: !!prod.isOffer,
      badge: prod.badge || '',
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this product from the inventory?')) {
      await deleteProductFromSupabase(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Category save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    const catId = categoryForm.id || categoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      id: catId,
      name: categoryForm.name,
      nepaliName: categoryForm.nepaliName || categoryForm.name,
      icon: categoryForm.icon,
      color: categoryForm.color,
      itemCount: 0,
      image: categoryForm.image,
      popularItems: [],
    };

    await addCategoryToSupabase(newCat);
    setCategories((prev) => [newCat, ...prev]);
    setIsCategoryModalOpen(false);
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: string, status: OrderRecord['status']) => {
    await updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Message status update
  const handleMessageStatusChange = async (msgId: string, status: 'unread' | 'read' | 'replied') => {
    await updateMessageStatus(msgId, status);
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status } : m)));
  };

  // =========================================================================
  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4">
        <SEO title="Admin Login | Manas Traders" description="Store owner and manager admin portal for Manas Traders Tikapur." />

        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0B7A3D]/20 text-[#0B7A3D] border border-[#0B7A3D]/40 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold font-playfair text-white">Manas Admin Portal</h1>
            <p className="text-slate-400 text-xs">Tikapur Grocery Store Management System</p>
          </div>

          {/* Database Connection Status Pill */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-900/60 border border-slate-700/80 rounded-xl text-xs font-semibold">
            <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className={isSupabaseConfigured() ? 'text-emerald-300' : 'text-amber-300'}>
              {isSupabaseConfigured() ? 'Supabase Live Connected' : 'Local Fallback Storage Active'}
            </span>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@manastraders.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 bg-[#0B7A3D] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {authSubmitting ? 'Authenticating...' : 'Sign In To Admin Dashboard'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-700 text-center space-y-3">
            <span className="text-[11px] text-slate-400 block font-semibold">Or Quick Demo Sign-In:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemoAdmin('admin')}
                className="py-2 px-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Store Admin
              </button>
              <button
                type="button"
                onClick={() => loginAsDemoAdmin('manager')}
                className="py-2 px-3 bg-sky-500/10 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-bold hover:bg-sky-500/20 flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Inventory Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.grandTotal : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const outOfStockProducts = products.filter((p) => p.inStock === false);
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <SEO title="Admin Dashboard | Manas Traders" description="Manage store inventory, orders, customers, and categories." />

      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-800/90 border-r border-slate-700/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & User profile */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                Manas Traders
              </span>
              <h2 className="font-bold text-white text-base">Store Management</h2>
            </div>
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Logged in info */}
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B7A3D] text-white flex items-center justify-center font-bold text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <span className="text-[10px] font-semibold text-emerald-400 capitalize px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 inline-block">
                Role: {role}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview & Stats
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                Products Catalog
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'categories'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                Categories
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {categories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                Customer Orders
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 font-extrabold animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                Customers
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {customers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#0B7A3D] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                Inquiries
              </div>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer Logout & Database indicator */}
        <div className="pt-6 border-t border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{isSupabaseConfigured() ? 'Supabase Live DB' : 'Local Storage Mode'}</span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold font-playfair text-white capitalize">
              {activeTab === 'overview' && 'Store Dashboard Overview'}
              {activeTab === 'products' && 'Inventory Products Management'}
              {activeTab === 'categories' && 'Categories & Departments'}
              {activeTab === 'orders' && 'Customer Orders Fulfillment'}
              {activeTab === 'customers' && 'Customer Contacts & Directory'}
              {activeTab === 'messages' && 'Wholesale & Support Inquiries'}
            </h1>
            <p className="text-slate-400 text-xs">
              Manas Traders • Tikapur, Kailali, Nepal
            </p>
          </div>

          {activeTab === 'products' && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  nepaliName: '',
                  categoryId: categories[0]?.id || 'rice-atta-ghee',
                  categoryName: categories[0]?.name || 'Rice, Atta & Ghee',
                  price: 500,
                  originalPrice: 550,
                  unit: '1 Kg Pack',
                  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
                  inStock: true,
                  isFeatured: true,
                  isLatest: false,
                  isOffer: false,
                  badge: 'New',
                  description: '',
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#0B7A3D] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          )}

          {activeTab === 'categories' && (
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2.5 bg-[#0B7A3D] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          )}
        </div>

        {/* LOADING INDICATOR */}
        {loadingData ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-xs font-bold">Synchronizing admin data with database...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & STATS */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-white">
                      रू {totalRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{orders.length} orders processed</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
                      <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-white">
                      {products.length} Products
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Across {categories.length} store categories
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Pending Delivery</span>
                      <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-amber-300">
                      {pendingOrdersCount} Orders
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Awaiting pickup / dispatch in Tikapur
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
                      <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-white">
                      {messages.length} Messages
                    </div>
                    <div className="text-[11px] text-purple-300">
                      {unreadMessagesCount} unread quotes
                    </div>
                  </div>
                </div>

                {/* Low Stock Alerts & Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Orders List */}
                  <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        Recent Customer Orders
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-emerald-400 hover:underline"
                      >
                        View All ({orders.length})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {orders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{order.orderNumber}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                • {order.customerName} ({order.customerPhone})
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              {order.totalItems} items • {order.shippingOption === 'pickup' ? 'Store Pickup' : 'Tikapur Home Delivery'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-emerald-400 text-sm">
                              रू {order.grandTotal.toLocaleString()}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                              className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Alert Box */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Stock Status Alert
                    </h3>

                    {outOfStockProducts.length === 0 ? (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-xs text-emerald-300 font-semibold space-y-1">
                        <CheckCircle className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                        <span>All products currently in stock!</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {outOfStockProducts.map((p) => (
                          <div key={p.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-200">{p.name}</span>
                            <span className="text-[10px] text-rose-400 font-extrabold uppercase">Out of Stock</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product inventory..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>

                {/* Table */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
                        <tr>
                          <th className="p-4">Product</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price (रू)</th>
                          <th className="p-4">Unit</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 font-medium">
                        {products
                          .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-10 h-10 rounded-xl object-cover bg-slate-700 shrink-0"
                                  />
                                  <div>
                                    <p className="font-bold text-white">{prod.name}</p>
                                    <p className="text-[11px] text-slate-400">{prod.nepaliName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-slate-300">{prod.categoryName}</td>
                              <td className="p-4 font-bold text-emerald-400">
                                रू {prod.price.toLocaleString()}
                                {prod.originalPrice && (
                                  <span className="text-[10px] text-slate-500 line-through block font-normal">
                                    रू {prod.originalPrice}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-slate-400">{prod.unit}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    prod.inStock !== false
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}
                                >
                                  {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => openEditProduct(prod)}
                                  className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 space-y-3">
                    <div className="h-32 rounded-2xl overflow-hidden relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <h3 className="font-bold text-white text-base">{cat.name}</h3>
                        <p className="text-xs text-emerald-300">{cat.nepaliName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Products in Category:</span>
                      <span className="font-extrabold text-white bg-slate-700 px-2.5 py-0.5 rounded-full">
                        {products.filter((p) => p.categoryId === cat.id).length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
                        <tr>
                          <th className="p-4">Order Code</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Address</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 font-medium">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-700/30">
                            <td className="p-4 font-bold text-white">{ord.orderNumber}</td>
                            <td className="p-4">
                              <p className="font-bold text-white">{ord.customerName}</p>
                              <p className="text-[11px] text-slate-400">{ord.customerPhone}</p>
                            </td>
                            <td className="p-4 text-slate-300 max-w-xs truncate">{ord.deliveryAddress}</td>
                            <td className="p-4 font-extrabold text-emerald-400">
                              रू {ord.grandTotal.toLocaleString()}
                            </td>
                            <td className="p-4 text-slate-300 capitalize">{ord.shippingOption}</td>
                            <td className="p-4">
                              <select
                                value={ord.status}
                                onChange={(e) => handleOrderStatusChange(ord.id, e.target.value as any)}
                                className="text-xs font-bold px-2 py-1 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(ord)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4">Location / Address</th>
                        <th className="p-4">Total Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 font-medium">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-700/30">
                          <td className="p-4 font-bold text-white">{c.fullName}</td>
                          <td className="p-4 text-emerald-400 font-bold">{c.phone}</td>
                          <td className="p-4 text-slate-300">{c.address}</td>
                          <td className="p-4 font-bold text-white">{c.totalOrders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: MESSAGES & INQUIRIES */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{m.subject}</h3>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                            {m.inquiryType}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs">
                          From: <strong className="text-slate-200">{m.fullName}</strong> • Phone: <strong className="text-emerald-400">{m.phone}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={m.status}
                          onChange={(e) => handleMessageStatusChange(m.id, e.target.value as any)}
                          className="text-xs font-bold px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                        <a
                          href={`https://wa.me/9779848500000?text=Namaste%20${encodeURIComponent(m.fullName)},%20regarding%20your%20inquiry%20"${encodeURIComponent(m.subject)}"`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Reply WhatsApp
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-700/40">
                      "{m.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <h3 className="font-bold font-playfair text-xl text-white">
                {editingProduct ? 'Edit Inventory Product' : 'Add New Inventory Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">English Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Jeera Masino Fine Rice 25 Kg"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nepali Product Name</label>
                  <input
                    type="text"
                    value={productForm.nepaliName}
                    onChange={(e) => setProductForm({ ...productForm, nepaliName: e.target.value })}
                    placeholder="e.g. जिरा मसीनो चामल २५ केजी"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Selling Price (रू)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Original Price (रू)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Unit Specification</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 25 Kg Bag / 1 Liter Bottle"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Bestseller, 10% OFF"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <ImageUpload
                value={productForm.image}
                onChange={(imgUrl) => setProductForm({ ...productForm, image: imgUrl })}
              />

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span className="font-bold text-slate-200">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span className="font-bold text-slate-200">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isLatest}
                    onChange={(e) => setProductForm({ ...productForm, isLatest: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span className="font-bold text-slate-200">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isOffer}
                    onChange={(e) => setProductForm({ ...productForm, isOffer: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span className="font-bold text-slate-200">Daily Deal</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe quality, origin, or usage tips..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B7A3D] hover:bg-emerald-700 font-bold rounded-xl text-white shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-lg text-white">Add Store Category</h3>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Frozen Foods & Ice Cream"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Category Name (Nepali)</label>
                <input
                  type="text"
                  value={categoryForm.nepaliName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nepaliName: e.target.value })}
                  placeholder="e.g. आइसक्रिम र ममो"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <ImageUpload
                value={categoryForm.image}
                onChange={(imgUrl) => setCategoryForm({ ...categoryForm, image: imgUrl })}
              />

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 rounded-xl text-white font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0B7A3D] rounded-xl text-white font-bold">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-lg text-white">Order {selectedOrder.orderNumber}</h3>
                <span className="text-xs text-slate-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60 space-y-1">
                <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> <span className="text-emerald-400 font-bold">{selectedOrder.customerPhone}</span></p>
                <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Fulfillment:</strong> {selectedOrder.shippingOption}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-300 uppercase tracking-wider">Ordered Items:</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-700/40">
                    <div>
                      <p className="font-bold text-white">{item.product?.name || 'Grocery Item'}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.product?.unit} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-extrabold text-emerald-400">
                      रू {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-700 flex justify-between font-extrabold text-sm text-white">
                <span>Grand Total:</span>
                <span className="text-emerald-400">रू {selectedOrder.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
