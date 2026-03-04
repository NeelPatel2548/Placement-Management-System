import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const companies = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Apple', color: '#555555' },
    { name: 'Meta', color: '#1877F2' },
    { name: 'Netflix', color: '#E50914' },
    { name: 'Adobe', color: '#FF0000' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'Oracle', color: '#F80000' },
    { name: 'IBM', color: '#0F62FE' },
    { name: 'Deloitte', color: '#86BC25' },
    { name: 'Infosys', color: '#007CC3' },
    { name: 'TCS', color: '#2B6CB0' },
    { name: 'Wipro', color: '#3A1078' },
    { name: 'Accenture', color: '#A100FF' },
    { name: 'Capgemini', color: '#0070AD' },
];

function CompanyLogo({ name, color }) {
    return (
        <div className="flex-shrink-0 w-44 h-20 mx-4 rounded-2xl bg-white border border-gray-100 shadow-md shadow-gray-100/50 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                >
                    {name[0]}
                </div>
                <span className="font-semibold text-gray-700 text-sm">{name}</span>
            </div>
        </div>
    );
}

export default function TopRecruiters() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="recruiters" className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                        Our Partners
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Trusted by{' '}
                        <span className="gradient-text">Top Recruiters</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Leading companies from around the world recruit through our platform.
                    </p>
                </motion.div>
            </div>

            {/* Marquee Row 1 */}
            <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                <div className="flex animate-marquee">
                    {[...companies.slice(0, 8), ...companies.slice(0, 8)].map((c, i) => (
                        <CompanyLogo key={i} name={c.name} color={c.color} />
                    ))}
                </div>
            </div>

            {/* Marquee Row 2 (reverse) */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                <div className="flex animate-marquee" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
                    {[...companies.slice(8), ...companies.slice(8)].map((c, i) => (
                        <CompanyLogo key={i} name={c.name} color={c.color} />
                    ))}
                </div>
            </div>
        </section>
    );
}
