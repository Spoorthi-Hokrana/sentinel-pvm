import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Benchmark from "./pages/Benchmark";
import Stats from "./pages/Stats";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-sentinel-bg text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Landing />
              </AnimatedPage>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AnimatedPage>
                <Dashboard />
              </AnimatedPage>
            }
          />
          <Route
            path="/benchmark"
            element={
              <AnimatedPage>
                <Benchmark />
              </AnimatedPage>
            }
          />
          <Route
            path="/stats"
            element={
              <AnimatedPage>
                <Stats />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
