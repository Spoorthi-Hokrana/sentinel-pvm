export default function StatusBadge({ status }) {
    const styles = {
        verified: 'bg-sentinel-50 text-sentinel-700 border-sentinel-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        failed: 'bg-red-50 text-red-700 border-red-200',
    };

    const labels = {
        verified: '✓ Verified',
        warning: '⚠ Warning',
        failed: '✗ Failed',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.verified
                }`}
        >
            {labels[status] || status}
        </span>
    );
}