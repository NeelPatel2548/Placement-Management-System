import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed, HiBell, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function SettingsPage() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const [tab, setTab] = useState('password');
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [notifPrefs, setNotifPrefs] = useState({
        jobAlerts: true, interviewReminders: true, applicationUpdates: true, announcements: true, emailNotif: false,
    });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        if (newPass !== confirmPass) { setMsg({ type: 'error', text: 'Passwords do not match' }); return; }
        if (!PASSWORD_REGEX.test(newPass)) { setMsg({ type: 'error', text: 'Password must include uppercase, lowercase, number and special character.' }); return; }
        setLoading(true);
        try {
            const token = localStorage.getItem('pms_token');
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
            });
            const data = await res.json();
            if (data.success) { setMsg({ type: 'success', text: 'Password changed successfully' }); setCurrentPass(''); setNewPass(''); setConfirmPass(''); }
            else setMsg({ type: 'error', text: data.message });
        } catch { setMsg({ type: 'error', text: 'Unable to connect to server' }); }
        finally { setLoading(false); }
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-white/40 text-sm mt-1">Manage your account preferences</p>
            </motion.div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
                {[{ key: 'password', icon: HiLockClosed, label: 'Password' }, { key: 'notifications', icon: HiBell, label: 'Notifications' }].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/40 hover:text-white/60'
                            }`}>
                        <t.icon className="w-4 h-4" />{t.label}
                    </button>
                ))}
            </motion.div>

            {/* Password Tab */}
            {tab === 'password' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 max-w-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <HiShieldCheck className="w-5 h-5 text-primary-400" />
                        <h2 className="text-white font-semibold">Change Password</h2>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="relative">
                            <label className="block text-white/50 text-sm mb-1.5">Current Password</label>
                            <input type={showCurrent ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)} className={inputClass} required />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-9 text-white/30 hover:text-white/50">
                                {showCurrent ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-white/50 text-sm mb-1.5">New Password</label>
                            <input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} className={inputClass} required />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-9 text-white/30 hover:text-white/50">
                                {showNew ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1.5">Confirm New Password</label>
                            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={inputClass} required />
                        </div>
                        {msg.text && (
                            <div className={`p-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/15 border border-red-500/20 text-red-400'}`}>
                                {msg.text}
                            </div>
                        )}
                        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Notifications Tab */}
            {tab === 'notifications' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 max-w-lg">
                    <h2 className="text-white font-semibold mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                        {Object.entries({ jobAlerts: 'Job Alerts', interviewReminders: 'Interview Reminders', applicationUpdates: 'Application Updates', announcements: 'Announcements', emailNotif: 'Email Notifications' }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                                <span className="text-white/70 text-sm">{label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={notifPrefs[key]} onChange={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))} className="sr-only peer" />
                                    <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-primary-500/60 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
