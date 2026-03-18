import { Wheat, Sprout, TreePine, Flower2, Warehouse } from 'lucide-react';
import StatusBadge from './StatusBadge';

const icons = {
    wheat: Wheat,
    corn: Sprout,
    orchard: TreePine,
    barley: Flower2,
    greenhouse: Warehouse,
};

export default function FieldZone({ name, type, status, reading }) {
    const Icon = icons[type] || Sprout;
    const isHealthy = status === 'verified';

    return (
        <div
            className={`relative rounded-xl p-4 border transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${isHealthy
                    ? 'bg-sentinel-50 border-sentinel-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${isHealthy ? 'text-sentinel-500' : 'text-amber-500'}`} />
                <StatusBadge status={status} />
            </div>
            <p className="font-medium text-sm text-soil mb-1">{name}</p>
            <p className="text-xs text-moss font-mono">{reading}</p>
        </div>
    );
}