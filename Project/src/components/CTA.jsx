import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiAcademicCap, HiOfficeBuilding } from 'react-icons/hi';

export default function CTA() {
    const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

    return (
        <section id="cta" className="py-24 lg:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Start Your Placement
                        <br />
                        Journey Today
                    </h2>
                    <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
                        Join thousands of students and companies already using PMS to make campus recruitment smarter and more efficient.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#"
                        className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-primary-700 font-semibold text-lg shadow-2xl shadow-black/10 hover:shadow-black/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <HiAcademicCap className="w-6 h-6" />
                        Register as Student
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <HiOfficeBuilding className="w-6 h-6" />
                        Register as Company
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
