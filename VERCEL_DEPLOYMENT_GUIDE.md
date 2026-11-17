# Vercel Deployment Guide — Munazza Irfan Studio Portfolio

This repository is fully optimized and configured for seamless **1-Click deployment on Vercel**.

---

## 🚀 Quick Deployment Options

### Option A: Deploy via GitHub & Vercel Dashboard (Recommended)

1. **Commit and Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment and serverless API"
   git push origin main
   ```

2. **Open Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Sign in with your GitHub account.

3. **Import Project**:
   - Select your repository (`munazza-portfolio` or similar).

4. **Verify Project Settings** (Vercel automatically detects these from `vercel.json`):
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (or `bun install`)

5. **Environment Variables (Optional)**:
   - Your `firebase-applet-config.json` is already embedded and tracked, so Firebase works immediately out of the box.
   - If you wish to override with custom environment variables, you can optionally set:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `ADMIN_SECRET_KEY` (Optional secret key for backend API access)

6. **Click "Deploy"**:
   - In less than 1 minute, your website will be live with a production URL like `https://munazza-portfolio.vercel.app`!

---

### Option B: Deploy via Vercel CLI (Command Line)

If you have the Vercel CLI installed:
```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy to Production
npx vercel --prod
```

---

## 🛡️ Architecture & Features Configured for Vercel

1. **SPA Rewrites (`vercel.json`)**:
   - Configured with `/(.*) -> /index.html` rewrites so that reloading on any section, modal, or the secret `#admin` portal stays on the current view without 404 errors.
2. **Serverless API (`api/index.ts`)**:
   - Handled via `/api/(.*) -> /api` to route backend endpoints seamlessly to Vercel Serverless Functions.
3. **Dual Cloud Persistence**:
   - **Primary Cloud Layer**: Google Cloud Firestore (global, zero-maintenance, serverless).
   - **Secondary API Layer**: Express REST endpoints with safe temporary directory handling (`/tmp`) and fallback protection.
4. **Static Asset Caching**:
   - All 21 high-definition video reels and graphic design mockups in `public/assets/aistudio` are bundled and cached on Vercel's Global Edge Network.

---

## 🔑 Accessing the Admin Portal on Production

1. Open your live Vercel URL (e.g. `https://your-portfolio.vercel.app`).
2. Press and hold the **`MI` logo** in the top navigation bar or the footer for **10 seconds**.
   *(A subtle orange progress indicator will complete).*
3. Enter your administrator credentials (`munazza.00077@gmail.com` or `rajahuzaifa015166@gmail.com`).
4. Manage projects, skills, competencies, testimonials, and client inquiries securely!
