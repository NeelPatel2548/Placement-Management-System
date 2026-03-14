import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiCheck, HiX } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminCompanies() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/api/admin/companies');
                setCompanies(res.data.companies || []);
            } catch (err) {
                setError('Failed to load companies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleApprove = async (companyId) => {
        try {
            await api.put(`/api/admin/companies/${companyId}/approve`);
            setCompanies(prev => prev.map(c => c._id === companyId ? { ...c, isApproved: true } : c));
        } catch (err) { console.error('Approve error:', err); }
    };

    const handleRevoke = async (companyId) => {
        try {
            await api.put(`/api/admin/companies/${companyId}/reject`);
            setCompanies(prev => prev.map(c => c._id === companyId ? { ...c, isApproved: false } : c));
        } catch (err) { console.error('Revoke error:', err); }
    };

    const filtered = companies.filter(c => {
        const name = c.companyName || '';
        const email = c.userId?.email || '';
        if (search && !name.toLowerCase().includes(search.toLowerCase()) && !email.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter === 'approved' && !c.isApproved) return false;
        if (statusFilter === 'pending' && c.isApproved) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors">Retry</button>
            </div>
        );
    }

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
                                <th className="text-left p-4 font-medium">Industry</th>
                                <th className="text-left p-4 font-medium">Status</th>
                                <th className="text-left p-4 font-medium">Registered</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-xs">
                                                {(c.companyName || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{c.companyName || 'N/A'}</p>
                                                <p className="text-white/30 text-xs">{c.userId?.email || ''}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-white/50">{c.location || '—'}</td>
                                    <td className="p-4 text-white/50">{c.industry || '—'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.isApproved ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>
                                            {c.isApproved ? '✓ Approved' : '○ Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/30 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1.5">
                                            {!c.isApproved && (
                                                <button onClick={() => handleApprove(c._id)} title="Approve"
                                                    className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 transition-colors">
                                                    <HiCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            {c.isApproved && (
                                                <button onClick={() => handleRevoke(c._id)} title="Revoke"
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
