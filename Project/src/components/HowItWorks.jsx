import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiUser, HiOfficeBuilding, HiDocumentText, HiClipboardCheck, HiCheckCircle } from 'react-icons/hi';

const steps = [
    {
        icon: HiUser,
        title: 'Student Creates Profile',
        description: 'Students register and build their professional profile with academic details, skills, and resume.',
        gradient: 'from-blue-500 to-cyan-400',
        shadow: 'shadow-blue-500/25',
        bg: 'bg-blue-50',
    },
    {
        icon: HiOfficeBuilding,
        title: 'Company Posts Job',
        description: 'Companies create job listings with requirements, eligibility criteria, and compensation details.',
        gradient: 'from-purple-500 to-pink-400',
        shadow: 'shadow-purple-500/25',
        bg: 'bg-purple-50',
    },
    {
        icon: HiDocumentText,
        title: 'Students Apply',
        description: 'Eligible students browse listings and apply to positions that match their interests and qualifications.',
        gradient: 'from-orange-500 to-amber-400',
        shadow: 'shadow-orange-500/25',
        bg: 'bg-orange-50',
    },
    {
        icon: HiClipboardCheck,
        title: 'Companies Shortlist',
        description: 'Companies review applications, shortlist candidates, and schedule interviews through the platform.',
        gradient: 'from-emerald-500 to-teal-400',
        shadow: 'shadow-emerald-500/25',
        bg: 'bg-emerald-50',
    },
    {
        icon: HiCheckCircle,
        title: 'Placement Results',
        description: 'Final selections are announced, offer letters issued, and placement records are automatically updated.',
        gradient: 'from-primary-500 to-accent-500',
        shadow: 'shadow-primary-500/25',
        bg: 'bg-primary-50',
    },
];

function StepCard({ step, index }) {
    const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
    const isEven = index % 2 === 0;

    return (
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center">
            {/* Left content (or empty on odd) */}
            <motion.div
                ref={ref}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${isEven ? 'md:text-right' : 'md:order-3 md:text-left'}`}
            >
                <div className={`group relative p-6 rounded-3xl bg-white border border-gray-100 shadow-xl ${step.shadow} hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden`}>
                    {/* Subtle gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                    <div className="relative z-10">
                        {/* Mobile icon (visible only on small screens) */}
                        <div className={`md:hidden w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center ${step.shadow} shadow-lg mb-4`}>
                            <step.icon className="w-6 h-6 text-white" />
                        </div>

                        <span className={`inline-block px-3 py-1 rounded-full ${step.bg} text-xs font-bold uppercase tracking-wider mb-3`}>
                            <span className={`bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>Step {index + 1}</span>
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Center timeline node */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
                className="hidden md:flex flex-col items-center z-10"
            >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.shadow} group-hover:scale-110 transition-transform rotate-[6deg] hover:rotate-0 duration-300`}>
                    <step.icon className="w-8 h-8 text-white -rotate-[6deg]" />
                </div>
            </motion.div>

            {/* Right side placeholder (or empty on even) */}
            <div className={`hidden md:block ${isEven ? 'md:order-3' : ''}`} />
        </div>
    );
}

export default function HowItWorks() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="how-it-works" className="py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[150px]" />
            <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent-100/30 rounded-full blur-[150px]" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Simple Steps to{' '}
                        <span className="gradient-text">Your Dream Job</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Our streamlined process makes campus placement effortless for everyone.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical timeline line (desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                        <div className="h-full w-full bg-gradient-to-b from-blue-200 via-purple-200 via-orange-200 via-emerald-200 to-primary-200 rounded-full" />
                    </div>

                    {/* Step cards */}
                    <div className="space-y-8 md:space-y-12">
                        {steps.map((step, i) => (
                            <StepCard key={i} step={step} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
