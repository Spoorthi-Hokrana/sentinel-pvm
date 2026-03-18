import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FileStack,
    Clock,
    ShieldCheck,
    Zap,
    CheckCircle,
    X,
    DollarSign,
    Shield,
    Award,
    Turtle,
    ArrowRight,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease, delay },
});

const oldWayItems = [
    'Takes 24-48 hours',
    'Requires manual paperwork',
    'Records can be lost or forged',
    'Expensive at scale',
];

const newWayItems = [
    'Verified in under 6 seconds',
    'Completely automatic',
    'Permanent and tamper-proof',
    'Works with any sensor',
];

const benefitCards = [
    { icon: DollarSign, heading: 'Higher Selling Price', body: 'Verified produce sells for 10-25% more. Buyers pay premium for data they can independently verify.', stat: '+25%' },
    { icon: Shield, heading: 'Lower Insurance Costs', body: 'Insurance companies offer up to 20% better rates for farms with independent verification records.', stat: '-20%' },
    { icon: Award, heading: 'Faster Certification', body: 'Organic and sustainability certifications are processed 3x faster with Sentinel verification history.', stat: '3x faster' },
];

export default function Technical() {
    return (
        <div className="px-6 lg:px-8 py-6 pb-24 lg:pb-6 bg-cream min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <motion.h1 {...fadeUp()} className="text-3xl md:text-4xl font-editorial text-soil mb-2">
                    Technical Deep-Dive
                </motion.h1>
                <motion.p {...fadeUp(0.1)} className="text-base text-moss">
                    See how Sentinel-PVM architecture radically outperforms traditional EVM data verification.
                </motion.p>
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Old Way */}
                <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-sage overflow-hidden">
                    <div className="h-1 bg-warning" />
                    <div className="p-8">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-warning mb-6">Traditional Verification</p>
                        <div className="w-32 h-32 bg-amber-50 rounded-full mx-auto flex items-center justify-center mb-8">
                            <FileStack className="w-10 h-10 text-warning mr-1" />
                            <Clock className="w-8 h-8 text-warning" />
                        </div>
                        <p className="text-5xl font-editorial text-soil text-center mb-2">\$4.82</p>
                        <p className="text-sm text-moss text-center mb-6">per batch of readings</p>
                        <div className="border-t border-sage my-6" />
                        <div className="space-y-3">
                            {oldWayItems.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <X className="w-4 h-4 text-danger flex-shrink-0" />
                                    <span className="text-sm text-moss">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-amber-50 rounded-xl p-4">
                            <p className="text-sm text-warning text-center">Most farms skip verification because it's too expensive.</p>
                        </div>
                    </div>
                </motion.div>

                {/* New Way */}
                <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-sage overflow-hidden relative">
                    <div className="h-1 bg-sentinel-500" />
                    <span className="absolute top-4 right-4 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded-full">
                        Recommended
                    </span>
                    <div className="p-8">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-sentinel-500 mb-6">Sentinel Verification</p>
                        <div className="w-32 h-32 bg-sentinel-50 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(29,191,96,0.15)]">
                            <ShieldCheck className="w-10 h-10 text-sentinel-500 mr-1" />
                            <Zap className="w-8 h-8 text-sentinel-500" />
                        </div>
                        <p className="text-5xl font-editorial text-sentinel-600 text-center mb-2">\$0.004</p>
                        <p className="text-sm text-moss text-center mb-2">per batch of readings</p>
                        <span className="block mx-auto w-fit bg-sentinel-50 text-sentinel-600 text-xs font-semibold px-3 py-1 rounded-full border border-sentinel-200 mb-6">
                            99% cheaper
                        </span>
                        <div className="border-t border-sage my-6" />
                        <div className="space-y-3">
                            {newWayItems.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-sentinel-500 flex-shrink-0" />
                                    <span className="text-sm text-bark">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-sentinel-50 rounded-xl p-4">
                            <p className="text-sm text-sentinel-600 text-center font-medium">Verify everything. Pay almost nothing.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Speed comparison */}
            <motion.div {...fadeUp()} className="bg-white rounded-2xl border border-sage p-8 mb-16">
                <h3 className="text-xl font-editorial text-soil mb-8">Speed Comparison</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Turtle className="w-5 h-5 text-warning" />
                            <span className="text-sm text-moss">Traditional: 24-48 hours</span>
                        </div>
                        <motion.div
                            className="h-14 bg-amber-100 rounded-xl overflow-hidden"
                            initial={{ width: 0 }}
                            whileInView={{ width: '90%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease }}
                        >
                            <div className="h-full bg-warning/60 rounded-xl flex items-center px-4">
                                <span className="text-xs font-mono text-amber-800">24-48 hours</span>
                            </div>
                        </motion.div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-sentinel-500" />
                            <span className="text-sm text-moss">Sentinel: 6 seconds</span>
                        </div>
                        <motion.div
                            className="h-14 bg-sentinel-100 rounded-xl overflow-hidden"
                            initial={{ width: 0 }}
                            whileInView={{ width: '3%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease, delay: 0.3 }}
                            style={{ minWidth: '120px' }}
                        >
                            <div className="h-full bg-sentinel-500/60 rounded-xl flex items-center px-4">
                                <span className="text-xs font-mono text-sentinel-800">6 sec</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {benefitCards.map((card, i) => (
                    <motion.div
                        key={card.heading}
                        {...fadeUp(i * 0.15)}
                        className="bg-white rounded-2xl border border-sage p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-sentinel-50 rounded-2xl flex items-center justify-center mb-6">
                            <card.icon className="w-7 h-7 text-sentinel-500" />
                        </div>
                        <h3 className="text-xl font-editorial text-soil mb-3">{card.heading}</h3>
                        <p className="text-sm text-moss leading-relaxed mb-4">{card.body}</p>
                        <p className="text-3xl font-editorial text-sentinel-500">{card.stat}</p>
                    </motion.div>
                ))}
            </div>

            {/* Bottom CTA */}
            <motion.div {...fadeUp()} className="text-center py-16">
                <h2 className="text-2xl md:text-3xl font-editorial text-soil mb-6">
                    Ready to see it in action?
                </h2>
                <Link to="/app" className="inline-flex items-center gap-2 px-10 py-5 bg-sentinel-500 text-white font-semibold uppercase tracking-wide rounded-full hover:scale-105 hover:bg-sentinel-600 transition-all duration-500 text-sm mb-4">
                    Try it yourself <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-moss">Run a live verification on the Paseo Testnet</p>
            </motion.div>
        </div>
    );
}