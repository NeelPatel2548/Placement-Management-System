import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiAcademicCap, HiBriefcase, HiDocumentText, HiPencil, HiCheck, HiExternalLink, HiUpload } from 'react-icons/hi';
import api from '../../services/api';

const skillOptions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Machine Learning', 'Data Science', 'Deep Learning',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
    'Git', 'Linux', 'REST API', 'GraphQL',
];

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const [editing, setEditing] = useState(null);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/student/profile');
                setProfile(res.data.student || {});
            } catch (err) {
                if (err.response?.status === 404) {
                    setProfile({});
                } else {
                    setError('Failed to load profile');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const update = (field) => (e) => setProfile(p => ({ ...p, [field]: e.target.value }));
    const toggleSkill = (s) => setProfile(p => ({
        ...p, skills: (p.skills || []).includes(s) ? p.skills.filter(sk => sk !== s) : [...(p.skills || []), s],
    }));

    const handleSave = async () => {
        try {
            setSaving(true);
            setSaveMsg('');
            
            // Clean payload to prevent Mongoose CastErrors with empty strings on Number fields
            const payload = { ...profile };
            const numericFields = ['tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester'];
            numericFields.forEach(field => {
                if (payload[field] === '') {
                    payload[field] = null; // Send null instead of empty string
                } else if (payload[field] !== undefined && payload[field] !== null) {
                    payload[field] = Number(payload[field]);
                }
            });

            await api.put('/api/student/profile', payload);
            setSaveMsg('Profile updated successfully!');
            setEditing(null);
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err) {
            setSaveMsg('Failed to save profile');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('resume', file);
            const res = await api.post('/api/student/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(p => ({ ...p, resumeId: res.data.resume }));
            setSaveMsg('Resume uploaded successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err) {
            setSaveMsg('Failed to upload resume');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const profilePercent = (() => {
        const fields = ['phone', 'dob', 'gender', 'address', 'enrollmentNo', 'branch', 'tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester', 'linkedin', 'github'];
        const filled = fields.filter(f => profile[f]).length;
        const hasSkills = (profile.skills || []).length > 0 ? 1 : 0;
        const hasResume = profile.resumeId ? 1 : 0;
        return Math.round(((filled + hasSkills + hasResume) / (fields.length + 2)) * 100);
    })();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Retry</button>
            </div>
        );
    }

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';
    const labelClass = 'block text-white/40 text-xs mb-1';

    const InfoRow = ({ label, value, href }) => (
        <div className="py-2">
            <p className="text-white/30 text-xs">{label}</p>
            {href ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-400 text-sm hover:underline flex items-center gap-1">{value} <HiExternalLink className="w-3 h-3" /></a>
            ) : (
                <p className="text-white/80 text-sm">{value || '—'}</p>
            )}
        </div>
    );

    const SectionHeader = ({ icon: Icon, title, section }) => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary-400" />
                <h2 className="text-white font-semibold">{title}</h2>
            </div>
            {editing === section ? (
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50">
                    <HiCheck className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                </button>
            ) : (
                <button onClick={() => setEditing(section)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-colors">
                    <HiPencil className="w-3.5 h-3.5" /> Edit
                </button>
            )}
        </div>
    );

    const resumeData = typeof profile.resumeId === 'object' ? profile.resumeId : null;

    return (
        <div className="space-y-6">
            {/* Save feedback */}
            {saveMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-sm text-center border ${saveMsg.includes('success') || saveMsg.includes('uploaded') ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' : 'bg-red-500/15 border-red-500/20 text-red-400'}`}>
                    {saveMsg}
                </motion.div>
            )}

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-white/40 text-sm mt-1">Manage your profile and academic information</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-500/10 border border-primary-500/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary-500/30">
                        {(user.name || 'S')[0].toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-white">{user.name || 'Student'}</h2>
                        <p className="text-white/40 text-sm">{user.email} {profile.enrollmentNo ? `• ${profile.enrollmentNo}` : ''}</p>
                        <p className="text-white/30 text-xs mt-1">{profile.branch || 'Branch not set'} {profile.currentSemester ? `• Semester ${profile.currentSemester}` : ''}</p>
                    </div>
                    <div className="sm:ml-auto text-center">
                        <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#grad)" strokeWidth="3"
                                    strokeDasharray={`${profilePercent}, 100`} strokeLinecap="round" />
                                <defs><linearGradient id="grad"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">{profilePercent}%</span>
                        </div>
                        <p className="text-white/30 text-[10px] mt-1">Complete</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <SectionHeader icon={HiUser} title="Personal Information" section="personal" />
                    {editing === 'personal' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelClass}>Phone</label><input value={profile.phone || ''} onChange={update('phone')} className={inputClass} /></div>
                            <div><label className={labelClass}>Date of Birth</label><input type="date" value={profile.dob ? profile.dob.slice(0, 10) : ''} onChange={update('dob')} className={inputClass} /></div>
                            <div><label className={labelClass}>Gender</label>
                                <select value={profile.gender || ''} onChange={update('gender')} className={inputClass}>
                                    <option value="" className="bg-[#0f1120]">Select</option>
                                    <option value="male" className="bg-[#0f1120]">Male</option>
                                    <option value="female" className="bg-[#0f1120]">Female</option>
                                    <option value="other" className="bg-[#0f1120]">Other</option>
                                </select>
                            </div>
                            <div className="col-span-2"><label className={labelClass}>Address</label><input value={profile.address || ''} onChange={update('address')} className={inputClass} /></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4">
                            <InfoRow label="Phone" value={profile.phone} />
                            <InfoRow label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ''} />
                            <InfoRow label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ''} />
                            <InfoRow label="Address" value={profile.address} />
                        </div>
                    )}
                </motion.div>

                {/* Academic */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <SectionHeader icon={HiAcademicCap} title="Academic Details" section="academic" />
                    {editing === 'academic' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelClass}>Enrollment No</label><input value={profile.enrollmentNo || ''} onChange={update('enrollmentNo')} className={inputClass} /></div>
                            <div><label className={labelClass}>Branch</label><input value={profile.branch || ''} onChange={update('branch')} className={inputClass} /></div>
                            <div><label className={labelClass}>10th %</label><input type="number" value={profile.tenthPercentage || ''} onChange={update('tenthPercentage')} className={inputClass} /></div>
                            <div><label className={labelClass}>12th %</label><input type="number" value={profile.twelfthPercentage || ''} onChange={update('twelfthPercentage')} className={inputClass} /></div>
                            <div><label className={labelClass}>CGPA</label><input type="number" step="0.1" value={profile.cgpa || ''} onChange={update('cgpa')} className={inputClass} /></div>
                            <div><label className={labelClass}>Semester</label><input type="number" value={profile.currentSemester || ''} onChange={update('currentSemester')} className={inputClass} /></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4">
                            <InfoRow label="Enrollment No" value={profile.enrollmentNo} />
                            <InfoRow label="Branch" value={profile.branch} />
                            <InfoRow label="10th Percentage" value={profile.tenthPercentage ? `${profile.tenthPercentage}%` : ''} />
                            <InfoRow label="12th Percentage" value={profile.twelfthPercentage ? `${profile.twelfthPercentage}%` : ''} />
                            <InfoRow label="Graduation CGPA" value={profile.cgpa} />
                            <InfoRow label="Current Semester" value={profile.currentSemester} />
                            <InfoRow label="Backlogs" value={profile.backlogs ? 'Yes' : 'No'} />
                        </div>
                    )}
                </motion.div>

                {/* Professional */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <SectionHeader icon={HiBriefcase} title="Professional Details" section="professional" />
                    <div className="mb-4">
                        <p className="text-white/40 text-xs mb-2">Skills</p>
                        {editing === 'professional' ? (
                            <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] rounded-xl max-h-36 overflow-y-auto">
                                {skillOptions.map(s => (
                                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${(profile.skills || []).includes(s)
                                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                            }`}>{s}</button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {(profile.skills || []).length > 0 ? profile.skills.map(s => (
                                    <span key={s} className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-xs border border-primary-500/20">{s}</span>
                                )) : <p className="text-white/30 text-sm">No skills added yet</p>}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        {editing === 'professional' ? (
                            <>
                                <div><label className={labelClass}>LinkedIn</label><input value={profile.linkedin || ''} onChange={update('linkedin')} className={inputClass} /></div>
                                <div><label className={labelClass}>GitHub</label><input value={profile.github || ''} onChange={update('github')} className={inputClass} /></div>
                                <div className="col-span-2"><label className={labelClass}>Internship Experience</label><input value={profile.internshipExperience || ''} onChange={update('internshipExperience')} className={inputClass} /></div>
                            </>
                        ) : (
                            <>
                                <InfoRow label="Projects" value={(profile.projects || []).join(', ')} />
                                <InfoRow label="Certifications" value={(profile.certifications || []).join(', ')} />
                                <InfoRow label="Internship" value={profile.internshipExperience} />
                                <InfoRow label="LinkedIn" value={profile.linkedin} href={profile.linkedin} />
                                <InfoRow label="GitHub" value={profile.github} href={profile.github} />
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Resume */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <HiDocumentText className="w-5 h-5 text-primary-400" />
                        <h2 className="text-white font-semibold">Resume</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] rounded-xl p-4">
                        <div>
                            <p className="text-white/80 text-sm font-medium">
                                {resumeData ? `Resume ${resumeData.version || ''}` : 'No resume uploaded'}
                            </p>
                            <p className="text-white/30 text-xs">
                                {resumeData?.createdAt ? `Uploaded: ${new Date(resumeData.createdAt).toLocaleDateString()}` : 'Upload your resume to apply for jobs'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {resumeData?.fileUrl && (
                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resumeData.fileUrl}`} target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">Download</a>
                            )}
                            <label className={`px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                <HiUpload className="w-4 h-4 inline mr-1" />
                                {uploading ? 'Uploading...' : 'Upload New'}
                                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
