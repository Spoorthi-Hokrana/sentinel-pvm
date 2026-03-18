import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { num: '01', label: 'Home', path: '/' },
  { num: '02', label: 'Dashboard', path: '/dashboard' },
  { num: '03', label: 'Performance', path: '/benchmark' },
  { num: '04', label: 'Farm Stats', path: '/stats' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-sage'
            : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sentinel-500" />
            <span className="text-sm uppercase tracking-wider font-medium text-soil">
              Sentinel
            </span>
          </Link>

          {/* Center */}
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-500" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-moss">
              Network Active
            </span>
          </div>

          {/* Right */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm uppercase tracking-wider font-medium text-soil hover:text-sentinel-500 transition-colors duration-300"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="fixed inset-0 z-[100] bg-forest flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-12 py-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                Navigation
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-white/60 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            {/* Center nav links */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {i > 0 && <div className="h-px bg-white/10" />}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setTimeout(() => navigate(link.path), 300);
                    }}
                    className={`group flex items-baseline gap-6 py-6 md:py-8 w-full text-left transition-all duration-500 hover:translate-x-4 ${location.pathname === link.path
                        ? 'text-sentinel-400'
                        : 'text-white hover:text-sentinel-400'
                      }`}
                  >
                    <span className="text-sm font-mono text-sentinel-500">
                      {link.num}
                    </span>
                    <span className="text-5xl md:text-7xl lg:text-8xl font-editorial">
                      {link.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between px-6 md:px-12 py-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                Built on Polkadot
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}