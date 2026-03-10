import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiSearch, HiTrash } from 'react-icons/hi';
import { adminMockStudents } from './adminMockData';

export default function AdminStudents() {
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [students] = useState(adminMockStudents);

    const filtered = students.filter(s => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
        if (branchFilter !== 'all' && s.branch !== branchFilter) return false;
        if (statusFilter === 'placed' && s.placementStatus !== 'placed') return false;
        if (statusFilter === 'unplaced' && s.placementStatus !== 'unplaced') return false;
        return true;
    });

    const branches = [...new Set(students.map(s => s.branch))];

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Student Management</h1>
                <p className="text-white/40 text-sm mt-1">View and manage registered students</p>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500/50" />
                    </div>
                    <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500/50">
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500/50">
                        <option value="all">All Status</option>
                        <option value="placed">Placed</option>
                        <option value="unplaced">Unplaced</option>
                    </select>
                </div>
                <p className="text-white/30 text-xs mt-3">{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</p>
            </motion.div>

            {/* Students Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="text-left p-4 font-medium">Student</th>
                                <th className="text-left p-4 font-medium">Branch</th>
                                <th className="text-left p-4 font-medium">CGPA</th>
                                <th className="text-left p-4 font-medium">Profile</th>
                                <th className="text-left p-4 font-medium">Status</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{s.name}</p>
                                                <p className="text-white/30 text-xs">{s.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-white/50">{s.branch}</td>
                                    <td className="p-4 text-white/50">{s.cgpa}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.profileCompleted ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>
                                            {s.profileCompleted ? 'Complete' : 'Incomplete'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.placementStatus === 'placed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/15 text-blue-400 border-blue-500/20'}`}>
                                            {s.placementStatus === 'placed' ? '✓ Placed' : '○ Unplaced'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-colors" title="Remove">
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-white/30">No students match the current filters</div>
                )}
            </motion.div>
        </div>
    );
}
