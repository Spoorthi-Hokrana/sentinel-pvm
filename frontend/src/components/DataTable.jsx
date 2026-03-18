import { useState } from 'react';
import { Search, FileDown, Droplets, Thermometer, FlaskConical, Waves } from 'lucide-react';
import StatusBadge from './StatusBadge';

const typeIcons = {
    'Soil Moisture': Droplets,
    'Temperature': Thermometer,
    'pH Level': FlaskConical,
    'Irrigation': Waves,
    'Moisture': Droplets,
};

export default function DataTable({ data, totalResults = 247 }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = data.filter(
        (row) =>
            row.field.toLowerCase().includes(search.toLowerCase()) ||
            row.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-sage overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-sage">
                <h3 className="text-xl font-editorial text-soil">Verification Log</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-moss/40" />
                        <input
                            type="text"
                            placeholder="Search by field or type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-sage rounded-xl text-sm text-bark placeholder:text-moss/40 focus:outline-none focus:border-sentinel-300 transition-colors w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-sentinel-600 border border-sentinel-200 rounded-xl hover:bg-sentinel-50 transition-colors">
                        <FileDown className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-ivory">
                            <th className="px-6 py-3 text-left text-[10px] font-mono font-medium uppercase tracking-wider text-moss">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-mono font-medium uppercase tracking-wider text-moss">
                                Field
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-mono font-medium uppercase tracking-wider text-moss">
                                Reading Type
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-mono font-medium uppercase tracking-wider text-moss">
                                Value
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-mono font-medium uppercase tracking-wider text-moss">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, i) => {
                            const TypeIcon = typeIcons[row.type] || Droplets;
                            return (
                                <tr
                                    key={i}
                                    className={`border-b border-sage/30 ${i % 2 === 1 ? 'bg-[#F5F8F0]' : 'bg-white'}`}
                                >
                                    <td className="px-6 py-4 text-sm font-mono text-moss">{row.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-bark">{row.field}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-moss">
                                            <TypeIcon className="w-3.5 h-3.5" />
                                            {row.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono font-medium text-bark">{row.value}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={row.status} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-sage">
                <span className="text-xs text-moss">
                    Showing 1-{Math.min(10, filtered.length)} of {totalResults} results
                </span>
                <div className="flex items-center gap-1">
                    <button className="px-3 py-1 text-xs text-moss hover:bg-ivory rounded-lg transition-colors">
                        ← Previous
                    </button>
                    {[1, 2, 3].map((p) => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${currentPage === p
                                    ? 'bg-sentinel-500 text-white'
                                    : 'text-moss hover:bg-ivory'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <span className="text-xs text-moss">...</span>
                    <button className="px-3 py-1 text-xs text-moss hover:bg-ivory rounded-lg transition-colors">
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}