import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiStar } from 'react-icons/hi';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Software Engineer at Google',
        type: 'Student',
        avatar: 'PS',
        avatarColor: 'from-blue-500 to-cyan-400',
        quote: 'PMS made my placement journey seamless. I could track all my applications in one place, and the AI resume analyzer helped me optimize my resume for each company.',
        rating: 5,
    },
    {
        name: 'Rajesh Kumar',
        role: 'HR Manager, Infosys',
        type: 'Recruiter',
        avatar: 'RK',
        avatarColor: 'from-purple-500 to-pink-400',
        quote: 'The recruitment portal is incredibly intuitive. We could manage our entire campus hiring pipeline — from posting JDs to extending offers — all through PMS.',
        rating: 5,
    },
    {
        name: 'Anisha Patel',
        role: 'Data Analyst at Amazon',
        type: 'Student',
        avatar: 'AP',
        avatarColor: 'from-orange-500 to-amber-400',
        quote: 'I received three offers through PMS! The platform matched me with roles that perfectly aligned with my skills. The interview scheduling feature was a lifesaver.',
        rating: 5,
    },
    {
        name: 'Vikram Singh',
        role: 'Campus Relations, TCS',
        type: 'Recruiter',
        avatar: 'VS',
        avatarColor: 'from-emerald-500 to-teal-400',
        quote: 'PMS analytics gave us deep insights into candidate quality and hiring trends. It reduced our time-to-hire by 40% compared to our previous process.',
        rating: 5,
    },
    {
        name: 'Neha Gupta',
        role: 'Product Designer at Adobe',
        type: 'Student',
        avatar: 'NG',
        avatarColor: 'from-red-500 to-rose-400',
        quote: 'The placement analytics showed me exactly where I stood among my peers. It motivated me to improve and ultimately helped me land my dream role at Adobe.',
        rating: 5,
    },
    {
        name: 'Arjun Mehta',
        role: 'Talent Lead, Microsoft',
        type: 'Recruiter',
        avatar: 'AM',
        avatarColor: 'from-indigo-500 to-violet-400',
        quote: 'We have been using PMS for 3 years now. The platform consistently delivers high-quality candidates and has become integral to our campus hiring strategy.',
        rating: 5,
    },
];

function TestimonialCard({ testimonial, index }) {
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                {/* Quote icon */}
                <svg className="w-10 h-10 text-primary-100 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>

                <p className="text-gray-600 leading-relaxed mb-6">{testimonial.quote}</p>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <HiStar key={i} className="w-5 h-5 text-amber-400" />
                    ))}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {testimonial.avatar}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${testimonial.type === 'Student'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}>
                        {testimonial.type}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function Testimonials() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section className="py-24 lg:py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What People{' '}
                        <span className="gradient-text">Say About Us</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Hear from students and recruiters who have transformed their placement experience.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} testimonial={t} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
