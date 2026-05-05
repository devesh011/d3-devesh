# 🚀 D3's Portfolio — Devesh Prajapati

A modern, full-stack developer portfolio built with **Next.js**, **MongoDB**, and **Three.js** — featuring a dynamic admin panel, animated UI, real-time content management, and PWA support.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## ✨ Features

- ⚡ **Hero Section** — Animated text effects with contact modal
- 🗂️ **Projects** — Dynamically managed via admin panel
- 💼 **Experience** — Timeline with scroll animations
- 🔐 **Admin Panel** — Protected with token-based auth (12hr access + 7day refresh)
- 📬 **Contact Form** — EmailJS + MongoDB message storage
- 🌐 **Hyperspeed Login** — Three.js WebGL background on admin login
- 📱 **PWA Support** — Installable on mobile and desktop
- 📱 **Fully Responsive** — Mobile-first design

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Other |
|---|---|---|---|
| Next.js 16 | Next.js API Routes | MongoDB Atlas | Three.js |
| React 19 | Node.js crypto | | Framer Motion |
| TypeScript | EmailJS | | TailwindCSS 4 |
| Tailwind CSS | | | Postprocessing |
| next-pwa | | | OGL |

---

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── layout.tsx            # Root layout
│   ├── admin-d3v/            # Admin panel (protected)
│   ├── admin-login/          # Login page with Hyperspeed bg
│   └── api/
│       ├── auth/             # Login API
│       ├── verify/           # Token verification
│       ├── refresh/          # Token refresh
│       ├── contact/          # Contact form messages
│       ├── projects/         # Projects CRUD
│       ├── experience/       # Experience CRUD
│       └── files/            # Public file listing
├── components/
│   ├── hero.tsx
│   ├── grid.tsx
│   ├── recentProjects.tsx
│   ├── experience.tsx
│   ├── approach.tsx
│   ├── footer.tsx
│   └── ui/
│       ├── Hyperspeed.tsx    # Three.js WebGL effect
│       ├── magicButton.tsx
│       ├── encrypted-text.tsx
│       └── ...
├── data/
│   └── index.ts              # Fallback static data
├── lib/
│   └── mongodb.ts            # DB connection
└── public/
    ├── images/               # Project images
    ├── icons/                # Tech icons
    ├── manifest.json         # PWA manifest
    └── favicon.ico
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- EmailJS account

### Installation

```bash
# Clone the repo
git clone https://github.com/devesh011/portfolio.git
cd portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` in root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_strong_password
ADMIN_SECRET=your_super_long_random_secret_key
```

Generate a secure `ADMIN_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Panel

Access the admin panel at `/admin-login`

**Features:**
- Manage projects (Add / Edit / Delete)
- Manage work experience (Add / Edit / Delete)
- View contact messages with search & sort
- Token-based auth (12hr access token + 7day refresh token)
- Keyboard navigation for messages

> ⚠️ Never share your admin credentials or `.env.local` file

---

## 📱 PWA (Progressive Web App)

Your portfolio is installable as a native app!

**On Mobile (Android/iOS):**
- Visit the live site
- Browser shows "Add to Home Screen" prompt
- Install and use like a native app ✅

**On Desktop (Chrome):**
- Visit the live site
- Click install icon in address bar ✅

**Shortcuts available after install:**
- Projects
- Contact
- Experience

> Note: PWA is disabled in development. Test on deployed Vercel site.

---

## 📦 Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in Vercel Dashboard:
   ```
   MONGODB_URI=...
   ADMIN_USERNAME=...
   ADMIN_PASSWORD=...
   ADMIN_SECRET=...
   ```
4. Deploy ✅

> **Note:** If you update `.env.local` locally, you must also update the variables in Vercel Dashboard and redeploy.

---

## 📧 EmailJS Setup

1. Create account at [emailjs.com](https://emailjs.com)
2. Create a service and template
3. Update in `hero.tsx`:
```ts
emailjs.sendForm(
  "your_service_id",
  "your_template_id",
  formRef.current,
  "your_public_key"
)
```

---

## 🌐 MongoDB Atlas Setup

1. Create cluster at [mongodb.com](https://mongodb.com)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (all IPs for Vercel)
4. Copy connection string to `MONGODB_URI`

---

## 📱 Responsive Design

| Device | Status |
|---|---|
| Mobile (320px+) | ✅ |
| Tablet (768px+) | ✅ |
| Desktop (1024px+) | ✅ |

---

## 🔒 Security

- Token-based authentication (no JWT library needed)
- 12 hour access token + 7 day refresh token
- Tokens signed with `ADMIN_SECRET` using SHA-256
- Environment variables never exposed to client
- `.env.local` excluded from Git

---

## 👨‍💻 Author

**Devesh Prajapati** (aka d3 / d3v8ll)

- GitHub: [@devesh011](https://github.com/devesh011)
- LinkedIn: [devesh-prajapati](https://www.linkedin.com/in/devesh-prajapati/)
- WhatsApp: [Chat](https://wa.me/918141864929)

---

## 📄 License

This project is for personal portfolio use only.
