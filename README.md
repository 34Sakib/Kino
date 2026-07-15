<img width="1920" height="9672" alt="image" src="https://github.com/user-attachments/assets/2ffb4ca0-1d00-49f4-9799-38c8b9d6d476" />

# Kino Atelier — Sculptural Home Sanctuary & Decor

An online e-commerce atelier dedicated to curated interior pieces, handcrafted from single-source raw travertine, white oak, and fluted earthenware.

This project consists of a high-fidelity Single Page Application (SPA) frontend and a Laravel backend complete with an administrative dashboard powered by Filament.

---

## Architecture & Tech Stack

The application is split into two primary components:

### 1. Frontend (`Kino-Frontend`)
A highly interactive, client-side React application focused on luxury design aesthetics, dynamic animations, and smooth layout transitions.
- **Core**: React 19, Vite 8, React Router DOM 7.
- **Styling**: Tailwind CSS (Utility classes) & Custom CSS Tokens (loaded for base overrides, luxury animations, and typography reset support).
- **State Management**: Zustand (lightweight stores handling cart drawers, wishlists, and account sessions).
- **Animations**: Framer Motion (page transitions, Ken Burns zoom-outs, active badge pops).
- **Payment & Security**: Stripe Checkout integration.
- **Icons**: Lucide React.

### 2. Backend (`backend`)
A Laravel 12 JSON API server that handles products, shipping, coupons, order histories, user sessions, and reviews, managed by an internal admin panel.
- **Core**: PHP 8.2+, Laravel 12.
- **Admin Dashboard**: Filament v5.6 (handling content management, product variant specifications, shipment logs, and coupon utilities).
- **Media Handling**: Spatie Laravel MediaLibrary (managing product galleries, media uploads).
- **Access Control**: Spatie Laravel Permission (managing admin roles).
- **Database**: SQLite (default setup) or MySQL.
- **Integrations**: Stripe PHP SDK (for transaction verification).

---

## Directory Structure

```text
├── Kino-Frontend/          # React + Vite client-side SPA
│   ├── src/
│   │   ├── components/     # Reusable layout, product, cart, & shared UI elements
│   │   ├── data/           # Mock data and review content
│   │   ├── pages/          # Home, Shop, Product Details, Checkout, Blog pages
│   │   ├── store/          # Zustand state definitions (cartStore, wishlistStore)
│   │   ├── styles/         # Global styles, layout resets, animations, and CSS variables
│   │   └── utils/          # Axios API config and mapping helpers
│   ├── index.html          # Shell layout (loads Google Fonts and Tailwind CDN)
│   └── package.json
│
└── backend/                # Laravel 12 REST API + Filament Admin
    ├── app/
    │   ├── Filament/       # Filament Resource classes and schemas (Categories, Products, etc.)
    │   ├── Http/           # API Controllers (Cart, Checkout, Coupons)
    │   └── Models/         # Eloquent database definitions (Product, ProductVariant, Shipment, etc.)
    ├── database/
    │   ├── migrations/     # Table schema structures
    │   └── seeders/        # Pre-seeded products, categories, reviews, and test account seeds
    ├── composer.json
    └── artisan
```

---

## Key Features

- **Dynamic Hero Section**: A high-end visual welcome with a Ken Burns zoom animation, custom text overlays, and light transparent overlays designed for architectural visibility.
- **Dynamic Header Readability**: The navbar automatically detects scrolling depth and routes, changing from a crisp transparent white text configuration (over dark sections) to elegant charcoal typography on a white/translucent backdrop.
- **Live Search Suggestions**: An interactive search input with autocomplete suggestions filtered directly against database products, featuring focused text highlights.
- **Atelier Cart & Wishlist Drawers**: Seamless slide-in sidebars to manage selected design items, with active badge-pop count animations and custom offset layout constraints.
- **Filament Admin Dashboard**: Fully featured panel to track active listings, coupon codes, user addresses, stock levels, and order fulfillments.

---

## Installation & Setup

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Composer**: `v2.x` or higher
- **PHP**: `v8.2` or higher

---

### Step 1: Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Generate key and build database (uses SQLite by default, which auto-creates `database/database.sqlite`):
   ```bash
   php artisan key:generate
   ```
5. Run migrations and database seeders:
   ```bash
   php artisan migrate --seed
   ```
6. Start the API server:
   ```bash
   php artisan serve
   ```
   The backend should now be running on `http://127.0.0.1:8000`.

---

### Step 2: Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd ../Kino-Frontend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend should now be running on `http://localhost:5173`. Open this URL in your web browser.

---

## Recent Visual Upgrades
- **Scroll Restoration**: Automatic instant scroll-to-top on page transitions.
- **Navbar Search focused readability**: Input text switches to a dark color when selected, ensuring readable input contrast when focused.
- **Count badges styling**: Fixed overlapping transparency bugs, standardizing cart and wishlist count badges to use solid, highly legible background colors and shadows.
