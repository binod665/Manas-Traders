# Production Deployment Checklist — Manas Traders

Use this checklist prior to launching the website live on GitHub Pages or a custom domain (`https://manastraders.com.np`).

---

## 1. ⚙️ Pre-Deployment Verification

- [x] **TypeScript Compilation**: Run `npm run lint` (`tsc --noEmit`) — Passed cleanly with zero type errors.
- [x] **Production Bundle Build**: Run `npm run build` (`vite build`) — Passes with optimized static assets generated in `dist/`.
- [x] **Responsive UI Check**: Verified layout fluidity from 320px mobile screens up to 1440px+ desktop displays with touch-friendly 44px+ tap targets.
- [x] **404 Route Fallback**: SPA redirect script added at `public/404.html` to handle deep links on GitHub Pages smoothly.
- [x] **Base Path**: Configured as `base: './'` in `vite.config.ts` for relative asset loading on custom domains and subpaths.

---

## 2. 🔑 Supabase Database Configuration

- [ ] **Create Supabase Project**: Log into [Supabase Dashboard](https://supabase.com) and create a new project.
- [ ] **Run Database Migration**: Open SQL Editor in Supabase and run `supabase_schema.sql` to instantiate the required schema:
  - `contact_inquiries` table
  - `orders` table
  - `products` table
  - `categories` table
- [ ] **Configure Environment Variables**:
  Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into your `.env` file locally or inside **GitHub Repository -> Settings -> Secrets and variables -> Actions**.

---

## 3. 🚀 GitHub Pages Deployment Steps

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready release for Manas Traders"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/manas-traders.git
   git push -u origin main
   ```

2. **Enable GitHub Actions for Pages**:
   - Navigate to GitHub Repository -> **Settings** -> **Pages**.
   - Under **Build and Deployment**, set **Source** to **GitHub Actions**.

3. **Verify Deployment Pipeline**:
   - Open **Actions** tab on GitHub.
   - Observe `.github/workflows/deploy.yml` executing `npm ci` -> `npm run build` -> `upload-pages-artifact` -> `deploy-pages`.
   - Your site will automatically go live at your GitHub Pages URL or custom domain.

---

## 4. 🔍 SEO & Domain Setup Checklist

- [x] **Favicon**: Vector SVG favicon present at `public/favicon.svg`.
- [x] **Sitemap**: Clean `public/sitemap.xml` with canonical routes.
- [x] **Robots.txt**: `public/robots.txt` granting search crawlers permission to index main store pages while shielding admin portals.
- [x] **Schema.org Structured Data**: JSON-LD `GroceryStore` metadata injected into `index.html` featuring Tikapur store location, geo-coordinates, operating hours, and phone numbers (`+977 9848500665`, `+977 9824600477`).
- [x] **Open Graph & Twitter Cards**: Configured for Facebook, WhatsApp, and Twitter link previewing.
- [ ] **Custom Domain (Optional)**: If linking `manastraders.com.np`, add a `CNAME` record pointing to `YOUR_USERNAME.github.io` in your DNS provider and add `manastraders.com.np` under GitHub Repository Pages Settings.

---

## 5. 📞 Store Information Audit

- **Business Name**: Manas Traders (मनास् ट्रेडर्स)
- **Primary Phone**: `+977 9848500665` (WhatsApp direct enabled)
- **Secondary Phone**: `+977 9824600477`
- **Email**: `info@manastraders.com.np`
- **Location**: Main Market Road, Tikapur-01, Kailali, Sudurpashchim Province, Nepal
- **Hours**:
  - Sunday - Friday: 6:00 AM - 8:30 PM
  - Saturday: 7:00 AM - 7:00 PM
