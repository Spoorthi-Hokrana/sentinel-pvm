import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function FeedItem({ type, field, reading, value, time }) {
    const isWarning = type === 'warning';

    return (
        <div className="flex items-start gap-3 py-3 border-b border-sage/30 last:border-0">
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isWarning ? 'bg-amber-400' : 'bg-sentinel-500'}`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-bark">
                    <span className="font-medium">{field}</span> — {reading}
                    {value && <span className="font-mono text-sentinel-600 ml-1">{value}</span>}
                </p>
                <p className="text-[10px] font-mono text-moss/50 mt-0.5">{time}</p>
            </div>
            {isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
                <CheckCircle className="w-4 h-4 text-sentinel-500 flex-shrink-0" />
            )}
        </div>
    );
}