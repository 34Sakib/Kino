import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

// Layout Components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { CartDrawer } from './components/cart/CartDrawer';

// Shared Popups
import { ActivityPopup } from './components/shared/ActivityPopup';
import { ExitIntentPopup } from './components/shared/ExitIntentPopup';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccess } from './pages/OrderSuccess';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';

// New Pages
import { SearchPage } from './pages/SearchPage';
import { SalePage } from './pages/SalePage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { FAQPage } from './pages/FAQPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PolicyPage } from './pages/PolicyPage';

// Scroll Restoration Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Route wrapper for page transitions
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* Toast Alerts System */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0D0D0D',
            color: '#FFFFFF',
            borderRadius: '2px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            letterSpacing: '0.02em',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 16px',
          },
          success: {
            iconTheme: {
              primary: '#E8B86D',
              secondary: '#0D0D0D',
            },
          },
          error: {
            style: {
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }
          }
        }}
      />

      {/* Dynamic Promotional Banner */}
      <AnnouncementBar />

      {/* Sticky Floating Navbar */}
      <Navbar />

      {/* Global Slide-In Side Cart Drawer */}
      <CartDrawer />

      {/* Real-time Sales proof activity ticker */}
      <ActivityPopup />

      {/* Exit-Intent coupon form popup */}
      <ExitIntentPopup />

      {/* Main Content Router */}
      <main className="flex-1 w-full bg-white">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            
            {/* Shop & Categories */}
            <Route path="/shop" element={<AnimatedPage><Shop /></AnimatedPage>} />
            <Route path="/shop/:categorySlug" element={<AnimatedPage><Shop /></AnimatedPage>} />
            
            {/* Product Detail */}
            <Route path="/product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />
            
            {/* Cart & Checkout */}
            <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
            <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
            <Route path="/order-success" element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
            
            {/* User Portals */}
            <Route path="/account" element={<AnimatedPage><AccountPage /></AnimatedPage>} />
            <Route path="/wishlist" element={<AnimatedPage><WishlistPage /></AnimatedPage>} />
            
            {/* Editorial Content */}
            <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
            <Route path="/blog" element={<AnimatedPage><BlogPage /></AnimatedPage>} />
            <Route path="/blog/:slug" element={<AnimatedPage><BlogPostPage /></AnimatedPage>} />

            {/* New Pages */}
            <Route path="/search" element={<AnimatedPage><SearchPage /></AnimatedPage>} />
            <Route path="/sale" element={<AnimatedPage><SalePage /></AnimatedPage>} />
            <Route path="/track-order" element={<AnimatedPage><TrackOrderPage /></AnimatedPage>} />
            <Route path="/faq" element={<AnimatedPage><FAQPage /></AnimatedPage>} />
            <Route path="/size-guide" element={<AnimatedPage><SizeGuidePage /></AnimatedPage>} />
            <Route path="/gift-cards" element={<AnimatedPage><GiftCardsPage /></AnimatedPage>} />
            <Route path="/reviews" element={<AnimatedPage><ReviewsPage /></AnimatedPage>} />
            <Route path="/policies/returns" element={<AnimatedPage><PolicyPage /></AnimatedPage>} />
            <Route path="/policies/privacy" element={<AnimatedPage><PolicyPage /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Mobile Tab-bar shortcut menu */}
      <MobileTabBar />

    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
