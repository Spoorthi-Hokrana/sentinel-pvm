import { motion } from 'framer-motion';
import {
    Droplets,
    CheckCircle,
    MapPin,
    Trophy,
    TrendingUp,
    Bell,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import KPICard from './KPICard';
import FieldZone from './FieldZone';
import FeedItem from './FeedItem';
import { useEvents } from '../hooks/useEvents';

const weeklyData = [
    { day: 'Mon', count: 32 },
    { day: 'Tue', count: 41 },
    { day: 'Wed', count: 38 },
    { day: 'Thu', count: 47 },
    { day: 'Fri', count: 52 },
    { day: 'Sat', count: 44 },
    { day: 'Sun', count: 47 },
];

const fields = [
    { name: 'North Wheat', type: 'wheat', status: 'verified', reading: 'Moisture: 67%' },
    { name: 'South Corn', type: 'corn', status: 'verified', reading: 'Moisture: 71%' },
    { name: 'East Orchard', type: 'orchard', status: 'verified', reading: 'pH: 6.8' },
    { name: 'West Barley', type: 'barley', status: 'verified', reading: 'Temp: 22°C' },
    { name: 'Greenhouse A', type: 'greenhouse', status: 'warning', reading: 'Moisture: 38%' },
    { name: 'Greenhouse B', type: 'greenhouse', status: 'verified', reading: 'Temp: 26°C' },
];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-xl shadow-lg border border-sage px-4 py-3">
            <p className="text-xs font-mono text-moss mb-1">{label}</p>
            <p className="text-sm font-semibold text-soil">{payload[0].value} verified</p>
        </div>
    );
}

export default function Dashboard() {
    const { events } = useEvents();

    return (
        <div className="px-6 lg:px-8 py-6 pb-24 lg:pb-6 bg-cream min-h-screen">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-editorial text-soil">
                        Good morning, John 🌾
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-moss">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-sentinel-50 text-sentinel-600 rounded-full text-xs font-medium border border-sentinel-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-500" />
                        </span>
                        All Sensors Active
                    </span>
                    <button className="relative p-2 text-moss hover:text-soil transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <KPICard icon={Droplets} value="47" label="Readings Today" detail="↑ +12 vs yesterday">
                    <TrendingUp className="inline w-3 h-3 text-sentinel-500 ml-1" />
                </KPICard>
                <KPICard icon={CheckCircle} value="45" label="Verified Today" detail="95.7% success">
                    <div className="mt-2 h-2 bg-sage rounded-full overflow-hidden">
                        <div className="h-full bg-sentinel-500 rounded-full" style={{ width: '95.7%' }} />
                    </div>
                </KPICard>
                <KPICard icon={MapPin} value="6" label="Active Fields" detail="of 8 total" detailColor="text-moss">
                    <p className="text-xs text-warning mt-1">● 2 need attention</p>
                </KPICard>

                {/* Trust Score with ring */}
                <div className="bg-white rounded-2xl border border-sage p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-3">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" stroke="#DCE4D4" strokeWidth="8" fill="none" />
                            <motion.circle
                                cx="60" cy="60" r="52" stroke="#1DBF60" strokeWidth="8" fill="none"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 52}
                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                whileInView={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.98) }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-editorial text-soil">98%</span>
                        </div>
                    </div>
                    <p className="text-sm text-moss mb-1">Trust Score</p>
                    <p className="text-xs font-medium text-sentinel-600 flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Excellent
                    </p>
                </div>
            </div>

            {/* Field Overview + Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-7 bg-white rounded-2xl border border-sage p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-editorial text-soil">Field Overview</h3>
                        <span className="text-xs text-moss">Last updated: 2 min ago</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {fields.map((f) => (
                            <FieldZone key={f.name} {...f} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl border border-sage p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-editorial text-soil">Live Feed</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-500" />
                            </span>
                            <span className="text-[10px] font-mono text-sentinel-500 uppercase tracking-wider">Real-time</span>
                        </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {events.map((e, i) => (
                            <FeedItem key={i} {...e} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-2xl border border-sage p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-editorial text-soil">This Week</h3>
                    <button className="text-xs font-mono text-moss border border-sage px-3 py-1.5 rounded-xl hover:bg-ivory transition-colors">
                        Weekly ▾
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weeklyData}>
                        <defs>
                            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1DBF60" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#1DBF60" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#DCE4D4" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#5A6B5C' }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="count" stroke="#1DBF60" strokeWidth={2} fill="url(#greenGradient)" dot={{ r: 4, fill: '#1DBF60', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#1DBF60' }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Alert Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <p className="text-sm text-bark flex-1">
                    <span className="font-medium">Greenhouse A needs attention</span> — Moisture dropped below 40%
                </p>
                <button className="text-sm text-sentinel-500 font-medium hover:text-sentinel-600 transition-colors whitespace-nowrap">
                    View Field →
                </button>
            </div>
        </div>
    );
}