import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Leaf,
    ShieldCheck,
    Share2,
    Download,
    Printer,
    Plus,
    CheckCircle,
    Droplets,
    Thermometer,
    FlaskConical,
    Waves,
} from 'lucide-react';

const certificateData = {
    id: 'SEN-2026-0847',
    farm: 'Green Valley Ranch',
    field: 'North Wheat — Section A',
    date: 'March 18, 2026 at 2:34 PM',
    verifiedBy: 'Sentinel Network',
    readings: [
        { sensor: 'Soil Moisture', value: '67.2%', icon: Droplets, status: 'verified' },
        { sensor: 'Temperature', value: '24.1°C', icon: Thermometer, status: 'verified' },
        { sensor: 'pH Level', value: '6.84', icon: FlaskConical, status: 'verified' },
        { sensor: 'Irrigation Flow', value: '12.5 L/m', icon: Waves, status: 'verified' },
        { sensor: 'Soil Moisture B', value: '71.3%', icon: Droplets, status: 'verified' },
    ],
};

const recentCerts = [
    { id: 'SEN-2026-0847', field: 'North Wheat', date: 'Mar 18, 2026' },
    { id: 'SEN-2026-0832', field: 'South Corn', date: 'Mar 17, 2026' },
    { id: 'SEN-2026-0815', field: 'East Orchard', date: 'Mar 16, 2026' },
    { id: 'SEN-2026-0798', field: 'Greenhouse A', date: 'Mar 15, 2026' },
    { id: 'SEN-2026-0781', field: 'West Barley', date: 'Mar 14, 2026' },
];

export default function Verify() {
    const [selectedCert, setSelectedCert] = useState(0);

    return (
        <div className="px-6 lg:px-8 py-6 pb-24 lg:pb-6 bg-cream min-h-screen">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-editorial text-soil mb-1">
                        Verification Certificates
                    </h1>
                    <p className="text-sm text-moss">Share tamper-proof records of your farm data</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-sentinel-500 text-white rounded-full font-medium text-sm hover:bg-sentinel-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    Generate New Certificate
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main certificate */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 max-w-3xl"
                >
                    <div className="bg-white border-2 border-sentinel-200 rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Leaf className="w-8 h-8 text-sentinel-500" />
                                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-sentinel-500 font-semibold">
                                    Sentinel
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-editorial text-soil mb-4">
                                Certificate of Verification
                            </h2>
                            <div className="h-0.5 w-24 bg-sentinel-500 mx-auto mb-4" />
                            <p className="text-xs font-mono text-moss">Certificate ID: {certificateData.id}</p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-left mb-8">
                            {[
                                ['Farm', certificateData.farm],
                                ['Field', certificateData.field],
                                ['Date', certificateData.date],
                                ['Verified by', certificateData.verifiedBy],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <span className="text-xs text-moss">{label}:</span>
                                    <p className={`text-sm font-semibold ${label === 'Verified by' ? 'text-sentinel-600' : 'text-soil'}`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Readings table */}
                        <h3 className="text-xl font-editorial text-soil mb-4">Verified Readings</h3>
                        <div className="overflow-hidden rounded-xl border border-sage mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-ivory">
                                        <th className="px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider text-moss">Sensor</th>
                                        <th className="px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider text-moss">Value</th>
                                        <th className="px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider text-moss">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificateData.readings.map((r, i) => (
                                        <tr key={i} className={`border-t border-sage/30 ${i % 2 === 1 ? 'bg-[#F5F8F0]' : ''}`}>
                                            <td className="px-4 py-3 flex items-center gap-2 text-sm text-bark">
                                                <r.icon className="w-4 h-4 text-sentinel-500" />
                                                {r.sensor}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono font-medium text-bark">{r.value}</td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center gap-1 text-sentinel-600 text-xs font-medium">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Verified
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Info box */}
                        <div className="bg-sentinel-50 border border-sentinel-200 rounded-xl p-6 flex items-start gap-3 mb-8">
                            <ShieldCheck className="w-6 h-6 text-sentinel-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-editorial text-sentinel-700">
                                All 10 sensor readings have been verified. This record is permanent and cannot be altered or deleted.
                            </p>
                        </div>

                        {/* Seal */}
                        <div className="absolute bottom-8 right-8 w-28 h-28 rounded-full bg-sentinel-50 border-[3px] border-sentinel-500 flex flex-col items-center justify-center hover:rotate-[5deg] transition-transform duration-500">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-sentinel-300 flex flex-col items-center justify-center">
                                <Leaf className="w-5 h-5 text-sentinel-500 mb-1" />
                                <span className="text-[9px] font-mono font-bold text-sentinel-600 uppercase tracking-wider">
                                    Verified
                                </span>
                                <span className="text-[7px] font-mono text-sentinel-400">2026</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-[10px] text-moss mb-1">
                                This record can be independently verified at any time
                            </p>
                            <p className="text-[9px] font-mono text-moss/50">
                                Powered by secure blockchain technology
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        <button className="flex items-center gap-2 px-8 py-3 bg-sentinel-500 text-white rounded-full font-medium text-sm hover:bg-sentinel-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share Certificate
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-soil border border-sage rounded-full font-medium text-sm hover:border-sentinel-300 transition-colors">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-soil border border-sage rounded-full font-medium text-sm hover:border-sentinel-300 transition-colors">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                    </div>
                </motion.div>

                {/* Recent certificates sidebar */}
                <div className="w-full lg:w-[280px]">
                    <h3 className="text-lg font-editorial text-soil mb-4">Recent Certificates</h3>
                    <div className="space-y-3">
                        {recentCerts.map((cert, i) => (
                            <button
                                key={cert.id}
                                onClick={() => setSelectedCert(i)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedCert === i
                                        ? 'bg-sentinel-50 border-sentinel-200 shadow-sm'
                                        : 'bg-white border-sage hover:bg-ivory'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle className="w-4 h-4 text-sentinel-500" />
                                    <span className="text-sm font-medium text-soil">{cert.field}</span>
                                </div>
                                <p className="text-[10px] font-mono text-moss">{cert.date}</p>
                                <p className="text-[9px] font-mono text-moss/50 mt-1">{cert.id}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}