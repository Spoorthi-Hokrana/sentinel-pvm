import { useCountUp } from '../hooks/useReveal';

export default function KPICard({ icon: Icon, value, label, detail, detailColor = 'text-sentinel-600', children }) {
    const countRef = useCountUp(parseFloat(String(value).replace(/[^0-9.]/g, '')));
    const suffix = String(value).replace(/[\d.,]/g, '');

    return (
        <div className="bg-white rounded-2xl border border-sage p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            {Icon && (
                <div className="w-12 h-12 bg-sentinel-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-sentinel-500" />
                </div>
            )}
            <div className="text-4xl font-editorial text-soil mb-1" ref={countRef}>
                {value}
            </div>
            <p className="text-sm text-moss mb-2">{label}</p>
            {detail && (
                <p className={`text-xs font-medium ${detailColor}`}>{detail}</p>
            )}
            {children}
        </div>
    );
}