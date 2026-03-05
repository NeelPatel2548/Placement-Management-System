import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiDocumentAdd, HiUsers, HiCog, HiLogout, HiMenu, HiX, HiBell, HiChevronDown } from 'react-icons/hi';

const navItems = [
    { path: '/company', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/company/post-job', icon: HiDocumentAdd, label: 'Post Job' },
    { path: '/company/applicants', icon: HiUsers, label: 'Applicants' },
    { path: '/company/settings', icon: HiCog, label: 'Settings' },
];

function CompanySidebar({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const handleLogout = () => { localStorage.removeItem('pms_token'); localStorage.removeItem('pms_user'); navigate('/login'); };

    const linkClass = (isActive) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
        }`;

    const Content = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">P</div>
                <div><h1 className="text-white font-bold text-lg leading-none">PMS</h1><p className="text-white/30 text-[10px]">Company Portal</p></div>
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

export function CompanyLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    return (
        <div className="min-h-screen bg-[#080a12] text-white">
            <CompanySidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="lg:ml-64">
                <header className="sticky top-0 z-30 bg-[#0c0e1a]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-6">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/50"><HiMenu className="w-6 h-6" /></button>
                    <div />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">{(user.name || 'C')[0].toUpperCase()}</div>
                        <span className="text-white/80 text-sm hidden md:block">{user.name || 'Company'}</span>
                    </div>
                </header>
                <main className="p-4 lg:p-6"><Outlet /></main>
            </div>
        </div>
    );
}

export function CompanyDashboard() {
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
                <p className="text-white/40 text-sm mt-1">Manage job postings and applicants</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{ label: 'Active Jobs', value: '0', color: 'emerald' }, { label: 'Total Applicants', value: '0', color: 'blue' }, { label: 'Interviews', value: '0', color: 'amber' }].map(s => (
                    <div key={s.label} className={`bg-[#0f1120] border border-${s.color}-500/20 rounded-2xl p-5`}>
                        <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
                        <p className="text-white/40 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-white/30">Post your first job to start receiving applications</p>
                <a href="/company/post-job" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">Post a Job</a>
            </div>
        </div>
    );
}

export function CompanyPostJob() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Post a Job</h1>
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 max-w-2xl">
                <p className="text-white/40 text-sm">Job posting form will be available once backend APIs are connected.</p>
            </div>
        </div>
    );
}

export function CompanyApplicants() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Applicants</h1>
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-white/30">No applicants yet. Post a job to start receiving applications.</p>
            </div>
        </div>
    );
}
