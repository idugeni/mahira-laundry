# Mahira Laundry — Official Platform

<div align="center">
  <img src="https://mahira-laundry.vercel.app/logo.png" alt="Mahira Laundry Logo" width="120" />
  <p><strong>Cucian Bersih, Hidup Nyaman.</strong></p>
  <p><i>The next-generation premium laundry management ecosystem.</i></p>
</div>

---

## 🌟 Overview

**Mahira Laundry** is a high-end, full-stack laundry management platform designed to deliver a seamless experience for both customers and business owners. Built with a focus on speed, aesthetics, and reliability, it bridges the gap between premium laundry services and modern digital convenience.

## 🚀 Key Modules

### 📱 Customer PWA (Progressive Web App)
A mobile-first experience for customers to:
- **Real-time Tracking:** Monitor the status of orders from pickup to delivery.
- **Loyalty Program:** Earn points and climb tiers (Bronze, Silver, Gold, Platinum).
- **Service Explorer:** Discover premium treatments for shoes, dry cleaning, and express services.

### ⚡ Superadmin & Staff Dashboard
A powerful command center featuring:
- **Intelligent Queueing:** Manage orders and staff assignments with ease.
- **Financial Analytics:** Real-time revenue tracking and performance insights.
- **Inventory & Outlet Management:** Centralized control over multiple business locations.

### 💼 Business Package System
A dedicated portal for entrepreneurs to explore franchise-like opportunities:
- **ROI Analytics:** Transparent investment plans and profit estimations.
- **Automated Setup:** "Autopilot" systems for new partners.

## 🛠 Tech Stack

Our ecosystem is built using industry-leading technologies:

- **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/) with [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack).
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL with RLS).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a sleek, modern UI.
- **Animations:** [Motion (Framer Motion)](https://motion.dev/) for smooth, high-end transitions.
- **Infrastructure:** [Vercel](https://vercel.com/) for high-performance deployment.

## 📦 Getting Started

### Prerequisites
- Node.js (Latest stable version)
- NPM or PNPM

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/idugeni/mahira-laundry.git
   cd mahira-laundry
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in `apps/web/` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

---

<div align="center">
  <p>© 2026 Mahira Laundry Group. All rights reserved.</p>
  <p>
    <a href="https://mahira-laundry.vercel.app">Official Website</a> • 
    <a href="https://github.com/idugeni/mahira-laundry">GitHub</a>
  </p>
</div>
