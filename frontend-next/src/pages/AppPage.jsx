import { motion } from 'framer-motion';

import RunAgentPanel from '../components/RunAgentPanel';

const weeklyData = [
    { day: 'Mon', count: 32 },
    { day: 'Tue', count: 41 },
    { day: 'Wed', count: 38 },
    { day: 'Thu', count: 47 },
    { day: 'Fri', count: 52 },
    { day: 'Sat', count: 44 },
    { day: 'Sun', count: 47 },
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

export default function AppPage() {
    return (
        <div className="space-y-12 pb-16">
            
            {/* ═══ SECTION 1: HEADER + RUN AGENT ═══ */}
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[clamp(1.8rem,3vw,2.5rem)] font-editorial text-soil leading-tight">
                            Sentinel
                        </h1>
                        <p className="text-[10px] font-mono text-moss/40 uppercase tracking-[0.2em] mt-1">
                            Farm verification dashboard
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sentinel-50 text-sentinel-600 rounded-full text-xs font-medium border border-sentinel-200 w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-500" />
                        </span>
                        All Sensors Active
                    </div>
                </div>

                <div className="mt-6">
                    <RunAgentPanel />
                </div>
            </section>



            {/* ═══ SECTION 3: RECENT ACTIVITY ═══ */}
            <section>
                <div className="bg-white rounded-2xl border border-sage p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-editorial text-soil">Recent Activity</h2>
                        <span className="text-xs font-mono text-moss">Last updated: Just now</span>
                    </div>
                    <div className="space-y-3">
                        {/* Feed Items */}
                        {[1, 2, 3, 4, 5].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream transition-colors border border-transparent hover:border-sage/50">
                                <div className="w-2 h-2 rounded-full bg-sentinel-500" />
                                <p className="text-sm text-bark font-medium">Batch verified</p>
                                <span className="text-moss text-sm px-2 border-l border-sage/50">— 10 signatures</span>
                                <span className="text-moss text-sm px-2 border-l border-sage/50">— 116,402 gas</span>
                                <span className="text-xs text-moss ml-auto">{i * 2 + 1} min ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 4: WEEKLY CHART ═══ */}
            <section>
                <div className="bg-white rounded-2xl border border-sage p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-editorial text-soil">This Week</h2>
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
            </section>

        </div>
    );
}
