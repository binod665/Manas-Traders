# Supabase Integration & Database Documentation

**Application:** Manas Traders Tikapur Grocery & Wholesale Store  
**Database Backend:** PostgreSQL via [Supabase](https://supabase.com)

---

## 1. Overview
This application includes full Supabase integration for persistent database storage while gracefully falling back to local dataset defaults if Supabase credentials are not configured.

### Connected Tables
1. **`products`** - Stores full grocery catalog, prices in NRs (रू), discounts, stock status, ratings, and imagery.
2. **`categories`** - Stores product category metadata, Nepalese translations, icons, and item counts.
3. **`orders`** - Stores customer grocery orders, fulfillment choice (Tikapur Delivery vs. Store Pickup), applied coupons, and order item breakdowns in JSON.
4. **`customers`** - Stores customer contact details, phone numbers, and delivery addresses in Tikapur.
5. **`reviews`** - Stores product feedback and star ratings submitted by local shoppers.
6. **`contact_messages` / `inquiries`** - Stores wholesale quotes, general inquiry forms, and customer support messages.

---

## 2. Quick Setup Instructions

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New Project** and select a name (e.g. `manas-traders-tikapur`).
3. Choose a strong database password and select a region close to Nepal (e.g. `Singapore` or `Mumbai`).

### Step 2: Apply the Database Schema
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor** tab from the left sidebar.
3. Open the included [`supabase_schema.sql`](./supabase_schema.sql) file from this repository.
4. Copy the entire contents of `supabase_schema.sql` and paste it into the Supabase SQL Editor.
5. Click **RUN** to generate all 6 tables, indexes, row-level security policies, and initial sample seeds.

### Step 3: Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **`anon` `public` key**.
3. Create or update your `.env` file or environment secrets:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

> 🔒 **Security Notice:** The `anon` key is safe to expose in client environment variables because Row Level Security (RLS) policies enforce public access limits on the server side.

---

## 3. Database Schema Structure

### `categories`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `VARCHAR(100)` (PK) | Unique slug (e.g., `rice-atta-ghee`) |
| `name` | `VARCHAR(255)` | Category name in English |
| `nepali_name` | `VARCHAR(255)` | Category name in Nepali |
| `icon` | `VARCHAR(100)` | Lucide icon identifier |
| `color` | `VARCHAR(100)` | Tailwind badge styling class |
| `item_count` | `INT` | Total catalog count |
| `image` | `TEXT` | Banner image URL |
| `popular_items` | `TEXT[]` | Popular items array |

### `products`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `VARCHAR(100)` (PK) | Unique product code (e.g., `prod-1`) |
| `name` | `VARCHAR(255)` | Product name |
| `nepali_name` | `VARCHAR(255)` | Product name in Nepali |
| `category_id` | `VARCHAR(100)` | Foreign Key to `categories.id` |
| `category_name` | `VARCHAR(255)` | Denormalized category title |
| `price` | `NUMERIC(10,2)` | Selling price in NRs (रू) |
| `original_price` | `NUMERIC(10,2)` | Original price for offer badges |
| `discount_percent` | `INT` | Discount percentage |
| `unit` | `VARCHAR(100)` | Unit size (e.g. `25 Kg Bag`, `1 Liter Bottle`) |
| `rating` | `NUMERIC(3,2)` | Star rating (1.0 to 5.0) |
| `reviews_count` | `INT` | Total reviews count |
| `image` | `TEXT` | Image URL |
| `is_featured` | `BOOLEAN` | Show in home featured grid |
| `is_latest` | `BOOLEAN` | Show in new arrivals |
| `is_offer` | `BOOLEAN` | Show in daily deals |
| `in_stock` | `BOOLEAN` | Stock availability |
| `badge` | `VARCHAR(100)` | Badge tag (e.g. `Bestseller`) |

### `orders`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Auto-generated UUID |
| `order_number` | `VARCHAR(100)` | Unique order code (e.g. `MT-982134`) |
| `customer_name` | `VARCHAR(255)` | Customer full name |
| `customer_phone` | `VARCHAR(50)` | Customer phone number |
| `delivery_address` | `TEXT` | Tikapur street address |
| `total_items` | `INT` | Item count in order |
| `subtotal` | `NUMERIC(10,2)` | Order subtotal in NRs |
| `discount_amount` | `NUMERIC(10,2)` | Discount amount |
| `shipping_fee` | `NUMERIC(10,2)` | Delivery fee (रू 0 or रू 50) |
| `grand_total` | `NUMERIC(10,2)` | Final total in NRs |
| `shipping_option` | `VARCHAR(50)` | `pickup` or `delivery` |
| `status` | `VARCHAR(50)` | `pending`, `confirmed`, `delivered` |
| `items_json` | `JSONB` | Array of ordered product details |

### `customers`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Auto-generated customer ID |
| `full_name` | `VARCHAR(255)` | Customer name |
| `phone` | `VARCHAR(50)` | Phone number |
| `email` | `VARCHAR(255)` | Email address |
| `address` | `TEXT` | Address in Tikapur |

### `reviews`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Review ID |
| `product_id` | `VARCHAR(100)` | Foreign Key to `products.id` |
| `customer_name` | `VARCHAR(255)` | Reviewer name |
| `rating` | `INT` | Rating 1 to 5 |
| `comment` | `TEXT` | Review text |

### `contact_messages` / `inquiries`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Inquiry ID |
| `full_name` | `VARCHAR(255)` | Sender full name |
| `phone` | `VARCHAR(50)` | Contact phone |
| `email` | `VARCHAR(255)` | Optional email |
| `subject` | `VARCHAR(255)` | Inquiry subject |
| `message` | `TEXT` | Message details |
| `inquiry_type` | `VARCHAR(100)` | `general`, `wholesale`, `delivery` |

---

## 4. Row Level Security (RLS) Policies
All tables feature Row Level Security enabled in `supabase_schema.sql`:
- **Read Access (`SELECT`)**: Public read access is enabled for `products`, `categories`, and `reviews`.
- **Write Access (`INSERT`)**: Public insert permissions are enabled for placing `orders`, submitting `customers`, posting `reviews`, and sending `contact_messages` / `inquiries`.
- **Admin Access**: Full update/delete operations require admin secret service key or authenticated Supabase admin user credentials.

---

## 5. Reusable Service Functions (`src/services/supabase.ts`)

You can import and use the following functions anywhere in your app:

```typescript
import {
  getProductsFromSupabase,
  getCategoriesFromSupabase,
  submitOrderToSupabase,
  submitInquiry,
  submitReviewToSupabase,
} from './services/supabase';

// Example: Fetch products dynamically
const products = await getProductsFromSupabase();

// Example: Place order
const result = await submitOrderToSupabase({
  customerName: "Ram Sharma",
  customerPhone: "9848500000",
  deliveryAddress: "Tikapur-1, Kailali",
  items: cartItems,
  subtotal: 2150,
  discountAmount: 100,
  shippingFee: 0,
  grandTotal: 2050,
  shippingOption: "delivery"
});
```
