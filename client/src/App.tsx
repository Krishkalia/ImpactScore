import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Generated Pages
import { PageLoader } from './components/Loader';
import { ImpactscoreHomepage } from './pages/generated/ImpactscoreHomepage';
import { CharitySelection } from './pages/generated/CharitySelection';
import { UserDashboard } from './pages/generated/UserDashboard';
import { DrawResults } from './pages/generated/DrawResults';
import { SubscriptionSuccess } from './pages/generated/SubscriptionSuccess';
import { AdminDashboard } from './pages/generated/AdminDashboard';
import { DrawManagement } from './pages/generated/DrawManagement';
import { CharityManagement } from './pages/generated/CharityManagement';
import { UserManagement } from './pages/generated/UserManagement';
import { WinnerVerification } from './pages/generated/WinnerVerification';
import { ReportsAnalytics } from './pages/generated/ReportsAnalytics';
import { AdminSidebar } from './components/AdminSidebar';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { SubscriptionPlans } from './pages/generated/SubscriptionPlans';

const Navbar = () => {
  const { user, subscription, logout } = useAuth();
  
  return (
    <nav className="bg-surface-container-lowest fixed top-0 w-full z-50 shadow-sm border-none">
      <div className="flex justify-between items-center px-xl py-md w-full max-w-7xl mx-auto">
        <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary">ImpactScore</Link>
        <div className="hidden md:flex gap-xl items-center h-full">
          <NavLink to="/" end className={({ isActive }) => `font-body-md text-body-md transition-all duration-200 py-md border-b-2 ${isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'}`}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `font-body-md text-body-md transition-all duration-200 py-md border-b-2 ${isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'}`}>Dashboard</NavLink>
          <NavLink to="/charities" className={({ isActive }) => `font-body-md text-body-md transition-all duration-200 py-md border-b-2 ${isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'}`}>Charities</NavLink>
          <NavLink to="/draws" className={({ isActive }) => `font-body-md text-body-md transition-all duration-200 py-md border-b-2 ${isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'}`}>Draws</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `font-body-md text-body-md transition-all duration-200 py-md border-b-2 ${isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'}`}>Admin Hub</NavLink>
          )}
        </div>
        <div className="flex items-center gap-lg">
          {user ? (
            <div className="flex items-center gap-md">
              {user?.role !== 'admin' && subscription?.status !== 'active' && (
                <Link to="/subscribe" className="bg-win-gold text-dark-slate px-md py-sm rounded-lg font-title-sm text-label-md shadow-md hover:scale-[1.02] transition-transform duration-200 uppercase tracking-wider hidden sm:block">
                  Upgrade Plan
                </Link>
              )}
              <button onClick={logout} className="bg-charcoal text-white px-lg py-sm rounded-lg font-title-md text-body-md hover:scale-[1.02] transition-transform duration-200">Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-md">
              <Link to="/login" className="text-primary font-title-md text-body-md hover:text-hero-blue-dark transition-colors duration-200 px-sm">Sign In</Link>
              <Link to="/register" className="bg-primary text-white px-lg py-sm rounded-lg font-title-md text-body-md hover:bg-hero-blue-dark hover:scale-[1.02] transition-all duration-200 shadow-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-dark-slate text-subtle-gray border-t border-charcoal/30">
    <div className="flex flex-col items-center gap-xl py-3xl px-xl w-full">
      <div className="font-headline-sm text-headline-sm font-bold text-surface-container-lowest">ImpactScore</div>
      <div className="flex flex-wrap justify-center gap-2xl">
        <Link className="text-subtle-gray hover:text-white font-body-sm transition-colors duration-200" to="/">Ready to make an impact?</Link>
        <Link className="text-subtle-gray hover:text-white font-body-sm transition-colors duration-200" to="#">Privacy Policy</Link>
        <Link className="text-subtle-gray hover:text-white font-body-sm transition-colors duration-200" to="#">Terms of Service</Link>
      </div>
      <p className="font-body-sm text-body-sm mt-xl opacity-60">© 2026 ImpactScore. All rights reserved.</p>
    </div>
  </footer>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

// Admin Layout Component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 w-full relative md:ml-64">
        {children}
      </div>
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-body-sm shadow-xl border border-outline-variant/20 rounded-lg',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1a1f24',
          },
          success: {
            iconTheme: { primary: '#0f766e', secondary: '#ffffff' },
          },
        }} 
      />
      <div className="min-h-screen bg-background flex flex-col font-body-md text-on-background overflow-x-hidden">
        <Navbar />
        <main className="flex-grow pt-[72px]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><ImpactscoreHomepage /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/subscribe" element={<PageWrapper><SubscriptionPlans /></PageWrapper>} />
              <Route path="/charities" element={<PageWrapper><CharitySelection /></PageWrapper>} />
              <Route path="/draws" element={<PageWrapper><DrawResults /></PageWrapper>} />
              <Route path="/subscribe/success" element={<PageWrapper><SubscriptionSuccess /></PageWrapper>} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageWrapper><UserDashboard /></PageWrapper>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly>
                  <PageWrapper>
                    <AdminLayout>
                      <Routes>
                        <Route path="" element={<AdminDashboard />} />
                        <Route path="draws" element={<DrawManagement />} />
                        <Route path="charities" element={<CharityManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="winners" element={<WinnerVerification />} />
                        <Route path="reports" element={<ReportsAnalytics />} />
                      </Routes>
                    </AdminLayout>
                  </PageWrapper>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
}

function AppRoutes() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
