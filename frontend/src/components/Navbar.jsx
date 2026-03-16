import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { client } from "../config/thirdweb";
import { paseoAssetHub } from "../config/chain";
import ChainBadge from "./ChainBadge";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/benchmark", label: "Benchmark" },
  { to: "/stats", label: "Stats" },
];

function NavLink({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        active ? "text-sentinel-green" : "text-white/60 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

const walletTheme = darkTheme({
  colors: {
    modalBg: "#0D1117",
    primaryButtonBg: "#00FF94",
    primaryButtonText: "#080B14",
    borderColor: "#1A2332",
  },
});

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
            <path
              d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
              stroke="#00FF94"
              strokeWidth="2"
              fill="#00FF94"
              fillOpacity="0.1"
            />
            <path
              d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z"
              fill="#00FF94"
              fillOpacity="0.4"
            />
          </svg>
          <span className="font-display font-bold text-base tracking-tight text-white">
            SENTINEL<span className="text-sentinel-green">-PVM</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} {...l} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ChainBadge />
          {client && (
            <ConnectButton
              client={client}
              chain={paseoAssetHub}
              theme={walletTheme}
              connectButton={{ label: "Connect", style: { height: "36px", fontSize: "13px" } }}
            />
          )}
          <button
            className="md:hidden p-1.5 text-white/60 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/60 backdrop-blur-xl px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-white/70 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
