import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Trophy,
    PiggyBank,
    Clock,
    TrendingUp,
    Download,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease, delay },
});

/* Mock data */
const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: `Mar ${i + 1}`,
    verified: Math.floor(30 + Math.random() * 25),
    warnings: Math.floor(Math.random() * 4),
}));

const pieData = [
    { name: 'Soil Moisture', value: 34, color: '#1DBF60' },
    { name: 'Temperature', value: 28, color: '#3DCE79' },
    { name: 'pH Level', value: 22, color: '#75E3A2' },
    { name: 'Irrigation', value: 16, color: '#ACF0C6' },
];

const barData = [
    { field: 'North Wheat', thisMonth: 320, lastMonth: 280 },
    { field: 'South Corn', thisMonth: 290, lastMonth: 310 },
    { field: 'East Orchard', thisMonth: 240, lastMonth: 200 },
    { field: 'West Barley', thisMonth: 210, lastMonth: 190 },
    { field: 'Greenhouse A', thisMonth: 180, lastMonth: 150 },
    { field: 'Greenhouse B', thisMonth: 160, lastMonth: 170 },
];

const tableData = [
    { date: 'Mar 18, 2:34 PM', field: 'North Wheat', type: 'Soil Moisture', value: '67.2%', status: 'verified' },
    { date: 'Mar 18, 2:34 PM', field: 'North Wheat', type: 'Temperature', value: '24.1°C', status: 'verified' },
    { date: 'Mar 18, 2:33 PM', field: 'South Corn', type: 'pH Level', value: '6.84', status: 'verified' },
    { date: 'Mar 18, 2:30 PM', field: 'Greenhouse A', type: 'Moisture', value: '38.1%', status: 'warning' },
    { date: 'Mar 18, 2:28 PM', field: 'East Orchard', type: 'Irrigation', value: '12.5 L/m', status: 'verified' },
    { date: 'Mar 18, 2:25 PM', field: 'West Barley', type: 'Temperature', value: '22.8°C', status: 'verified' },
    { date: 'Mar 18, 2:22 PM', field: 'South Corn', type: 'Soil Moisture', value: '71.3%', status: 'verified' },
    { date: 'Mar 18, 2:20 PM', field: 'North Wheat', type: 'Irrigation', value: '14.2 L/m', status: 'verified' },
];

function TrendTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-xl shadow-lg border border-sage px-4 py-3">
            <p className="text-xs font-mono text-moss mb-1">{label}</p>
            <p className="text-sm font-semibold text-sentinel-600">{payload[0]?.value} verified</p>
            {payload[1]?.value > 0 && (
                <p className="text-xs text-warning">{payload[1].value} warnings</p>
            )}
        </div>
    );
}

export default function Stats() {
    const [period, setPeriod] = useState('month');

    return (
        <div className="px-6 lg:px-8 py-6 pb-24 lg:pb-6 bg-cream min-h-screen">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <motion.h1 {...fadeUp()} className="text-3xl md:text-4xl font-editorial text-soil">
                    Your Farm's Performance
                </motion.h1>
                <div className="flex items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-white border border-sage rounded-xl px-4 py-2 text-sm text-bark focus:outline-none focus:border-sentinel-300"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-sentinel-600 border border-sentinel-200 rounded-xl hover:bg-sentinel-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <KPICard icon={CheckCircle} value="1247" label="Total Verifications" detail="↑ +23% vs last month">
                    <TrendingUp className="inline w-3 h-3 text-sentinel-500 ml-1" />
                </KPICard>
                <KPICard icon={Trophy} value="98.2" label="Success Rate" detail="Excellent ★" />
                <KPICard icon={PiggyBank} value="847" label="Estimated Savings" detail="vs traditional verification costs" detailColor="text-moss" />
                <KPICard icon={Clock} value="4.2" label="Avg. Verification Time" detail="⚡ Real-time" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Trend chart */}
                <motion.div {...fadeUp()} className="lg:col-span-7 bg-white rounded-2xl border border-sage p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-editorial text-soil">Verification Trend</h3>
                        <div className="flex gap-1">
                            {['week', 'month', 'year'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${period === p ? 'bg-sentinel-500 text-white' : 'text-moss hover:bg-ivory'
                                        }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="trendGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1DBF60" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#1DBF60" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#DCE4D4" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#5A6B5C' }}
                                axisLine={false}
                                tickLine={false}
                                interval={4}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#5A6B5C' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<TrendTooltip />} />
                            <Area type="monotone" dataKey="verified" stroke="#1DBF60" strokeWidth={2} fill="url(#trendGreen)" dot={false} />
                            <Area type="monotone" dataKey="warnings" stroke="#E6A817" strokeWidth={1} fill="none" dot={false} strokeDasharray="4 4" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Pie chart */}
                <motion.div {...fadeUp(0.15)} className="lg:col-span-5 bg-white rounded-2xl border border-sage p-6">
                    <h3 className="text-xl font-editorial text-soil mb-6">Sensor Breakdown</h3>
                    <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center -mt-4 mb-4">
                            <p className="text-3xl font-editorial text-soil">1,247</p>
                            <p className="text-xs text-moss">total</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {pieData.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[10px] font-mono text-moss">{entry.name} {entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Data table */}
            <motion.div {...fadeUp()} className="mb-8">
                <DataTable data={tableData} totalResults={247} />
            </motion.div>

            {/* Bar chart */}
            <motion.div {...fadeUp()} className="bg-white rounded-2xl border border-sage p-6">
                <h3 className="text-xl font-editorial text-soil mb-6">Monthly Summary by Field</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#DCE4D4" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#5A6B5C' }} axisLine={false} tickLine={false} />
                        <YAxis
                            type="category"
                            dataKey="field"
                            tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#5A6B5C' }}
                            axisLine={false}
                            tickLine={false}
                            width={110}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #DCE4D4', fontSize: '12px' }}
                        />
                        <Legend
                            formatter={(value) => <span className="text-xs font-mono text-moss">{value}</span>}
                        />
                        <Bar dataKey="thisMonth" name="This Month" fill="#1DBF60" barSize={16} radius={[0, 4, 4, 0]} />
                        <Bar dataKey="lastMonth" name="Last Month" fill="#ACF0C6" barSize={16} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}