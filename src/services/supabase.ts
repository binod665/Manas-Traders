import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, PRODUCTS } from '../data/products';
import { Category, CATEGORIES } from '../data/categories';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidHttpUrl(stringUrl?: string): boolean {
  if (!stringUrl || stringUrl.trim() === '') return false;
  try {
    const url = new URL(stringUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-anon-key';

const targetUrl = isValidHttpUrl(rawUrl) ? rawUrl! : fallbackUrl;
const targetKey = rawKey && rawKey.trim() !== '' ? rawKey : fallbackKey;

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return isValidHttpUrl(rawUrl) && targetUrl !== fallbackUrl;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(targetUrl, targetKey);
    } catch (e) {
      console.warn('Supabase client creation failed, using fallback:', e);
      supabaseClient = createClient(fallbackUrl, fallbackKey);
    }
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();

// Local Storage Keys for offline/fallback CRUD persistence
const LOCAL_PRODUCTS_KEY = 'manas_admin_products';
const LOCAL_CATEGORIES_KEY = 'manas_admin_categories';
const LOCAL_ORDERS_KEY = 'manas_admin_orders';
const LOCAL_CUSTOMERS_KEY = 'manas_admin_customers';
const LOCAL_MESSAGES_KEY = 'manas_admin_messages';

function getStoredLocal<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

// --------------------------------------------------------------------
// PRODUCTS CRUD
// --------------------------------------------------------------------

export async function getProductsFromSupabase(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
    }

    const loaded = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      nepaliName: item.nepali_name,
      categoryId: item.category_id,
      categoryName: item.category_name,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      discountPercent: item.discount_percent ? Number(item.discount_percent) : undefined,
      unit: item.unit,
      rating: item.rating ? Number(item.rating) : 5.0,
      reviewsCount: item.reviews_count ? Number(item.reviews_count) : 0,
      image: item.image,
      isFeatured: Boolean(item.is_featured),
      isLatest: Boolean(item.is_latest),
      isOffer: Boolean(item.is_offer),
      inStock: Boolean(item.in_stock),
      badge: item.badge || undefined,
      description: item.description || '',
    }));

    setStoredLocal(LOCAL_PRODUCTS_KEY, loaded);
    return loaded;
  } catch (err) {
    console.error('Error fetching products:', err);
    return getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
  }
}

export async function addProductToSupabase(product: Omit<Product, 'id'> & { id?: string }) {
  const newId = product.id || `prod-${Date.now()}`;
  const fullProduct: Product = { ...product, id: newId };

  // Always update local cache
  const currentLocal = getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
  setStoredLocal(LOCAL_PRODUCTS_KEY, [fullProduct, ...currentLocal]);

  if (!isSupabaseConfigured()) {
    return { data: fullProduct, error: null };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('products').insert([
      {
        id: newId,
        name: product.name,
        nepali_name: product.nepaliName,
        category_id: product.categoryId,
        category_name: product.categoryName,
        price: product.price,
        original_price: product.originalPrice || null,
        discount_percent: product.discountPercent || 0,
        unit: product.unit,
        rating: product.rating || 5.0,
        reviews_count: product.reviewsCount || 0,
        image: product.image,
        is_featured: product.isFeatured || false,
        is_latest: product.isLatest || false,
        is_offer: product.isOffer || false,
        in_stock: product.inStock !== false,
        badge: product.badge || null,
        description: product.description || '',
      },
    ]).select();

    return { data: data?.[0] || fullProduct, error };
  } catch (err: any) {
    console.error('Error adding product:', err);
    return { data: fullProduct, error: err };
  }
}

export async function updateProductInSupabase(productId: string, updates: Partial<Product>) {
  // Update local cache
  const currentLocal = getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
  const updatedLocal = currentLocal.map((p) => (p.id === productId ? { ...p, ...updates } : p));
  setStoredLocal(LOCAL_PRODUCTS_KEY, updatedLocal);

  if (!isSupabaseConfigured()) {
    return { data: updatedLocal.find((p) => p.id === productId), error: null };
  }

  try {
    const client = getSupabaseClient();
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.nepaliName !== undefined) payload.nepali_name = updates.nepaliName;
    if (updates.categoryId !== undefined) payload.category_id = updates.categoryId;
    if (updates.categoryName !== undefined) payload.category_name = updates.categoryName;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
    if (updates.discountPercent !== undefined) payload.discount_percent = updates.discountPercent;
    if (updates.unit !== undefined) payload.unit = updates.unit;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
    if (updates.isLatest !== undefined) payload.is_latest = updates.isLatest;
    if (updates.isOffer !== undefined) payload.is_offer = updates.isOffer;
    if (updates.inStock !== undefined) payload.in_stock = updates.inStock;
    if (updates.badge !== undefined) payload.badge = updates.badge;
    if (updates.description !== undefined) payload.description = updates.description;

    const { data, error } = await client.from('products').update(payload).eq('id', productId).select();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteProductFromSupabase(productId: string) {
  // Update local cache
  const currentLocal = getStoredLocal<Product[]>(LOCAL_PRODUCTS_KEY, PRODUCTS);
  setStoredLocal(LOCAL_PRODUCTS_KEY, currentLocal.filter((p) => p.id !== productId));

  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('products').delete().eq('id', productId);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// --------------------------------------------------------------------
// CATEGORIES CRUD
// --------------------------------------------------------------------

export async function getCategoriesFromSupabase(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return getStoredLocal<Category[]>(LOCAL_CATEGORIES_KEY, CATEGORIES);
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('categories').select('*');

    if (error || !data || data.length === 0) {
      return getStoredLocal<Category[]>(LOCAL_CATEGORIES_KEY, CATEGORIES);
    }

    const loaded = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      nepaliName: item.nepali_name,
      icon: item.icon || 'ShoppingBag',
      color: item.color || 'bg-emerald-50 text-emerald-700 border-emerald-200',
      itemCount: item.item_count ? Number(item.item_count) : 0,
      image: item.image || '',
      popularItems: Array.isArray(item.popular_items) ? item.popular_items : [],
    }));

    setStoredLocal(LOCAL_CATEGORIES_KEY, loaded);
    return loaded;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return getStoredLocal<Category[]>(LOCAL_CATEGORIES_KEY, CATEGORIES);
  }
}

export async function addCategoryToSupabase(category: Category) {
  const current = getStoredLocal<Category[]>(LOCAL_CATEGORIES_KEY, CATEGORIES);
  setStoredLocal(LOCAL_CATEGORIES_KEY, [category, ...current]);

  if (!isSupabaseConfigured()) return { data: category, error: null };

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('categories').insert([
      {
        id: category.id,
        name: category.name,
        nepali_name: category.nepaliName,
        icon: category.icon,
        color: category.color,
        item_count: category.itemCount || 0,
        image: category.image || '',
        popular_items: category.popularItems || [],
      },
    ]).select();
    return { data: data?.[0] || category, error };
  } catch (err: any) {
    return { data: category, error: err };
  }
}

// --------------------------------------------------------------------
// ORDERS MANAGEMENT
// --------------------------------------------------------------------

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  shippingOption: 'pickup' | 'delivery';
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: any[];
  createdAt: string;
}

const DEFAULT_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-101',
    orderNumber: 'MT-881920',
    customerName: 'Ram Bahadur Shrestha',
    customerPhone: '9848501234',
    deliveryAddress: 'Tikapur-1, Hospital Line, Kailali',
    totalItems: 3,
    subtotal: 3010,
    discountAmount: 100,
    shippingFee: 0,
    grandTotal: 2910,
    shippingOption: 'delivery',
    status: 'pending',
    items: [
      { product: { name: 'Jeera Masino Fine Rice (25 Kg Sack)', price: 2150, unit: '25 Kg Bag' }, quantity: 1 },
      { product: { name: 'Pure Shuddha Mustard Oil', price: 260, unit: '1 Liter Bottle' }, quantity: 2 },
      { product: { name: 'Refined Whole Wheat Chakki Atta', price: 340, unit: '5 Kg Bag' }, quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-102',
    orderNumber: 'MT-881921',
    customerName: 'Sita Sharma',
    customerPhone: '9801234567',
    deliveryAddress: 'Tikapur Store Self Pickup',
    totalItems: 2,
    subtotal: 810,
    discountAmount: 50,
    shippingFee: 0,
    grandTotal: 760,
    shippingOption: 'pickup',
    status: 'confirmed',
    items: [
      { product: { name: 'Pure Shuddha Mustard Oil', price: 260, unit: '1 Liter Bottle' }, quantity: 1 },
      { product: { name: 'Wai Wai Quick Noodles Box', price: 550, unit: 'Box of 30 Packs' }, quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export async function getOrdersFromSupabase(): Promise<OrderRecord[]> {
  if (!isSupabaseConfigured()) {
    return getStoredLocal<OrderRecord[]>(LOCAL_ORDERS_KEY, DEFAULT_SAMPLE_ORDERS);
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getStoredLocal<OrderRecord[]>(LOCAL_ORDERS_KEY, DEFAULT_SAMPLE_ORDERS);
    }

    const loaded = data.map((item: any) => ({
      id: item.id,
      orderNumber: item.order_number,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      deliveryAddress: item.delivery_address,
      totalItems: item.total_items || 1,
      subtotal: Number(item.subtotal || 0),
      discountAmount: Number(item.discount_amount || 0),
      shippingFee: Number(item.shipping_fee || 0),
      grandTotal: Number(item.grand_total || 0),
      shippingOption: item.shipping_option || 'pickup',
      status: item.status || 'pending',
      items: item.items_json || [],
      createdAt: item.created_at || new Date().toISOString(),
    }));

    setStoredLocal(LOCAL_ORDERS_KEY, loaded);
    return loaded;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return getStoredLocal<OrderRecord[]>(LOCAL_ORDERS_KEY, DEFAULT_SAMPLE_ORDERS);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderRecord['status']) {
  const current = getStoredLocal<OrderRecord[]>(LOCAL_ORDERS_KEY, DEFAULT_SAMPLE_ORDERS);
  const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
  setStoredLocal(LOCAL_ORDERS_KEY, updated);

  if (!isSupabaseConfigured()) return { error: null };

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('orders').update({ status }).eq('id', orderId);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function submitOrderToSupabase(orderData: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: any[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  shippingOption: string;
}) {
  const orderNumber = `MT-${Date.now().toString().slice(-6)}`;
  const newOrder: OrderRecord = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    deliveryAddress: orderData.deliveryAddress,
    totalItems: orderData.items.reduce((acc, i) => acc + (i.quantity || 1), 0),
    subtotal: orderData.subtotal,
    discountAmount: orderData.discountAmount,
    shippingFee: orderData.shippingFee,
    grandTotal: orderData.grandTotal,
    shippingOption: orderData.shippingOption as any,
    status: 'pending',
    items: orderData.items,
    createdAt: new Date().toISOString(),
  };

  const currentLocal = getStoredLocal<OrderRecord[]>(LOCAL_ORDERS_KEY, DEFAULT_SAMPLE_ORDERS);
  setStoredLocal(LOCAL_ORDERS_KEY, [newOrder, ...currentLocal]);

  // Auto-record or update customer list
  const currentCust = getStoredLocal<any[]>(LOCAL_CUSTOMERS_KEY, DEFAULT_SAMPLE_CUSTOMERS);
  if (!currentCust.some((c) => c.phone === orderData.customerPhone)) {
    const newCust = {
      id: `cust-${Date.now()}`,
      fullName: orderData.customerName,
      phone: orderData.customerPhone,
      address: orderData.deliveryAddress,
      totalOrders: 1,
      totalSpent: orderData.grandTotal,
    };
    setStoredLocal(LOCAL_CUSTOMERS_KEY, [newCust, ...currentCust]);
  }

  if (!isSupabaseConfigured()) {
    return { data: { id: newOrder.id, order_number: orderNumber }, error: null };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('orders').insert([
      {
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        total_items: newOrder.totalItems,
        subtotal: orderData.subtotal,
        discount_amount: orderData.discountAmount,
        shipping_fee: orderData.shippingFee,
        grand_total: orderData.grandTotal,
        shipping_option: orderData.shippingOption,
        items_json: orderData.items,
        status: 'pending',
      },
    ]).select();

    return { data: data?.[0] || { order_number: orderNumber }, error };
  } catch (err: any) {
    return { data: newOrder, error: err };
  }
}

// --------------------------------------------------------------------
// CUSTOMERS
// --------------------------------------------------------------------

export interface CustomerRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
}

const DEFAULT_SAMPLE_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'c-1',
    fullName: 'Ram Bahadur Shrestha',
    phone: '9848501234',
    email: 'ram.shrestha@gmail.com',
    address: 'Tikapur-1, Kailali',
    totalOrders: 4,
    totalSpent: 11400,
  },
  {
    id: 'c-2',
    fullName: 'Sita Sharma',
    phone: '9801234567',
    email: 'sita.sharma@yahoo.com',
    address: 'Tikapur-2, Main Market',
    totalOrders: 2,
    totalSpent: 3500,
  },
  {
    id: 'c-3',
    fullName: 'Ganesh Thapa',
    phone: '9868709921',
    address: 'Bhanu Chowk, Tikapur',
    totalOrders: 1,
    totalSpent: 2150,
  },
];

export async function getCustomersFromSupabase(): Promise<CustomerRecord[]> {
  if (!isSupabaseConfigured()) {
    return getStoredLocal<CustomerRecord[]>(LOCAL_CUSTOMERS_KEY, DEFAULT_SAMPLE_CUSTOMERS);
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('customers').select('*');

    if (error || !data || data.length === 0) {
      return getStoredLocal<CustomerRecord[]>(LOCAL_CUSTOMERS_KEY, DEFAULT_SAMPLE_CUSTOMERS);
    }

    const loaded = data.map((c: any) => ({
      id: c.id,
      fullName: c.full_name,
      phone: c.phone,
      email: c.email || undefined,
      address: c.address || 'Tikapur',
      totalOrders: 1,
      totalSpent: 0,
    }));

    setStoredLocal(LOCAL_CUSTOMERS_KEY, loaded);
    return loaded;
  } catch (err) {
    return getStoredLocal<CustomerRecord[]>(LOCAL_CUSTOMERS_KEY, DEFAULT_SAMPLE_CUSTOMERS);
  }
}

// --------------------------------------------------------------------
// MESSAGES & INQUIRIES
// --------------------------------------------------------------------

export interface ContactMessageRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

const DEFAULT_SAMPLE_MESSAGES: ContactMessageRecord[] = [
  {
    id: 'm-1',
    fullName: 'Krishna Kumar Chaudhary',
    phone: '9812349988',
    email: 'krishna.wholesale@gmail.com',
    subject: 'Wholesale Rice Bag Bulk Quotation',
    message: 'Namaste Manas Traders. We need 50 bags of Jeera Masino rice for our hotel in Tikapur. Please send wholesale price list.',
    inquiryType: 'wholesale',
    status: 'unread',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'm-2',
    fullName: 'Pooja Bista',
    phone: '9848590111',
    subject: 'Delivery area confirmation',
    message: 'Do you deliver to Tikapur Ward 8 near airport road?',
    inquiryType: 'delivery',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

export async function getContactMessagesFromSupabase(): Promise<ContactMessageRecord[]> {
  if (!isSupabaseConfigured()) {
    return getStoredLocal<ContactMessageRecord[]>(LOCAL_MESSAGES_KEY, DEFAULT_SAMPLE_MESSAGES);
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getStoredLocal<ContactMessageRecord[]>(LOCAL_MESSAGES_KEY, DEFAULT_SAMPLE_MESSAGES);
    }

    const loaded = data.map((m: any) => ({
      id: m.id,
      fullName: m.full_name,
      phone: m.phone,
      email: m.email || undefined,
      subject: m.subject,
      message: m.message,
      inquiryType: m.inquiry_type || 'general',
      status: m.status || 'unread',
      createdAt: m.created_at || new Date().toISOString(),
    }));

    setStoredLocal(LOCAL_MESSAGES_KEY, loaded);
    return loaded;
  } catch (err) {
    return getStoredLocal<ContactMessageRecord[]>(LOCAL_MESSAGES_KEY, DEFAULT_SAMPLE_MESSAGES);
  }
}

export async function submitInquiry(data: {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  inquiryType: string;
}) {
  const newMsg: ContactMessageRecord = {
    id: `msg-${Date.now()}`,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    subject: data.subject,
    message: data.message,
    inquiryType: data.inquiryType,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  const currentLocal = getStoredLocal<ContactMessageRecord[]>(LOCAL_MESSAGES_KEY, DEFAULT_SAMPLE_MESSAGES);
  setStoredLocal(LOCAL_MESSAGES_KEY, [newMsg, ...currentLocal]);

  if (!isSupabaseConfigured()) {
    return { data: newMsg, error: null };
  }

  try {
    const client = getSupabaseClient();
    const { data: result, error } = await client.from('contact_messages').insert([
      {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject,
        message: data.message,
        inquiry_type: data.inquiryType,
      },
    ]);

    return { data: result, error };
  } catch (err: any) {
    return { data: newMsg, error: err };
  }
}

export async function updateMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied') {
  const current = getStoredLocal<ContactMessageRecord[]>(LOCAL_MESSAGES_KEY, DEFAULT_SAMPLE_MESSAGES);
  const updated = current.map((m) => (m.id === messageId ? { ...m, status } : m));
  setStoredLocal(LOCAL_MESSAGES_KEY, updated);

  if (!isSupabaseConfigured()) return { error: null };

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('contact_messages').update({ status }).eq('id', messageId);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function submitReviewToSupabase(reviewData: {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}) {
  if (!isSupabaseConfigured()) {
    return { data: { id: Date.now() }, error: null };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('reviews').insert([
      {
        product_id: reviewData.productId,
        customer_name: reviewData.customerName,
        rating: reviewData.rating,
        comment: reviewData.comment,
      },
    ]);

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}
