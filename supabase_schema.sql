-- ====================================================================
-- MANAS TRADERS TIKAPUR - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ====================================================================
-- Execute this SQL script in the Supabase SQL Editor (https://app.supabase.com)
-- to automatically create all required tables, indexes, sample data, and row-level security (RLS) policies.

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nepali_name VARCHAR(255) NOT NULL,
  icon VARCHAR(100) DEFAULT 'ShoppingBag',
  color VARCHAR(100) DEFAULT 'bg-emerald-50 text-emerald-700 border-emerald-200',
  item_count INT DEFAULT 0,
  image TEXT,
  popular_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nepali_name VARCHAR(255) NOT NULL,
  category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  discount_percent INT DEFAULT 0,
  unit VARCHAR(100) NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  image TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_latest BOOLEAN DEFAULT FALSE,
  is_offer BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  badge VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100) DEFAULT 'Tikapur',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  delivery_address TEXT NOT NULL,
  total_items INT NOT NULL DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  grand_total NUMERIC(10, 2) NOT NULL,
  shipping_option VARCHAR(50) DEFAULT 'pickup',
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, out_for_delivery, delivered, cancelled
  items_json JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTACT MESSAGES / INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  inquiry_type VARCHAR(100) DEFAULT 'general', -- general, wholesale, delivery, feedback
  status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALSO CREATE ALIAS 'inquiries' FOR BACKWARD COMPATIBILITY
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  inquiry_type VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access for Categories and Products
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- 2. Public Read Access for Product Reviews
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 3. Public Insert Access for Customers and Orders
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select customers" ON customers FOR SELECT USING (true);

CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select orders" ON orders FOR SELECT USING (true);

-- 4. Public Insert Access for Contact Messages & Inquiries
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select contact_messages" ON contact_messages FOR SELECT USING (true);

CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select inquiries" ON inquiries FOR SELECT USING (true);


-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- Seed Categories
INSERT INTO categories (id, name, nepali_name, icon, color, item_count, image, popular_items)
VALUES
  ('rice-atta-ghee', 'Rice, Atta & Ghee', 'चामल, पिठो र घिउ', 'Wheat', 'bg-amber-50 text-amber-700 border-amber-200', 42, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', ARRAY['Jeera Masino Rice', 'Chakki Atta', 'Pure Cow Ghee']),
  ('fresh-veggies', 'Fresh Vegetables & Fruits', 'ताजा तरकारी र फलफूल', 'Apple', 'bg-emerald-50 text-emerald-700 border-emerald-200', 38, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', ARRAY['Local Onions', 'Potatoes', 'Fresh Apples']),
  ('pulses-daal', 'Pulses & Daal', 'दाल र गेडागुडी', 'Bean', 'bg-yellow-50 text-yellow-800 border-yellow-200', 29, 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80', ARRAY['Rahar Daal', 'Kalo Maas', 'Yellow Moong']),
  ('cooking-oils', 'Edible Oils & Cooking', 'खाना पकाउने तेल', 'Droplet', 'bg-amber-50 text-amber-800 border-amber-200', 24, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', ARRAY['Mustard Oil', 'Sunflower Oil', 'Soyabean Oil']),
  ('spices-masala', 'Spices & Masala', 'मसला तथा नुन', 'Flame', 'bg-rose-50 text-rose-700 border-rose-200', 35, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', ARRAY['Turmeric Powder', 'Meat Masala', 'Iodized Salt']),
  ('tea-beverages', 'Tea, Coffee & Drinks', 'चिया, कफी र पेय पदार्थ', 'Coffee', 'bg-teal-50 text-teal-800 border-teal-200', 31, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80', ARRAY['CTC Dust Tea', 'Green Tea', 'Instant Coffee']),
  ('dairy-bakery', 'Dairy, Milk & Bakery', 'दूध, दही र बेकरी', 'Milk', 'bg-blue-50 text-blue-700 border-blue-200', 22, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80', ARRAY['Fresh Dairy Milk', 'Curd (दही)', 'Fresh Bread']),
  ('snacks-noodles', 'Snacks & Instant Food', 'खाजा र चाउचाउ', 'UtensilsCrossed', 'bg-orange-50 text-orange-700 border-orange-200', 45, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', ARRAY['Wai Wai Noodles', 'Current Noodles', 'Biscuits'])
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Products
INSERT INTO products (id, name, nepali_name, category_id, category_name, price, original_price, discount_percent, unit, rating, reviews_count, image, is_featured, is_latest, is_offer, in_stock, badge, description)
VALUES
  ('prod-1', 'Jeera Masino Fine Rice (25 Kg Sack)', 'जिरा मसीनो चामल २५ केजी', 'rice-atta-ghee', 'Rice, Atta & Ghee', 2150, 2350, 8, '25 Kg Bag', 4.9, 142, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', TRUE, FALSE, TRUE, TRUE, 'Bestseller', 'Premium soft cooking Jeera Masino rice bag. A daily favorite for Tikapur families offering long grains and pleasant aroma.'),
  ('prod-2', 'Pure Shuddha Mustard Oil (तोरीको तेल)', 'शुद्ध तोरीको तेल १ लिटर', 'cooking-oils', 'Edible Oils & Cooking', 260, 290, 10, '1 Liter Bottle', 4.8, 98, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80', TRUE, FALSE, TRUE, TRUE, '10% OFF', 'Cold-pressed traditional mustard oil with rich pungent aroma. Ideal for authentic Nepalese curry and pickle preparation.'),
  ('prod-3', 'Refined Whole Wheat Chakki Atta', 'चक्की आटा ५ केजी', 'rice-atta-ghee', 'Rice, Atta & Ghee', 380, 420, 9, '5 Kg Bag', 4.7, 84, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80', TRUE, FALSE, FALSE, TRUE, 'Fresh Stock', '100% whole wheat fiber rich flour milled freshly for extra soft and fluffy rotis.'),
  ('prod-4', 'Local Rahar Daal (रहरको दाल)', 'स्थानीय रहर दाल १ केजी', 'pulses-daal', 'Pulses & Daal', 210, 230, 8, '1 Kg Pack', 4.9, 62, 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&q=80', TRUE, FALSE, TRUE, TRUE, 'Top Choice', 'High protein unpolished Rahar Daal sourced directly for rich Nepalese Dal-Bhat meal.'),
  ('prod-5', 'Wai Wai Quick Noodles Box (30 Pcs)', 'वाइ वाइ चाउचाउ कार्टुन (३० पिस)', 'snacks-noodles', 'Snacks & Instant Food', 600, 660, 9, 'Box of 30 Packs', 5.0, 210, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', TRUE, TRUE, FALSE, TRUE, 'Wholesale Deal', 'Iconic Nepalese instant chicken seasoned noodles. Great for quick household snacks or store resale.'),
  ('prod-6', 'Organic Turmeric Powder (बेसार पाउडर)', 'शुद्ध बेसार ५०० ग्राम', 'spices-masala', 'Spices & Masala', 180, 200, 10, '500 Gram Pack', 4.8, 53, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', FALSE, TRUE, FALSE, TRUE, 'Pure Spice', 'Aromatic, deep golden natural turmeric powder milled without added artificial colors.'),
  ('prod-7', 'Pure Cow Ghee (शुद्ध गाईको घिउ)', 'शुद्ध गाईको घिउ ५०० ग्राम', 'rice-atta-ghee', 'Rice, Atta & Ghee', 650, 700, 7, '500 ml Jar', 4.9, 77, 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&q=80', TRUE, TRUE, FALSE, TRUE, 'Pure Dairy', 'Granular texture pure cow ghee prepared traditionally with rich aroma for worship and cooking.'),
  ('prod-8', 'Fresh Red Onions (प्याज)', 'ताजा रातो प्याज ५ केजी', 'fresh-veggies', 'Fresh Vegetables & Fruits', 320, 360, 11, '5 Kg Bag', 4.6, 89, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80', FALSE, FALSE, TRUE, TRUE, 'Daily Fresh', 'Hand-sorted farm fresh red onions delivered daily to Manas Traders Tikapur store.')
ON CONFLICT (id) DO NOTHING;
