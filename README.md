# Manas Traders — Premier Grocery & Wholesale Store (Tikapur, Kailali, Nepal)

A full-stack, responsive web application for **Manas Traders**, a leading grocery store and wholesale distribution hub located in **Tikapur-01, Kailali, Sudurpashchim Province, Nepal**.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite**, and **Supabase Database Integration**. Designed for seamless local delivery, grocery catalog browsing, online inquiry submission, and full GitHub Pages deployment.

---

## 🌟 Key Features

- 🛒 **Interactive Product Catalog**: Real-time filtering by category (Grains, Edible Oils, Pulses & Lentils, Spices, Snacks, Home Supplies), price range filter, sort order (price, rating, featured), and search auto-completion.
- 📦 **Cart & Instant Checkout**: Support for local home delivery in Tikapur and store pick-up orders with delivery fee computation and WhatsApp order sharing.
- 💬 **Online Inquiry Form & Contact Hub**: Direct contact form powered by Supabase, plus quick-action links for WhatsApp (+977 9848500665), Facebook Page, and Messenger.
- 🗺️ **Embedded Google Maps & Store Info**: Full store directory with active opening hours, telephone numbers (`9848500665` / `9824600477`), and exact store coordinates in Tikapur, Kailali, Nepal.
- 🔑 **Admin Portal**: Secret access key portal for managing product inventories, categories, customer orders, and wholesale pricing.
- ⚡ **Performance & SEO Optimized**: Pre-configured with meta tags, Open Graph card metadata, Twitter Cards, Schema.org JSON-LD structured data, clean `sitemap.xml`, `robots.txt`, SVG Favicon, image lazy loading, and lightweight bundles.

---

## 🚀 GitHub Pages Deployment Settings

The project is fully pre-configured for automated **GitHub Pages** deployment via **GitHub Actions**.

### 1. Repository Setup & Base Path
- `vite.config.ts` uses `base: './'`, allowing the app to run seamlessly on both custom domains (e.g. `https://manastraders.com.np`) or GitHub subpath repository URLs (e.g. `https://username.github.io/repository-name/`).

### 2. Single Page Application (SPA) 404 Routing
- A custom `public/404.html` redirect script is included. When users access sub-routes directly, GitHub Pages serves `404.html`, which redirects to the main entry point while maintaining the route path.

### 3. Automated GitHub Actions Workflow
The repository includes `.github/workflows/deploy.yml` which automatically builds and deploys the app on every `push` to the `main` branch.

#### How to Enable GitHub Pages in Repository Settings:
1. Push this project repository to **GitHub**.
2. Go to your GitHub Repository -> **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. Set up your repository secrets (see Supabase Configuration below).
5. Trigger a push to `main` branch or manually trigger the workflow under **Actions** -> **Deploy Manas Traders App to GitHub Pages**.

---

## 🛠️ Environment & Supabase Setup

This application uses **Supabase** for database storage (storing contact inquiries, orders, product inventory, and customer messages).

### 1. Environment Variables (`.env` or GitHub Secrets)
Create a `.env` file in the project root (or set these secrets in GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**):

```env
VITE_SUPABASE_URL=https://your-supabase-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 2. Supabase SQL Schema Setup
Execute the SQL script provided in `supabase_schema.sql` inside your Supabase SQL Editor:

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Open **SQL Editor**.
3. Paste the contents of `supabase_schema.sql`.
4. Click **Run** to create the tables (`contact_inquiries`, `orders`, `products`, `categories`) and set up Row Level Security (RLS) policies.

---

## 🔍 SEO, Social Sharing & Optimization

- **Meta Tags**: Configured in `index.html` and dynamic client-side `SEO.tsx` component.
- **Open Graph & Twitter Cards**: Configured with social media preview images and descriptions.
- **Schema.org Structured Data**:
  - `GroceryStore` schema with location (`Tikapur, Kailali`), geo coordinates (`28.5132, 81.1186`), phones (`+977 9848500665`, `+977 9824600477`), and operating hours.
  - `WebSite` schema with site search action.
- **Sitemap**: Available at `/sitemap.xml`.
- **Robots.txt**: Available at `/robots.txt`.
- **Favicon**: Clean vector SVG favicon stored at `/favicon.svg`.
- **Lazy Loading**: `loading="lazy"` enabled for all product image assets.

---

## 💻 Local Development Instructions

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/manas-traders.git
   cd manas-traders
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Verify TypeScript & Linting:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 📞 Store Contact & Business Info

- **Store Name**: Manas Traders (मनास् ट्रेडर्स)
- **Location**: Main Market Road, Tikapur-01, Kailali, Sudurpashchim Province, Nepal
- **Primary Phone / WhatsApp**: +977 9848500665
- **Secondary Phone**: +977 9824600477
- **Official Email**: info@manastraders.com.np
- **Store Hours**:
  - Sunday - Friday: 6:00 AM - 8:30 PM
  - Saturday: 7:00 AM - 7:00 PM

---

© 2026 Manas Traders Tikapur Kailali Nepal. All Rights Reserved.
