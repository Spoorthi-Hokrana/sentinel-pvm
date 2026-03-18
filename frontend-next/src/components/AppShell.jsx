import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, ExternalLink } from 'lucide-react';

const TABS = [
  { to: '/app', label: 'App' },
  { to: '/technical', label: 'Technical' },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      
      {/* ═══ STICKY TOP BAR ═══ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl 
                          border-b border-sage/40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 
                        h-14 flex items-center justify-between">

          {/* LEFT — Logo (links home) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-sentinel-500 rounded-lg flex items-center 
                            justify-center group-hover:bg-sentinel-600 
                            transition-colors duration-300">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] 
                             text-soil font-medium hidden sm:inline">
              Sentinel
            </span>
          </Link>

          {/* CENTER — Two tabs only */}
          <nav className="flex items-center gap-1 bg-ivory rounded-lg 
                          border border-sage/40 p-0.5">
            {TABS.map((tab) => {
              const isActive = pathname === tab.to;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`px-5 py-1.5 rounded-md text-[11px] font-mono 
                              uppercase tracking-[0.15em] transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-sentinel-700 shadow-sm font-medium' 
                      : 'text-moss hover:text-soil'
                    }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Status + Home link */}
          <div className="flex items-center gap-3">
            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 
                            bg-sentinel-50 rounded-full border border-sentinel-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full 
                                 rounded-full bg-sentinel-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 
                                 bg-sentinel-500" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider 
                               text-sentinel-700">
                Paseo
              </span>
            </div>

            {/* Home link */}
            <Link 
              to="/"
              className="flex items-center gap-1 text-[10px] font-mono 
                         uppercase tracking-wider text-moss/50 
                         hover:text-sentinel-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ PAGE CONTENT ═══ */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
