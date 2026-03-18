import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiAcademicCap, HiBriefcase, HiDocumentText, HiPencil, HiExternalLink, HiX, HiPlus, HiCheck } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

const skillOptions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Machine Learning', 'Data Science', 'Deep Learning',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
    'Git', 'Linux', 'REST API', 'GraphQL',
];

const branchOptions = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'Chemical', 'Civil', 'Other'];

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState('');

    const fetchProfile = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/api/student/profile');
            setProfile(res.data.student);
            setFormData(prepareFormData(res.data.student));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const prepareFormData = (student) => {
        if (!student) return {};
        return {
            phone: student.phone || '',
            dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
            gender: student.gender || '',
            address: student.address || '',
            enrollmentNo: student.enrollmentNo || '',
            branch: student.branch || '',
            tenthPercentage: student.tenthPercentage || '',
            twelfthPercentage: student.twelfthPercentage || '',
            cgpa: student.cgpa || '',
            currentSemester: student.currentSemester || '',
            backlogs: student.backlogs || false,
            skills: student.skills || [],
            projects: student.projects?.join(', ') || '',
            certifications: student.certifications?.join(', ') || '',
            internshipExperience: student.internshipExperience || '',
            linkedin: student.linkedin || '',
            github: student.github || '',
        };
    };

    const handleChange = (field) => (e) => setFormData(f => ({ ...f, [field]: e.target.value }));

    const toggleSkill = (skill) => {
        setFormData(f => ({
            ...f,
            skills: f.skills.includes(skill)
                ? f.skills.filter(s => s !== skill)
                : [...f.skills, skill],
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const payload = {
                ...formData,
                tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : undefined,
                twelfthPercentage: formData.twelfthPercentage ? Number(formData.twelfthPercentage) : undefined,
                cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
                currentSemester: formData.currentSemester ? Number(formData.currentSemester) : undefined,
                projects: formData.projects ? formData.projects.split(',').map(p => p.trim()).filter(Boolean) : [],
                certifications: formData.certifications ? formData.certifications.split(',').map(c => c.trim()).filter(Boolean) : [],
            };
            await api.put('/api/student/profile', payload);
            const updated = await api.get('/api/student/profile');
            setProfile(updated.data.student);
            setFormData(prepareFormData(updated.data.student));
            setIsEditing(false);
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(prepareFormData(profile));
        setIsEditing(false);
        setSaveError(null);
    };

    const handleResumeUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setUploadProgress(0);
        setSaveError(null);
        const fd = new FormData();
        fd.append('resume', file);
        try {
            await api.post('/api/student/resume', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
            });
            setUploadSuccess('Resume uploaded successfully!');
            setTimeout(() => setUploadSuccess(''), 3000);
            const updated = await api.get('/api/student/profile');
            setProfile(updated.data.student);
            setFormData(prepareFormData(updated.data.student));
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Resume upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';
    const labelClass = 'block text-white/60 text-sm font-medium mb-1.5';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={fetchProfile} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <HiUser className="w-16 h-16 text-white/10" />
                <p className="text-white/40 text-sm">No profile found. Complete your profile to get started.</p>
            </div>
        );
    }

    // Profile completion
    const profileFields = ['phone', 'dob', 'gender', 'address', 'enrollmentNo', 'branch', 'tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester', 'linkedin', 'github'];
    const filledFields = profileFields.filter(f => profile[f]).length;
    const hasSkills = profile.skills?.length > 0 ? 1 : 0;
    const hasResume = profile.resumeId ? 1 : 0;
    const profilePercent = Math.round(((filledFields + hasSkills + hasResume) / (profileFields.length + 2)) * 100);

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

    // ═══════════════════ EDIT MODE ═══════════════════
    if (isEditing) {
        return (
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                        <p className="text-white/40 text-sm mt-1">Update your information</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCancel}
                            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                            <HiX className="w-4 h-4" /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <HiCheck className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.div>

                {saveError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm">{saveError}</motion.div>
                )}

                {/* Personal Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><HiUser className="w-5 h-5 text-primary-400" /> Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className={labelClass}>Phone</label><input type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange('phone')} className={inputClass} /></div>
                        <div><label className={labelClass}>Date of Birth</label><input type="date" value={formData.dob} onChange={handleChange('dob')} className={inputClass} /></div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select value={formData.gender} onChange={handleChange('gender')} className={inputClass}>
                                <option value="" className="bg-[#0f1120]">Select</option>
                                <option value="male" className="bg-[#0f1120]">Male</option>
                                <option value="female" className="bg-[#0f1120]">Female</option>
                                <option value="other" className="bg-[#0f1120]">Other</option>
                            </select>
                        </div>
                        <div><label className={labelClass}>Enrollment No.</label><input type="text" placeholder="EN2024001" value={formData.enrollmentNo} onChange={handleChange('enrollmentNo')} className={inputClass} /></div>
                    </div>
                    <div className="mt-4"><label className={labelClass}>Address</label><textarea placeholder="Your full address" value={formData.address} onChange={handleChange('address')} rows={2} className={inputClass} /></div>
                </motion.div>

                {/* Academic */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><HiAcademicCap className="w-5 h-5 text-primary-400" /> Academic Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className={labelClass}>10th Percentage</label><input type="number" placeholder="92" value={formData.tenthPercentage} onChange={handleChange('tenthPercentage')} className={inputClass} min="0" max="100" /></div>
                        <div><label className={labelClass}>12th Percentage</label><input type="number" placeholder="88" value={formData.twelfthPercentage} onChange={handleChange('twelfthPercentage')} className={inputClass} min="0" max="100" /></div>
                        <div><label className={labelClass}>Graduation CGPA</label><input type="number" step="0.01" placeholder="8.5" value={formData.cgpa} onChange={handleChange('cgpa')} className={inputClass} min="0" max="10" /></div>
                        <div><label className={labelClass}>Current Semester</label><input type="number" placeholder="6" value={formData.currentSemester} onChange={handleChange('currentSemester')} className={inputClass} min="1" max="8" /></div>
                        <div>
                            <label className={labelClass}>Branch</label>
                            <select value={formData.branch} onChange={handleChange('branch')} className={inputClass}>
                                <option value="" className="bg-[#0f1120]">Select Branch</option>
                                {branchOptions.map(b => <option key={b} value={b} className="bg-[#0f1120]">{b}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={formData.backlogs} onChange={() => setFormData(f => ({ ...f, backlogs: !f.backlogs }))} className="sr-only peer" />
                                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-red-500/60 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"></div>
                            </label>
                            <span className="text-white/60 text-sm">Active Backlogs</span>
                        </div>
                    </div>
                </motion.div>

                {/* Professional */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><HiBriefcase className="w-5 h-5 text-primary-400" /> Professional Details</h2>
                    <div className="mb-4">
                        <label className={labelClass}>Skills (click to toggle)</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-40 overflow-y-auto">
                            {skillOptions.map(skill => (
                                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formData.skills?.includes(skill)
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                                    }`}>{skill}</button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className={labelClass}>Projects (comma separated)</label><textarea placeholder="Project 1, Project 2" value={formData.projects} onChange={handleChange('projects')} rows={2} className={inputClass} /></div>
                        <div><label className={labelClass}>Certifications (comma separated)</label><input type="text" placeholder="AWS, Google Analytics" value={formData.certifications} onChange={handleChange('certifications')} className={inputClass} /></div>
                        <div><label className={labelClass}>Internship Experience</label><input type="text" placeholder="3 months at TechCorp" value={formData.internshipExperience} onChange={handleChange('internshipExperience')} className={inputClass} /></div>
                        <div><label className={labelClass}>LinkedIn</label><input type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleChange('linkedin')} className={inputClass} /></div>
                        <div><label className={labelClass}>GitHub</label><input type="url" placeholder="https://github.com/..." value={formData.github} onChange={handleChange('github')} className={inputClass} /></div>
                    </div>
                </motion.div>

                {/* Resume Upload */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><HiDocumentText className="w-5 h-5 text-primary-400" /> Resume</h2>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-primary-400/30 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}>
                        <HiDocumentText className="w-10 h-10 text-white/20 mx-auto mb-2" />
                        <p className="text-white/60 text-sm font-medium">Click to upload resume (PDF)</p>
                        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                            onChange={(e) => { const file = e.target.files[0]; if (file) handleResumeUpload(file); }} />
                    </div>
                    {uploading && (
                        <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/50">Uploading...</span>
                                <span className="text-primary-400 font-semibold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        </div>
                    )}
                    {uploadSuccess && (
                        <p className="mt-3 text-emerald-400 text-sm">{uploadSuccess}</p>
                    )}
                    {profile.resumeId && (
                        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                            <HiCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300 text-sm">Resume uploaded (Version: {profile.resumeId.version || 'Latest'})</span>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    // ═══════════════════ VIEW MODE ═══════════════════
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-white/40 text-sm mt-1">View your profile and academic information</p>
                </div>
                <button onClick={() => { setFormData(prepareFormData(profile)); setIsEditing(true); setSaveError(null); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">
                    <HiPencil className="w-4 h-4" /> Edit Profile
                </button>
            </motion.div>

            {uploadSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm text-center">{uploadSuccess}</motion.div>
            )}

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-500/10 border border-primary-500/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary-500/30">
                        {(user.name || 'S')[0].toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-white">{user.name || 'Student'}</h2>
                        <p className="text-white/40 text-sm">{user.email} • {profile.enrollmentNo || 'No Enrollment No.'}</p>
                        <p className="text-white/30 text-xs mt-1">{profile.branch || 'No Branch'} • Semester {profile.currentSemester || '—'}</p>
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
                    <div className="flex items-center gap-2 mb-4"><HiUser className="w-5 h-5 text-primary-400" /><h2 className="text-white font-semibold">Personal Information</h2></div>
                    <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow label="Phone" value={profile.phone} />
                        <InfoRow label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : null} />
                        <InfoRow label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : null} />
                        <InfoRow label="Address" value={profile.address} />
                    </div>
                </motion.div>

                {/* Academic */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4"><HiAcademicCap className="w-5 h-5 text-primary-400" /><h2 className="text-white font-semibold">Academic Details</h2></div>
                    <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow label="10th Percentage" value={profile.tenthPercentage ? `${profile.tenthPercentage}%` : null} />
                        <InfoRow label="12th Percentage" value={profile.twelfthPercentage ? `${profile.twelfthPercentage}%` : null} />
                        <InfoRow label="Graduation CGPA" value={profile.cgpa} />
                        <InfoRow label="Current Semester" value={profile.currentSemester} />
                        <InfoRow label="Backlogs" value={profile.backlogs ? 'Yes' : 'No'} />
                        <InfoRow label="Branch" value={profile.branch} />
                    </div>
                </motion.div>

                {/* Professional */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4"><HiBriefcase className="w-5 h-5 text-primary-400" /><h2 className="text-white font-semibold">Professional Details</h2></div>
                    <div className="mb-4">
                        <p className="text-white/40 text-xs mb-2">Skills</p>
                        {profile.skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(s => (
                                    <span key={s} className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-xs border border-primary-500/20">{s}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white/30 text-sm">No skills added yet</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <InfoRow label="Projects" value={profile.projects?.length > 0 ? profile.projects.join(', ') : null} />
                        <InfoRow label="Certifications" value={profile.certifications?.length > 0 ? profile.certifications.join(', ') : null} />
                        <InfoRow label="Internship" value={profile.internshipExperience} />
                        <InfoRow label="LinkedIn" value={profile.linkedin} href={profile.linkedin} />
                        <InfoRow label="GitHub" value={profile.github} href={profile.github} />
                    </div>
                </motion.div>

                {/* Resume */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4"><HiDocumentText className="w-5 h-5 text-primary-400" /><h2 className="text-white font-semibold">Resume</h2></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] rounded-xl p-4">
                        {profile.resumeId ? (
                            <>
                                <div>
                                    <p className="text-white/80 text-sm font-medium">Resume {profile.resumeId.version || 'Uploaded'}</p>
                                    <p className="text-white/30 text-xs">Last updated: {profile.resumeId.createdAt ? new Date(profile.resumeId.createdAt).toLocaleDateString() : 'Recently'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {profile.resumeId.fileUrl && (
                                        <a href={profile.resumeId.fileUrl} target="_blank" rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">Download</a>
                                    )}
                                    <button onClick={() => { setFormData(prepareFormData(profile)); setIsEditing(true); }}
                                        className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Upload New</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-white/40 text-sm">No resume uploaded yet</p>
                                <button onClick={() => { setFormData(prepareFormData(profile)); setIsEditing(true); }}
                                    className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Upload Resume</button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
