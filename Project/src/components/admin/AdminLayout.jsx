import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiUsers, HiOfficeBuilding, HiBriefcase, HiChartBar, HiSpeakerphone, HiDocumentReport, HiLogout, HiMenu, HiX, HiBell } from 'react-icons/hi';

const navItems = [
    { path: '/admin', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/admin/companies', icon: HiOfficeBuilding, label: 'Companies' },
    { path: '/admin/students', icon: HiUsers, label: 'Students' },
    { path: '/admin/jobs', icon: HiBriefcase, label: 'Job Drives' },
    { path: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
    { path: '/admin/announcements', icon: HiSpeakerphone, label: 'Announcements' },
    { path: '/admin/reports', icon: HiDocumentReport, label: 'Reports' },
];

function AdminSidebar({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const handleLogout = () => { localStorage.removeItem('pms_token'); localStorage.removeItem('pms_user'); navigate('/login'); };

    const linkClass = (isActive) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-rose-500/15 text-rose-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
        }`;

    const Content = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">P</div>
                <div><h1 className="text-white font-bold text-lg leading-none">PMS</h1><p className="text-white/30 text-[10px]">Admin Panel</p></div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ path, icon: Icon, label, end }) => (
                    <NavLink key={path} to={path} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                        <Icon className="w-5 h-5" /><span>{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full text-sm"><HiLogout className="w-4 h-4" /> Logout</button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0c0e1a] border-r border-white/5 z-40"><Content /></aside>
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0c0e1a] border-r border-white/5 z-50 lg:hidden">
                        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/40"><HiX className="w-5 h-5" /></button>
                        <Content />
                    </aside>
                </>
            )}
        </>
    );
}

export function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    return (
        <div className="min-h-screen bg-[#080a12] text-white">
            <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="lg:ml-64">
                <header className="sticky top-0 z-30 bg-[#0c0e1a]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-6">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/50"><HiMenu className="w-6 h-6" /></button>
                    <div />
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                            <HiBell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">{(user.name || 'A')[0].toUpperCase()}</div>
                            <span className="text-white/80 text-sm hidden md:block">{user.name || 'Admin'}</span>
                        </div>
                    </div>
                </header>
                <main className="p-4 lg:p-6"><Outlet /></main>
            </div>
        </div>
    );
}
