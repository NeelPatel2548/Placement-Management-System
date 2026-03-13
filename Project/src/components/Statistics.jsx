import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { HiUsers, HiOfficeBuilding, HiBriefcase, HiTrendingUp } from 'react-icons/hi';
import api from '../services/api';

const defaultStats = [
    { icon: HiUsers, value: 3, suffix: '+', label: 'Students Registered', gradient: 'from-blue-500 to-cyan-400' },
    { icon: HiOfficeBuilding, value: 5, suffix: '+', label: 'Companies Hiring', gradient: 'from-purple-500 to-pink-400' },
    { icon: HiBriefcase, value: 10, suffix: '+', label: 'Jobs Posted', gradient: 'from-orange-500 to-amber-400' },
    { icon: HiTrendingUp, value: 95, suffix: '%', label: 'Placement Rate', gradient: 'from-emerald-500 to-teal-400' },
];

export default function Statistics() {
    const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [stats, setStats] = useState(defaultStats);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Determine if we can fetch public stats, e.g. from total document counts
                // For this project, let's hit a public route or fallback if it fails
                // Assuming we might have to use default stats if there's no public open endpoint
                const res = await api.get('/api/dashboard/stats');
                if (res.data.stats) {
                    setStats([
                        { icon: HiUsers, value: res.data.stats.totalStudents || 100, suffix: '+', label: 'Students Registered', gradient: 'from-blue-500 to-cyan-400' },
                        { icon: HiOfficeBuilding, value: res.data.stats.totalCompanies || 20, suffix: '+', label: 'Companies Hiring', gradient: 'from-purple-500 to-pink-400' },
                        { icon: HiBriefcase, value: res.data.stats.totalJobs || 50, suffix: '+', label: 'Jobs Posted', gradient: 'from-orange-500 to-amber-400' },
                        { icon: HiTrendingUp, value: res.data.stats.placementRate || 95, suffix: '%', label: 'Placement Rate', gradient: 'from-emerald-500 to-teal-400' },
                    ]);
                }
            } catch (err) {
                console.log('Using default stats, public stat endpoint not attached');
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-500/20 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-4">
                        Our Impact
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Placement Statistics That{' '}
                        <span className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
                            Speak Volumes
                        </span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Driving measurable results for students, companies, and universities.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="glass rounded-3xl p-8 text-center group hover:bg-white/15 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                {inView ? (
                                    <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
                                ) : (
                                    `0${stat.suffix}`
                                )}
                            </div>
                            <div className="text-sm text-white/50 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
