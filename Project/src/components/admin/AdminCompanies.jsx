import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiSearch, HiCheck, HiX, HiExternalLink } from 'react-icons/hi';
import { adminMockCompanies } from './adminMockData';

export default function AdminCompanies() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companies, setCompanies] = useState(adminMockCompanies);

    const filtered = companies.filter(c => {
        if (search && !c.companyName.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter === 'approved' && !c.isApproved) return false;
        if (statusFilter === 'pending' && c.isApproved) return false;
        return true;
    });

    const updateApproval = (id, approved) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isApproved: approved } : c));
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Company Management</h1>
                <p className="text-white/40 text-sm mt-1">Approve companies and manage recruitment partners</p>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500/50" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500/50">
                        <option value="all">All Companies</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </motion.div>

            {/* Companies Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="text-left p-4 font-medium">Company</th>
                                <th className="text-left p-4 font-medium">Location</th>
                                <th className="text-left p-4 font-medium">Jobs Posted</th>
                                <th className="text-left p-4 font-medium">Status</th>
                                <th className="text-left p-4 font-medium">Registered</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-xs">
                                                {c.companyName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{c.companyName}</p>
                                                <p className="text-white/30 text-xs">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-white/50">{c.location}</td>
                                    <td className="p-4 text-white/50">{c.jobsPosted}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.isApproved ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>
                                            {c.isApproved ? '✓ Approved' : '○ Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/30 text-xs">{c.createdAt}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1.5">
                                            {!c.isApproved && (
                                                <button onClick={() => updateApproval(c.id, true)} title="Approve"
                                                    className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 transition-colors">
                                                    <HiCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            {c.isApproved && (
                                                <button onClick={() => updateApproval(c.id, false)} title="Revoke"
                                                    className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                                                    <HiX className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-white/30">No companies match the current filters</div>
                )}
            </motion.div>
        </div>
    );
}
