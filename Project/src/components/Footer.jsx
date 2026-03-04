import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';

const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#' },
    { name: 'Contact', href: '#' },
];

const studentLinks = [
    { name: 'Student Login', href: '#' },
    { name: 'Register', href: '#' },
    { name: 'Browse Jobs', href: '#' },
    { name: 'Resume Builder', href: '#' },
    { name: 'Interview Prep', href: '#' },
];

const socialLinks = [
    { icon: FaFacebookF, href: '#', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, href: '#', color: 'hover:bg-sky-500' },
    { icon: FaLinkedinIn, href: '#', color: 'hover:bg-blue-700' },
    { icon: FaInstagram, href: '#', color: 'hover:bg-pink-600' },
    { icon: FaGithub, href: '#', color: 'hover:bg-gray-700' },
];

export default function Footer() {
    return (
        <footer id="footer" className="bg-[#0f0c29] text-white relative overflow-hidden">
            {/* Decorative blur */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-700/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-600/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Main Footer */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* About */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <div>
                                <span className="font-bold text-xl text-white">PMS</span>
                                <span className="block text-[10px] text-white/50">Placement Management</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            PMS is a comprehensive placement management platform designed to bridge the
                            gap between students, universities, and companies through intelligent matching
                            and seamless recruitment workflows.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white ${social.color} transition-all duration-300 hover:scale-110`}
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Students */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">For Students</h4>
                        <ul className="space-y-3">
                            {studentLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <HiLocationMarker className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white/50 text-sm">
                                    123 University Campus,<br />Tech City, IN 400001
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="mailto:support@pms.edu" className="text-white/50 hover:text-white text-sm transition-colors">
                                    support@pms.edu
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="tel:+911234567890" className="text-white/50 hover:text-white text-sm transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © 2026 PMS — Placement Management System. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-white/40 hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
