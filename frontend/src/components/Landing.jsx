import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
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
    BadgeCheck,
    CheckCircle,
    Award,
    Handshake,
    Users,
    DollarSign,
} from 'lucide-react';

/* ═══ ANIMATION HELPERS ═══ */
const ease = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 1, ease, delay },
});

/* ═══ HOW IT WORKS DATA ═══ */
const howItWorksSteps = [
    {
        step: '1',
        heading: 'Your sensors collect data',
        body: 'Soil moisture, temperature, pH levels, irrigation flow — your existing farm sensors keep doing their job. Sentinel connects to them automatically in the background.',
        imagePosition: 'left',
        badge: 'No new hardware',
        hint: 'Automatic',
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
        hint: 'Sealed in seconds',
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
        hint: 'One-click sharing',
        tags: [
            { value: '+25%', label: 'higher prices' },
            { value: '-20%', label: 'insurance' },
            { value: '3x', label: 'faster' },
        ],
        tagType: 'stats',
    },
];

/* ═══ STEP ILLUSTRATIONS ═══ */
function StepOneIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-100 via-emerald-50 to-amber-50/30 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-sentinel-200/30 rounded-full blur-[60px]" />
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-100/40 rounded-full blur-[50px]" />
            {[0, 1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="absolute h-[1px] bg-sentinel-300/20 rotate-2"
                    style={{ top: `${35 + i * 12}%`, left: '5%', right: '5%' }}
                />
            ))}
            <Thermometer className="absolute bottom-16 left-[20%] w-10 h-10 text-sentinel-400 opacity-80 -rotate-6" />
            <Droplets className="absolute bottom-12 left-[45%] w-12 h-12 text-sentinel-500 opacity-90" />
            <Sprout className="absolute bottom-20 left-[70%] w-9 h-9 text-sentinel-300 opacity-70 rotate-[4deg]" />
            <Sun className="absolute top-8 right-12 w-14 h-14 text-amber-300/50" />
            <Wind className="absolute top-16 left-8 w-8 h-8 text-sentinel-200/40" />
            <span className="absolute bottom-4 left-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">
                {badge}
            </span>
        </div>
    );
}

function StepTwoIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-50 via-emerald-50 to-sentinel-100 overflow-hidden flex items-center justify-center">
            <div className="absolute w-40 h-40 bg-sentinel-300/20 rounded-full blur-[40px]" />
            <div className="relative">
                <div className="absolute inset-0 -m-4 w-28 h-28 border-2 border-sentinel-300/30 rounded-full animate-ping-slow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Shield className="w-20 h-20 text-sentinel-500 relative z-10" />
            </div>
            <span className="absolute top-8 left-8 -rotate-3 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                67.2%
            </span>
            <span className="absolute top-12 right-12 rotate-2 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                24°C
            </span>
            <span className="absolute bottom-16 left-12 rotate-1 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                pH 6.8
            </span>
            <span className="absolute bottom-10 right-16 -rotate-2 text-[11px] font-mono text-sentinel-600 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                12.5 L/m
            </span>
            <CheckCircle className="absolute top-14 left-20 w-4 h-4 text-sentinel-400" />
            <CheckCircle className="absolute top-20 right-24 w-4 h-4 text-sentinel-400" />
            <FileCheck className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 text-sentinel-300/60" />
            <span className="absolute bottom-4 right-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">
                {badge}
            </span>
        </div>
    );
}

function StepThreeIllustration({ badge }) {
    return (
        <div className="relative w-full h-full min-h-[200px] md:min-h-full bg-gradient-to-br from-sentinel-50 via-amber-50/20 to-cream overflow-hidden flex items-center justify-center">
            <div className="absolute w-48 h-48 bg-amber-100/20 blur-[50px]" />
            <div className="absolute w-32 h-40 border-2 border-sentinel-200/40 rounded-xl flex items-end justify-end p-2">
                <div className="w-24 h-28 border border-dashed border-sentinel-200/30 rounded-lg" />
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-sentinel-400" />
            </div>
            <Award className="w-16 h-16 text-sentinel-500 relative z-10" />
            <Handshake className="absolute bottom-20 left-[30%] w-12 h-12 text-sentinel-400/70" />
            <Users className="absolute top-12 right-16 w-10 h-10 text-sentinel-300/50" />
            <CheckCircle className="absolute top-16 left-12 w-8 h-8 text-sentinel-400" />
            <span className="absolute top-8 left-8 -rotate-3 bg-sentinel-50 text-sentinel-600 text-[10px] font-mono px-2 py-1 rounded-md border border-sentinel-200/50">
                +25%
            </span>
            <span className="absolute bottom-8 right-8 rotate-2 bg-sentinel-50 text-sentinel-600 text-[10px] font-mono px-2 py-1 rounded-md border border-sentinel-200/50">
                -20%
            </span>
            <span className="absolute bottom-4 left-4 z-10 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">
                {badge}
            </span>
        </div>
    );
}

const illustrations = [StepOneIllustration, StepTwoIllustration, StepThreeIllustration];

/* ═══ TAG RENDERERS ═══ */
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

/* ═══ STATS DATA ═══ */
const stats = [
    { num: '01', value: '2,847', label: 'Farms Protected', detail: 'and growing every week' },
    { num: '02', value: '1.2M', label: 'Readings Verified', detail: 'tamper-proof records' },
    { num: '03', value: '99.1%', label: 'Cost Reduction', detail: 'vs traditional methods' },
    { num: '04', value: '<6s', label: 'Verification Time', detail: 'fully automatic' },
];

/* ═══ BENEFITS DATA ═══ */
const benefits = [
    {
        icon: DollarSign,
        heading: 'Sell for more',
        body: 'Verified produce commands 10-25% higher prices. Buyers trust data they can check themselves.',
    },
    {
        icon: Shield,
        heading: 'Lower insurance',
        body: 'Insurance companies offer better rates for farms with independent verification records.',
    },
    {
        icon: Award,
        heading: 'Certify faster',
        body: 'Organic and sustainability certifications process 3x faster with Sentinel verification.',
    },
];

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const problemRef = useReveal();
    const statsLineRef = useReveal();

    return (
        <div className="bg-cream">
            {/* ═══ SECTION 1.1 — HERO ═══ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sentinel-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sentinel-500/15 rounded-full blur-[150px]" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-6 max-w-[1200px] mx-auto"
                >
                    {/* Micro label */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-moss mb-8"
                    >
                        Trusted Farm Verification Platform
                    </motion.p>

                    {/* Main heading */}
                    <div className="overflow-hidden mb-4">
                        <motion.h1
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.2, ease, delay: 0.2 }}
                            className="text-hero font-editorial text-soil leading-[0.9] tracking-tight"
                        >
                            Every harvest
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.2, ease, delay: 0.4 }}
                            className="text-hero font-editorial italic text-sentinel-500 leading-[0.9] tracking-tight"
                        >
                            deserves proof.
                        </motion.h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-lg text-moss max-w-[600px] mx-auto mb-10 font-body font-light leading-relaxed"
                    >
                        Sentinel verifies your farm sensor data automatically and creates permanent records that
                        buyers, insurers, and certifiers trust.
                    </motion.p