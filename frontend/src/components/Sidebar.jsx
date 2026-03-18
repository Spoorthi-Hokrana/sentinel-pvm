import { Link, useLocation } from 'react-router-dom';
import {
    Leaf,
    LayoutDashboard,
    Map,
    ShieldCheck,
    FileText,
    Award,
    Settings,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'My Fields', path: '/fields' },
    { icon: ShieldCheck, label: 'Verifications', path: '/benchmark' },
    { icon: FileText, label: 'Reports', path: '/stats' },
    { icon: Award, label: 'Certificates', path: '/verify' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-sage z-40">
                {/* Logo */}
                <div className="px-6 py-8">
                    <Link to="/" className="flex items-center gap-3">
                        <Leaf className="w-6 h-6 text-sentinel-500" />
                        <span className="font-editorial text-lg text-soil">Sentinel</span>
                        <span className="text-[9px] font-mono font-semibold bg-sentinel-50 text-sentinel-600 px-2 py-0.5 rounded-full border border-sentinel-200">
                            PRO
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${active
                                        ? 'bg-sentinel-50 text-sentinel-700 font-semibold border-l-[3px] border-sentinel-500'
                                        : 'text-moss hover:bg-ivory'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${active ? 'text-sentinel-600' : 'text-moss/60'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="px-6 py-6 border-t border-sage">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sentinel-100 flex items-center justify-center">
                            <span className="text-sentinel-600 font-semibold text-sm">JM</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-soil truncate">John Mitchell</p>
                            <p className="text-xs text-moss truncate">Green Valley Ranch</p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-sentinel-500" />
                    </div>
                </div>
            </aside>

            {/* Mobile bottom tab bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sage z-40 px-2 py-2">
                <div className="flex items-center justify-around">
                    {navItems.slice(0, 5).map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${active ? 'text-sentinel-600' : 'text-moss/50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[9px] font-mono">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}