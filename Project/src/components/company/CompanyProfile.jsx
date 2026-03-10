import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiGlobe, HiMail, HiPhone, HiLocationMarker, HiPencil, HiCheckCircle } from 'react-icons/hi';
import { companyMockProfile } from './companyMockData';

export default function CompanyProfile() {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState(companyMockProfile);

    const handleSave = () => {
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all";

    return (
        <div className="space-y-6 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Company Profile</h1>
                    <p className="text-white/40 text-sm mt-1">Manage your company information</p>
                </div>
                {!editing && (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                        <HiPencil className="w-4 h-4" /> Edit Profile
                    </button>
                )}
            </motion.div>

            {saved && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm">
                    <HiCheckCircle className="w-5 h-5" /> Profile updated successfully!
                </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl">
                        {form.companyName.charAt(0)}
                    </div>
                    <div>
                        {editing ? (
                            <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className={inputClass} />
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-white">{form.companyName}</h2>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${form.isApproved ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                        {form.isApproved ? '✓ Approved' : '○ Pending Approval'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider">Description</label>
                        {editing ? (
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
                        ) : (
                            <p className="text-white/70 text-sm">{form.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider flex items-center gap-1"><HiGlobe className="w-3 h-3" /> Website</label>
                            {editing ? (
                                <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={inputClass} />
                            ) : (
                                <a href={form.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-sm hover:underline">{form.website}</a>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider flex items-center gap-1"><HiLocationMarker className="w-3 h-3" /> Location</label>
                            {editing ? (
                                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} />
                            ) : (
                                <p className="text-white/70 text-sm">{form.location}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider flex items-center gap-1"><HiMail className="w-3 h-3" /> HR Email</label>
                            {editing ? (
                                <input value={form.hrEmail} onChange={e => setForm({ ...form, hrEmail: e.target.value })} className={inputClass} />
                            ) : (
                                <p className="text-white/70 text-sm">{form.hrEmail}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider flex items-center gap-1"><HiPhone className="w-3 h-3" /> Contact Number</label>
                            {editing ? (
                                <input value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} className={inputClass} />
                            ) : (
                                <p className="text-white/70 text-sm">{form.contactNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {editing && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-white/5">
                        <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">Save Changes</button>
                        <button onClick={() => { setForm(companyMockProfile); setEditing(false); }} className="px-5 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-colors">Cancel</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
