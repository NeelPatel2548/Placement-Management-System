import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, FileText, CalendarDays,
    BarChart3, MessageSquare, Bell, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/company', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/company/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/company/applications', icon: FileText, label: 'Applications' },
    { path: '/company/interviews', icon: CalendarDays, label: 'Interviews' },
    { path: '/company/reports', icon: BarChart3, label: 'Reports' },
    { path: '/company/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/company/notifications', icon: Bell, label: 'Notifications' },
];

function CompanySidebar({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
        navigate('/login');
    };

    const Content = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/20">P</div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-none tracking-tight">PMS</h1>
                    <p className="text-blue-300/50 text-[10px] font-medium mt-0.5">Company Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ path, icon: Icon, label, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? 'bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-500/5'
                                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-blue-400' : ''}`} strokeWidth={isActive ? 2.2 : 1.8} />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400/60" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-sm font-medium">
                    <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 z-40" style={{ backgroundColor: '#1e3a5f' }}>
                <Content />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed left-0 top-0 h-screen w-64 z-50 lg:hidden" style={{ backgroundColor: '#1e3a5f' }}>
                        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <Content />
                    </aside>
                </>
            )}
        </>
    );
}

export function CompanyLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white">
            <CompanySidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="lg:ml-64">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-[#0d1321]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-6">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/50 hover:text-white/80 transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div />
                    <div className="flex items-center gap-3">
                        <NavLink to="/company/notifications" className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        </NavLink>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                {(user.name || 'C')[0].toUpperCase()}
                            </div>
                            <span className="text-white/80 text-sm font-medium hidden md:block">{user.name || 'Company'}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
