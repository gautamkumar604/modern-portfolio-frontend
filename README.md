# Professional Developer Portfolio — Frontend

A high-performance, dynamic, and fully customizable developer portfolio web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**. 

It features a modern glassmorphic public presentation site, a dynamic project showcase, SEO optimization, and a secure **Admin Management Panel** integrated with a NestJS REST API backend.

---

## 🚀 Key Features

### 🌟 Public Portfolio Site
- **Dynamic Hero Section**: Interactive hero banner with animated role switcher and dynamic statistics counter.
- **About & Bio**: Detailed background story, highlighted metrics, and downloadable CV/resume support.
- **Interactive Skills Matrix**: Skills categorized by domain (Frontend, Backend, DevOps, Tools) with proficiency indicators and custom icons.
- **Projects Showcase & Dynamic Details (`/projects/[slug]`)**:
  - Filterable by tags and technologies.
  - Dedicated SEO-friendly detail pages with live demo links, repository badges, and rich media galleries.
- **Career & Education Timeline**: Chronological presentation of work experience, roles, achievements, and educational qualifications.
- **Services & Offerings**: Overview of consulting, development, and architectural services.
- **Interactive Contact Form**: Inbound messaging with real-time feedback, field validation, and direct backend API dispatch.
- **Maintenance Mode Detection**: Automatic presentation of a maintenance screen whenever toggled from the admin panel.
- **Resilient API Isolation**: All public section queries run concurrently with graceful error handling so the site remains functional even if specific endpoints are unseeded.
- **Theme Support**: Dark mode by default with seamless light/dark mode theme switching via CSS variables.

### 🛡️ Admin Management Panel (`/admin`)
- **Secure Authentication (`/admin/login`)**: JWT-based session protection with route guards and automatic redirect workflows.
- **Dashboard Overview (`/admin/dashboard`)**: Quick operational metrics and management shortcuts.
- **Full CRUD Management Modules**:
  - **Profile (`/admin/profile`)**: Manage personal details, bio, avatar, resume URL, and titles.
  - **Projects (`/admin/projects`)**: Create, edit, reorder, feature, and delete portfolio projects.
  - **Skills (`/admin/skills`)**: Manage technical skills, categories, proficiency bars, and icons.
  - **Experience (`/admin/experience`)**: Add and edit career milestones, responsibilities, and dates.
  - **Education (`/admin/education`)**: Manage academic degrees, universities, and graduation years.
  - **Services (`/admin/services`)**: Manage offered freelance or engineering services.
  - **Social Links (`/admin/social-links`)**: Manage social profile links (GitHub, LinkedIn, Twitter/X, Discord, etc.).
  - **Messages Inbox (`/admin/messages`)**: Read, filter by status, mark read/unread, and delete inbound client messages.
  - **Site Settings (`/admin/site-settings`)**: Control site branding, default SEO titles/descriptions, OpenGraph metadata, and site-wide maintenance mode.
- **File & Media Uploads**: Built-in multipart file uploader supporting project covers, avatars, and resume documents.

### 🔍 SEO & Web Standards
- **Dynamic Metadata**: Server-side `generateMetadata` fetching custom titles, OpenGraph images, and descriptions from the database.
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Automatically indexed project URLs and main pages via `src/app/sitemap.ts`.
- **Crawler Directives (`/robots.txt`)**: Search engine robot rules managed via `src/app/robots.ts`.
- **Security Headers**: Standard headers configured in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `HSTS`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) & CSS keyframe animations |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | `Outfit` & `JetBrains Mono` via `next/font/google` |
| **Networking** | Native Fetch-based type-safe API client |

---

## 📁 Project Directory Structure

```text
frontend/
├── public/                 # Static assets, favicon, and icons
├── src/
│   ├── app/                # Next.js App Router routes & pages
│   │   ├── admin/          # Admin panel protected pages & login
│   │   │   ├── dashboard/  # Admin metrics and overview
│   │   │   ├── messages/   # Contact inbox manager
│   │   │   ├── profile/    # Profile & bio settings
│   │   │   ├── projects/   # Projects CRUD
│   │   │   ├── skills/     # Skills CRUD
│   │   │   ├── experience/ # Experience CRUD
│   │   │   ├── education/  # Education CRUD
│   │   │   ├── services/   # Services CRUD
│   │   │   ├── site-settings/# Global site & SEO settings
│   │   │   ├── social-links/# Social media links manager
│   │   │   ├── login/      # Admin authentication page
│   │   │   └── layout.tsx  # Protected admin layout & sidebar
│   │   ├── projects/       # Dynamic project detail pages
│   │   │   └── [slug]/     # Project detail route
│   │   ├── globals.css     # Tailwind v4 imports & theme design tokens
│   │   ├── layout.tsx      # Root layout with ThemeProvider & dynamic metadata
│   │   ├── page.tsx        # Public portfolio landing page
│   │   ├── not-found.tsx   # Custom 404 error page
│   │   ├── robots.ts       # Dynamic robots.txt configuration
│   │   └── sitemap.ts      # Dynamic XML sitemap generator
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific tables, modals, cards, layouts
│   │   ├── layout/         # Public Navbar, Footer, and Navigation
│   │   ├── sections/       # Hero, About, Skills, Projects, Contact sections
│   │   └── ui/             # Badges, Buttons, Inputs, Dialogs, Error Fallbacks
│   ├── context/            # React Context providers (AuthContext, ThemeContext)
│   ├── lib/
│   │   ├── api/            # API client with JWT bearer handling & error classes
│   │   ├── services/       # Feature-specific API service modules
│   │   └── utils/          # Formatting helpers, image URL resolvers, date utils
│   └── types/              # TypeScript interface & type definitions
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js config (rewrites & security headers)
├── package.json            # Scripts & project dependencies
├── postcss.config.mjs      # PostCSS configuration for Tailwind v4
└── tsconfig.json           # TypeScript configuration
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the `frontend` root directory (copy from `.env.example`):

```bash
cp .env.example .env.local
```

### Environment Variables Reference

| Variable | Description | Default (Local Dev) |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the deployed frontend (used for sitemaps & OpenGraph) | `http://localhost:3000` |

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **npm**, **pnpm**, or **yarn**
- **Backend Service**: Ensure the NestJS backend service is running (default port `5000`).

### 2. Installation
Install project dependencies:

```bash
npm install
```

### 3. Run the Development Server
Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### 4. Build for Production
Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### 5. Linting
Run ESLint to check for code quality and syntax issues:

```bash
npm run lint
```

---

## 🔐 Admin Panel Access

1. Navigate to `/admin/login` (e.g. `http://localhost:3000/admin/login`).
2. Log in using your admin credentials (configured on the backend).
3. Once authenticated:
   - Your JWT token is stored securely in browser storage.
   - The admin sidebar provides access to manage every piece of content displayed across the public site.
   - Any updates made in the admin panel are immediately reflected across the portfolio.

---

## 🔄 Backend Integration & Asset Proxying

- **API Requests**: The frontend communicates with the backend via `src/lib/api/client.ts`. Public requests do not require authorization, while requests under `/admin` automatically attach the `Authorization: Bearer <token>` header.
- **Media Uploads Proxy**: `next.config.ts` includes a reverse-proxy rewrite:
  ```ts
  source: '/uploads/:path*' -> destination: '${BACKEND_HOST}/uploads/:path*'
  ```
  This allows media files (images, resumes) hosted by the backend to be served seamlessly under the frontend domain without CORS complications.

---

## 📄 License

This project is private and proprietary. All rights reserved.
