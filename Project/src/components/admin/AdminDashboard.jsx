import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiUsers, HiChartBar, HiCog, HiLogout, HiMenu, HiX } from 'react-icons/hi';

const navItems = [
    { path: '/admin', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/admin/manage-users', icon: HiUsers, label: 'Manage Users' },
    { path: '/admin/reports', icon: HiChartBar, label: 'Reports' },
    { path: '/admin/settings', icon: HiCog, label: 'Settings' },
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
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">{(user.name || 'A')[0].toUpperCase()}</div>
                        <span className="text-white/80 text-sm hidden md:block">{user.name || 'Admin'}</span>
                    </div>
                </header>
                <main className="p-4 lg:p-6"><Outlet /></main>
            </div>
        </div>
    );
}

export function AdminDashboard() {
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/40 text-sm mt-1">System overview and management</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{ label: 'Total Students', value: '0', color: 'indigo' }, { label: 'Companies', value: '0', color: 'emerald' }, { label: 'Active Jobs', value: '0', color: 'amber' }, { label: 'Placements', value: '0', color: 'rose' }].map(s => (
                    <div key={s.label} className={`bg-[#0f1120] border border-${s.color}-500/20 rounded-2xl p-5`}>
                        <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
                        <p className="text-white/40 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AdminManageUsers() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-white/30">User management interface will be connected to backend APIs.</p>
            </div>
        </div>
    );
}

export function AdminReports() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-white/30">Reports and analytics will be available once data is collected.</p>
            </div>
        </div>
    );
}
