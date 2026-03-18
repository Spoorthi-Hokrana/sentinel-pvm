import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Benchmark from './pages/Benchmark';
import Stats from './pages/Stats';
import Verify from './pages/Verify';

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[260px] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <SmoothScroll>
      <CustomCursor />
      {isLanding && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div {...pageTransition}>
                <Landing />
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SidebarLayout>
                <motion.div {...pageTransition}>
                  <Dashboard />
                </motion.div>
              </SidebarLayout>
            }
          />
          <Route
            path="/benchmark"
            element={
              <SidebarLayout>
                <motion.div {...pageTransition}>
                  <Benchmark />
                </motion.div>
              </SidebarLayout>
            }
          />
          <Route
            path="/stats"
            element={
              <SidebarLayout>
                <motion.div {...pageTransition}>
                  <Stats />
                </motion.div>
              </SidebarLayout>
            }
          />
          <Route
            path="/verify"
            element={
              <SidebarLayout>
                <motion.div {...pageTransition}>
                  <Verify />
                </motion.div>
              </SidebarLayout>
            }
          />
        </Routes>
      </AnimatePresence>
    </SmoothScroll>
  );
}