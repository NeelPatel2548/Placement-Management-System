import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiChartBar, HiClipboardList, HiUserGroup, HiSparkles } from 'react-icons/hi';

const features = [
    {
        icon: HiClipboardList,
        title: 'Student Dashboard',
        description: 'Track applications, interview schedules, and placement status in a personalized dashboard designed for students.',
        gradient: 'from-blue-500 to-cyan-400',
        shadow: 'shadow-blue-500/20',
    },
    {
        icon: HiUserGroup,
        title: 'Company Recruitment Portal',
        description: 'Streamlined portal for companies to post jobs, review candidates, and manage their campus recruitment pipeline.',
        gradient: 'from-purple-500 to-pink-400',
        shadow: 'shadow-purple-500/20',
    },
    {
        icon: HiChartBar,
        title: 'Placement Analytics',
        description: 'Powerful insights and real-time analytics to track placement rates, salary trends, and department performance.',
        gradient: 'from-orange-500 to-amber-400',
        shadow: 'shadow-orange-500/20',
    },
    {
        icon: HiSparkles,
        title: 'AI Resume Analyzer',
        description: 'AI-powered resume analysis that scores resumes, suggests improvements, and matches students to ideal roles.',
        gradient: 'from-emerald-500 to-teal-400',
        shadow: 'shadow-emerald-500/20',
    },
];

function FeatureCard({ feature, index }) {
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative"
        >
            <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-accent-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.shadow} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>

                    <div className="mt-6 flex items-center gap-2 text-primary-600 font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Learn more
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Features() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="features" className="py-24 lg:py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Everything You Need for{' '}
                        <span className="gradient-text">Campus Placements</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        A comprehensive platform designed to streamline every aspect of the placement process.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
