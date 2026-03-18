import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import AppPage from './pages/AppPage';
import Technical from './pages/Technical';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollToTop />
      <Routes>
        {/* Landing — marketing site */}
        <Route path="/" element={<><Navbar /><Landing /></>} />

        {/* App pages — shared top bar shell */}
        <Route element={<AppShell />}>
          <Route path="/app" element={<AppPage />} />
          <Route path="/technical" element={<Technical />} />
        </Route>

        {/* Redirects — old routes point to new ones */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        <Route path="/benchmark" element={<Navigate to="/technical" replace />} />
        <Route path="/stats" element={<Navigate to="/app" replace />} />
        <Route path="/verify" element={<Navigate to="/app" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SmoothScroll>
  );
}