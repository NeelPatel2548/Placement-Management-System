import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Generate a consistent color from a string
function stringToColor(str) {
    const colors = ['#4285F4', '#00A4EF', '#FF9900', '#E50914', '#1877F2', '#86BC25', '#007CC3', '#A100FF', '#0070AD', '#F80000', '#3A1078', '#0F62FE'];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function CompanyLogo({ name, color }) {
    return (
        <div className="flex-shrink-0 w-44 h-20 mx-4 rounded-2xl bg-white border border-gray-100 shadow-md shadow-gray-100/50 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                >
                    {(name || '?')[0].toUpperCase()}
                </div>
                <span className="font-semibold text-gray-700 text-sm">{name}</span>
            </div>
        </div>
    );
}

export default function TopRecruiters() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/companies`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.companies) {
                    setCompanies(d.companies.map(c => ({
                        name: c.companyName || c.name || 'Company',
                        industry: c.industry || '',
                        location: c.location || '',
                        website: c.website || '',
                        color: stringToColor(c.companyName || c.name || ''),
                    })));
                }
            })
            .catch(() => { /* show empty state */ })
            .finally(() => setLoading(false));
    }, []);

    const row1 = companies.slice(0, Math.ceil(companies.length / 2));
    const row2 = companies.slice(Math.ceil(companies.length / 2));

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

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : companies.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-sm">Recruiting companies will appear here once approved.</p>
                </div>
            ) : (
                <>
                    {/* Marquee Row 1 */}
                    {row1.length > 0 && (
                        <div className="relative mb-6">
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                            <div className="flex animate-marquee">
                                {[...row1, ...row1, ...row1].map((c, i) => (
                                    <CompanyLogo key={i} name={c.name} color={c.color} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Marquee Row 2 (reverse) */}
                    {row2.length > 0 && (
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                            <div className="flex animate-marquee" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
                                {[...row2, ...row2, ...row2].map((c, i) => (
                                    <CompanyLogo key={i} name={c.name} color={c.color} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
