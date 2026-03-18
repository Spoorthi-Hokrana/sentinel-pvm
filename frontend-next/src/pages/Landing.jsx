import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal, useCountUp } from '../hooks/useReveal';
import {
    ArrowRight,
    PlayCircle,
    Thermometer,
    Droplets,
    Sprout,
    FlaskConical,
    Waves,
    Sun,
    Wind,
    Shield,
    FileCheck,
    CheckCircle,
    Award,
    Handshake,
    Users,
    DollarSign,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 1, ease, delay },
});

/* ═══ HOW IT WORKS ═══ */
const howItWorksSteps = [
    {
        step: '1',
        heading: 'Your sensors collect data',
        body: 'Soil moisture, temperature, pH levels, irrigation flow — your existing farm sensors keep doing their job. Sentinel connects to them automatically in the background.',
        imagePosition: 'left',
        badge: 'No new hardware',
        hint: 'Automatic →',
        tags: [
            { icon: Droplets, label: 'Moisture' },
            { icon: Thermometer, label: 'Temp' },
            { icon: FlaskConical, label: 'pH' },
            { icon: Waves, label: 'Water' },
        ],
        tagType: 'pills',
    },
    {
        step: '2',
        heading: 'We verify and seal every reading',
        body: "Each sensor reading gets a unique digital seal — like a notarized stamp — that proves it hasn't been changed or faked. It happens completely automatically in seconds.",
        imagePosition: 'right',
        badge: 'Under 6 seconds',
        hint: 'Sealed in seconds →',
        tags: [
            { icon: CheckCircle, label: 'Tamper-proof' },
            { icon: CheckCircle, label: 'Under 6 seconds' },
        ],
        tagType: 'checks',
    },
    {
        step: '3',
        heading: 'Share trusted proof with anyone',
        body: 'Buyers pay more for verified produce. Insurance companies lower premiums. Organic certifiers process faster. Anyone can verify your farm data is authentic with one click.',
        imagePosition: 'left',
        badge: 'Permanent record',
        hint: 'One-click sharing →',
        tags: [
            { value: '+25%', label: 'higher prices' },
            { value: '-20%', label: 'insurance' },
            { value: '3x', label: 'faster' },
        ],
        tagType: 'stats',
    },
];

function StepOneIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-100 via-emerald-50 to-amber-50/30 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-sentinel-200/30 rounded-full blur-[60px]" />
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-100/40 rounded-full blur-[50px]" />
            {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="absolute h-[1px] bg-sentinel-300/20 rotate-2" style={{ top: `${35 + i * 12}%`, left: '5%', right: '5%' }} />
            ))}
            <Thermometer className="absolute bottom-16 left-[20%] w-10 h-10 text-sentinel-400 opacity-80 -rotate-6" />
            <Droplets className="absolute bottom-12 left-[45%] w-12 h-12 text-sentinel-500 opacity-90" />
            <Sprout className="absolute bottom-20 left-[70%] w-9 h-9 text-sentinel-300 opacity-70 rotate-[4deg]" />
            <Sun className="absolute top-8 right-12 w-14 h-14 text-amber-300/50" />
            <Wind className="absolute top-16 left-8 w-8 h-8 text-sentinel-200/40" />
            <span className="absolute bottom-4 left-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">{badge}</span>
        </div>
    );
}

function StepTwoIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-50 via-emerald-50 to-sentinel-100 overflow-hidden flex items-center justify-center">
            <div className="absolute w-40 h-40 bg-sentinel-300/20 rounded-full blur-[40px]" />
            <div className="relative">
                <div className="absolute -inset-4 w-28 h-28 border-2 border-sentinel-300/30 rounded-full animate-ping left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '3s' }} />
                <Shield className="w-20 h-20 text-sentinel-500 relative z-10" />
            </div>
            <span className="absolute top-8 left-8 -rotate-3 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">67.2%</span>
            <span className="absolute top-12 right-12 rotate-2 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">24°C</span>
            <span className="absolute bottom-16 left-12 rotate-1 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">pH 6.8</span>
            <span className="absolute bottom-10 right-16 -rotate-2 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">12.5 L/m</span>
            <CheckCircle className="absolute top-14 left-20 w-4 h-4 text-sentinel-400" />
            <CheckCircle className="absolute top-20 right-24 w-4 h-4 text-sentinel-400" />
            <FileCheck className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 text-sentinel-300/60" />
            <span className="absolute bottom-4 right-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">{badge}</span>
        </div>
    );
}

function StepThreeIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-50 via-amber-50/20 to-cream overflow-hidden flex items-center justify-center">
            <div className="absolute w-48 h-48 bg-amber-100/20 blur-[50px]" />
            <div className="absolute w-32 h-40 border-2 border-sentinel-200/40 rounded-xl">
                <div className="m-2 w-24 h-28 border border-dashed border-sentinel-200/30 rounded-lg" />
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-sentinel-400" />
            </div>
            <Award className="w-16 h-16 text-sentinel-500 relative z-10" />
            <Handshake className="absolute bottom-20 left-[30%] w-12 h-12 text-sentinel-400/70" />
            <Users className="absolute top-12 right-16 w-10 h-10 text-sentinel-300/50" />
            <CheckCircle className="absolute top-16 left-12 w-8 h-8 text-sentinel-400" />
            <span className="absolute top-8 left-8 -rotate-3 bg-sentinel-50 text-sentinel-600 text-[10px] font-mono px-2 py-1 rounded-md border border-sentinel-200/50">+25%</span>
            <span className="absolute bottom-8 right-8 rotate-2 bg-sentinel-50 text-sentinel-600 text-[10px] font-mono px-2 py-1 rounded-md border border-sentinel-200/50">-20%</span>
            <span className="absolute bottom-4 left-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">{badge}</span>
        </div>
    );
}

const illustrations = [StepOneIllustration, StepTwoIllustration, StepThreeIllustration];

function PillTags({ tags }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-sage/60 bg-ivory/50">
                    <t.icon className="w-3 h-3 text-sentinel-500" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-moss">{t.label}</span>
                </span>
            ))}
        </div>
    );
}

function CheckTags({ tags }) {
    return (
        <div className="flex flex-wrap gap-3">
            {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <t.icon className="w-3.5 h-3.5 text-sentinel-500" />
                    <span className="text-[10px] font-mono text-sentinel-600 uppercase tracking-wider">{t.label}</span>
                </span>
            ))}
        </div>
    );
}

function StatTags({ tags }) {
    return (
        <div className="flex flex-wrap gap-3">
            {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-2 bg-sentinel-50 px-3 py-1.5 rounded-lg border border-sentinel-100">
                    <span className="text-sm font-editorial text-sentinel-600">{t.value}</span>
                    <span className="text-[9px] font-mono text-moss uppercase">{t.label}</span>
                </span>
            ))}
        </div>
    );
}

const tagRenderers = { pills: PillTags, checks: CheckTags, stats: StatTags };

const stats = [
    { num: '01', value: '2,847', label: 'Farms Protected', detail: 'and growing every week' },
    { num: '02', value: '1.2M', label: 'Readings Verified', detail: 'tamper-proof records' },
    { num: '03', value: '99.1%', label: 'Cost Reduction', detail: 'vs traditional methods' },
    { num: '04', value: '<6s', label: 'Verification Time', detail: 'fully automatic' },
];

const benefits = [
    { icon: DollarSign, heading: 'Sell for more', body: 'Verified produce commands 10-25% higher prices. Buyers trust data they can check themselves.' },
    { icon: Shield, heading: 'Lower insurance', body: 'Insurance companies offer better rates for farms with independent verification records.' },
    { icon: Award, heading: 'Certify faster', body: 'Organic and sustainability certifications process 3x faster with Sentinel verification.' },
];

/* ═══ LANDING PAGE ═══ */
export default function Landing() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const problemRef = useReveal();
    const statsLineRef = useReveal();

    return (
        <div className="bg-cream">
            {/* ═══ HERO ═══ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sentinel-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sentinel-500/15 rounded-full blur-[150px]" />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-[1200px] mx-auto">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-[10px] font-mono uppercase tracking-[0.3em] text-moss mb-8">
                        Trusted Farm Verification Platform
                    </motion.p>

                    <div className="overflow-hidden mb-4">
                        <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: 0.2 }} className="text-hero font-editorial text-soil leading-[0.9] tracking-tight whitespace-nowrap">
                            Every harvest
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: 0.4 }} className="text-hero font-editorial italic text-sentinel-500 leading-[0.9] tracking-tight whitespace-nowrap">
                            deserves proof.
                        </motion.h1>
                    </div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="text-lg text-moss max-w-[600px] mx-auto mb-10 font-body font-light leading-relaxed">
                        Sentinel verifies your farm sensor data automatically and creates permanent records that buyers, insurers, and certifiers trust.
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/dashboard" className="flex items-center gap-2 px-10 py-5 bg-sentinel-500 text-soil font-semibold uppercase tracking-wide rounded-full hover:scale-105 hover:bg-sentinel-600 transition-all duration-500 text-sm">
                            Start Verifying <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="flex items-center gap-2 px-10 py-5 border border-sage text-soil rounded-full hover:border-sentinel-500 transition-all duration-500 text-sm font-medium">
                            <PlayCircle className="w-4 h-4" /> See How It Works
                        </button>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-moss/40">Scroll</span>
                        <div className="w-px h-12 bg-gradient-to-b from-sentinel-500 to-transparent animate-bounce-slow" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ PROBLEM STATEMENT ═══ */}
            <section className="min-h-screen flex items-center py-24 md:py-32 px-6 md:px-16 lg:px-24">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div ref={problemRef} className="line-reveal h-px bg-sage mb-16" />

                    <div className="grid grid-cols-12 gap-6 md:gap-12">
                        <div className="col-span-12 md:col-span-3">
                            <motion.p {...fadeUp()} className="text-[10px] font-mono uppercase tracking-[0.3em] text-moss/60">
                                The Challenge
                            </motion.p>
                        </div>
                        <div className="col-span-12 md:col-span-9">
                            <motion.p {...fadeUp(0.1)} className="text-section font-editorial text-soil leading-[1.0] tracking-tight mb-12">
                                Farms produce thousands of sensor readings every day. But without verification, that data means nothing to buyers. Traditional certification is{' '}
                                <em className="text-sentinel-500">slow, expensive, and easy to fake.</em>
                            </motion.p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 md:gap-12 mt-8">
                        <div className="col-span-12 md:col-start-4 md:col-span-6">
                            <motion.p {...fadeUp(0.2)} className="text-base text-moss leading-relaxed mb-8">
                                Sentinel changes this. Every reading from your sensors gets an automatic digital seal — like a notary stamp — that proves it's authentic. It costs almost nothing, happens in seconds, and creates a permanent record.
                            </motion.p>
                            <motion.p {...fadeUp(0.3)} className="text-section font-editorial text-soil">
                                <span className="text-sentinel-500">99.1%</span> cheaper than traditional verification
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section className="py-32 md:py-48 px-6 md:px-16 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24">
                        <div>
                            <motion.p {...fadeUp()} className="text-[10px] font-mono uppercase tracking-[0.3em] text-moss/40 mb-4">
                                How it works
                            </motion.p>
                            <motion.h2 {...fadeUp(0.1)} className="text-[clamp(2.5rem,6vw,5rem)] font-editorial text-soil leading-[0.95] tracking-tight">
                                How Sentinel works
                            </motion.h2>
                        </div>
                        <motion.p {...fadeUp(0.2)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-moss/40 mt-4 md:mt-0">
                            Three simple steps
                        </motion.p>
                    </div>

                    {/* Decorative line */}
                    <svg width="60" height="20" viewBox="0 0 60 20" className="mb-16 md:mb-24 text-sentinel-300">
                        <path d="M2 10 C15 2, 25 18, 38 10 C45 5, 52 15, 58 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>

                    {/* Step cards */}
                    <div className="flex flex-col gap-12 md:gap-16">
                        {howItWorksSteps.map((step, index) => {
                            const Illustration = illustrations[index];
                            const TagRenderer = tagRenderers[step.tagType];

                            return (
                                <motion.div
                                    key={step.step}
                                    {...fadeUp(index * 0.15)}
                                    className="max-w-[1100px] mx-auto w-full bg-white rounded-3xl overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-700 ease-out border border-sage/30 group"
                                >
                                    <div className={`grid grid-cols-1 md:grid-cols-2 min-h-[320px] md:min-h-[360px]`}>
                                        {/* Illustration */}
                                        <div className={step.imagePosition === 'right' ? 'md:order-2' : ''}>
                                            <Illustration badge={step.badge} />
                                        </div>

                                        {/* Text */}
                                        <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center relative">
                                            <div className="w-10 h-10 bg-sentinel-500 rounded-full flex items-center justify-center mb-6">
                                                <span className="text-white font-editorial text-sm">{step.step}</span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-editorial text-soil leading-[1.1] tracking-[-0.02em] mb-4">
                                                {step.heading}
                                            </h3>

                                            <p className="text-sm md:text-[15px] font-body text-moss leading-[1.75] font-light mb-6">
                                                {step.body}
                                            </p>

                                            <TagRenderer tags={step.tags} />

                                            <div className="mt-auto pt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sentinel-500">
                                                    {step.hint}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-sentinel-500" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA link */}
                    <motion.div {...fadeUp(0.5)} className="mt-12 md:mt-16 text-center">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-sentinel-500 hover:text-sentinel-600 hover:gap-3 transition-all duration-500">
                            See it in action <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══ STATS BAR ═══ */}
            <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <div ref={statsLineRef} className="line-reveal h-px bg-sentinel-500 mb-16" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div key={stat.num} {...fadeUp(i * 0.1)}>
                                <p className="text-sm font-mono text-sentinel-500 mb-2">{stat.num}</p>
                                <p className="text-display font-editorial text-soil tracking-tight leading-none mb-2">{stat.value}</p>
                                <p className="text-sm font-medium text-bark mb-1">{stat.label}</p>
                                <p className="text-xs text-moss">{stat.detail}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ BENEFITS ═══ */}
            <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <motion.h2 {...fadeUp()} className="text-section font-editorial text-soil tracking-tight text-center mb-16">
                        Why farmers choose Sentinel
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={b.heading}
                                {...fadeUp(i * 0.15)}
                                className="bg-white rounded-2xl border border-sage p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-sentinel-50 rounded-2xl flex items-center justify-center mb-6">
                                    <b.icon className="w-7 h-7 text-sentinel-500" />
                                </div>
                                <h3 className="text-xl font-editorial text-soil mb-3">{b.heading}</h3>
                                <p className="text-sm text-moss leading-relaxed mb-6">{b.body}</p>
                                <span className="text-[11px] font-mono text-sentinel-500 uppercase tracking-wider hover:tracking-[0.3em] transition-all duration-500 cursor-pointer">
                                    Learn more →
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ DARK CTA ═══ */}
            <section className="min-h-screen flex items-center justify-center bg-forest relative overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-sentinel-900/50 rounded-full blur-[150px]" />

                <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto">
                    <motion.p {...fadeUp()} className="text-[10px] font-mono uppercase tracking-[0.3em] text-sentinel-500 mb-8">
                        Ready to protect your harvest?
                    </motion.p>

                    <div className="overflow-hidden mb-4">
                        <motion.h2 {...fadeUp(0.1)} className="text-display font-editorial text-white leading-[0.95] tracking-tight">
                            Your farm data
                        </motion.h2>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <motion.h2 {...fadeUp(0.2)} className="text-display font-editorial italic text-sentinel-400 leading-[0.95] tracking-tight">
                            deserves better.
                        </motion.h2>
                    </div>

                    <motion.p {...fadeUp(0.3)} className="text-base text-white/50 mb-10 max-w-[500px] mx-auto">
                        Join thousands of farms already using Sentinel.
                    </motion.p>

                    <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/dashboard" className="flex items-center gap-2 px-10 py-5 bg-sentinel-500 text-soil font-semibold uppercase tracking-wide rounded-full hover:scale-105 transition-all duration-500 text-sm">
                            Get Started Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="flex items-center gap-2 px-10 py-5 border border-white/20 text-white rounded-full hover:border-sentinel-500 transition-all duration-500 text-sm">
                            <PlayCircle className="w-4 h-4" /> Watch Demo
                        </button>
                    </motion.div>
                </div>

                {/* Footer line */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-6 flex items-center justify-between">
                    <p className="text-[9px] font-mono text-white/20">© 2026 Sentinel</p>
                    <p className="text-[9px] font-mono text-white/20">Built on Polkadot</p>
                </div>
            </section>
        </div>
    );
}