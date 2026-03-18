import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiAcademicCap, HiBriefcase, HiDocumentText, HiCheck, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
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

const steps = [
    { icon: HiUser, label: 'Personal' },
    { icon: HiAcademicCap, label: 'Academic' },
    { icon: HiBriefcase, label: 'Professional' },
    { icon: HiDocumentText, label: 'Documents' },
];

export default function ProfileSetup() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeInfo, setResumeInfo] = useState(null);

    const [form, setForm] = useState({
        phone: '', dob: '', gender: '', address: '', enrollmentNo: '', branch: '',
        tenthPercentage: '', twelfthPercentage: '', cgpa: '', currentSemester: '',
        backlogs: false, skills: [], projects: '', certifications: '', internshipExperience: '',
        linkedin: '', github: '',
    });

    // Pre-fill from existing profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/student/profile');
                const student = res.data.student;
                if (student) {
                    setIsUpdate(true);
                    setForm({
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
                    });
                    if (student.resumeId) {
                        setResumeInfo(student.resumeId);
                    }
                }
            } catch {
                // No existing profile — first-time setup
            } finally {
                setPageLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
    const toggleBool = (field) => () => setForm(f => ({ ...f, [field]: !f[field] }));

    const toggleSkill = (skill) => {
        setForm(f => ({
            ...f,
            skills: f.skills.includes(skill)
                ? f.skills.filter(s => s !== skill)
                : [...f.skills, skill],
        }));
    };

    const handleResumeUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setUploadProgress(0);
        setErrorMsg('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await api.post('/api/student/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setUploadProgress(percent);
                },
            });
            setResumeInfo(res.data.resume);
            setResumeFile(null);
            setSuccessMsg('Resume uploaded successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Resume upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const payload = {
                ...form,
                tenthPercentage: form.tenthPercentage ? Number(form.tenthPercentage) : undefined,
                twelfthPercentage: form.twelfthPercentage ? Number(form.twelfthPercentage) : undefined,
                cgpa: form.cgpa ? Number(form.cgpa) : undefined,
                currentSemester: form.currentSemester ? Number(form.currentSemester) : undefined,
                projects: form.projects ? form.projects.split(',').map(p => p.trim()).filter(Boolean) : [],
                certifications: form.certifications ? form.certifications.split(',').map(c => c.trim()).filter(Boolean) : [],
            };

            if (isUpdate) {
                await api.put('/api/student/profile', payload);
            } else {
                await api.post('/api/student/profile/setup', payload);
            }

            const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
            user.profileCompleted = true;
            localStorage.setItem('pms_user', JSON.stringify(user));

            setSuccessMsg('Profile saved successfully!');
            setTimeout(() => navigate('/student'), 1500);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';
    const labelClass = 'block text-white/60 text-sm font-medium mb-1.5';
    const delay = (d) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-[#080a12] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080a12] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <motion.div {...delay(0)} className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">P</div>
                    <h1 className="text-2xl font-bold text-white">{isUpdate ? 'Update Your Profile' : 'Complete Your Profile'}</h1>
                    <p className="text-white/40 text-sm mt-1">{isUpdate ? 'Edit your details below' : 'Fill in your details to access the placement portal'}</p>
                </motion.div>

                {/* Step indicator */}
                <motion.div {...delay(0.1)} className="flex items-center justify-center gap-1 mb-8">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-center">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${i < step ? 'bg-emerald-500/20 text-emerald-400' :
                                i === step ? 'bg-primary-500/20 text-primary-400' :
                                    'bg-white/5 text-white/30'
                                }`}>
                                {i < step ? <HiCheck className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
                                <span className="hidden sm:inline">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 rounded ${i < step ? 'bg-emerald-500/40' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </motion.div>

                {/* Success/Error messages */}
                {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                        {successMsg}
                    </motion.div>
                )}
                {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm text-center">
                        {errorMsg}
                    </motion.div>
                )}

                {/* Card */}
                <motion.div {...delay(0.15)} className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 lg:p-8">
                    {/* Step 0: Personal */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Phone Number</label><input type="tel" placeholder="+91 9876543210" value={form.phone} onChange={update('phone')} className={inputClass} /></div>
                                <div><label className={labelClass}>Date of Birth</label><input type="date" value={form.dob} onChange={update('dob')} className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>Gender</label>
                                    <select value={form.gender} onChange={update('gender')} className={inputClass}>
                                        <option value="" className="bg-[#0f1120]">Select</option>
                                        <option value="male" className="bg-[#0f1120]">Male</option>
                                        <option value="female" className="bg-[#0f1120]">Female</option>
                                        <option value="other" className="bg-[#0f1120]">Other</option>
                                    </select>
                                </div>
                                <div><label className={labelClass}>Enrollment No.</label><input type="text" placeholder="EN2024001" value={form.enrollmentNo} onChange={update('enrollmentNo')} className={inputClass} /></div>
                            </div>
                            <div><label className={labelClass}>Address</label><textarea placeholder="Your full address" value={form.address} onChange={update('address')} rows={2} className={inputClass} /></div>
                        </div>
                    )}

                    {/* Step 1: Academic */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Academic Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>10th Percentage</label><input type="number" placeholder="92" value={form.tenthPercentage} onChange={update('tenthPercentage')} className={inputClass} min="0" max="100" /></div>
                                <div><label className={labelClass}>12th Percentage</label><input type="number" placeholder="88" value={form.twelfthPercentage} onChange={update('twelfthPercentage')} className={inputClass} min="0" max="100" /></div>
                                <div><label className={labelClass}>Graduation CGPA</label><input type="number" step="0.1" placeholder="8.5" value={form.cgpa} onChange={update('cgpa')} className={inputClass} min="0" max="10" /></div>
                                <div><label className={labelClass}>Current Semester</label><input type="number" placeholder="6" value={form.currentSemester} onChange={update('currentSemester')} className={inputClass} min="1" max="8" /></div>
                                <div>
                                    <label className={labelClass}>Branch</label>
                                    <select value={form.branch} onChange={update('branch')} className={inputClass}>
                                        <option value="" className="bg-[#0f1120]">Select Branch</option>
                                        {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map(b => <option key={b} value={b} className="bg-[#0f1120]">{b}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={form.backlogs} onChange={toggleBool('backlogs')} className="sr-only peer" />
                                        <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-red-500/60 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"></div>
                                    </label>
                                    <span className="text-white/60 text-sm">Active Backlogs</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Professional */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Professional Details</h2>
                            <div>
                                <label className={labelClass}>Skills (select multiple)</label>
                                <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-40 overflow-y-auto">
                                    {skillOptions.map(skill => (
                                        <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.skills.includes(skill)
                                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >{skill}</button>
                                    ))}
                                </div>
                            </div>
                            <div><label className={labelClass}>Projects (comma separated)</label><textarea placeholder="Placement Management System, E-Commerce App" value={form.projects} onChange={update('projects')} rows={2} className={inputClass} /></div>
                            <div><label className={labelClass}>Certifications (comma separated)</label><input type="text" placeholder="AWS Cloud Practitioner, Google Analytics" value={form.certifications} onChange={update('certifications')} className={inputClass} /></div>
                            <div><label className={labelClass}>Internship Experience</label><input type="text" placeholder="3 months at TechCorp" value={form.internshipExperience} onChange={update('internshipExperience')} className={inputClass} /></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>LinkedIn Profile</label><input type="url" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={update('linkedin')} className={inputClass} /></div>
                                <div><label className={labelClass}>GitHub Profile</label><input type="url" placeholder="https://github.com/..." value={form.github} onChange={update('github')} className={inputClass} /></div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Documents</h2>
                            <div
                                className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary-400/30 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <HiDocumentText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/60 text-sm font-medium">Upload your Resume (PDF)</p>
                                <p className="text-white/30 text-xs mt-1">
                                    {resumeFile ? resumeFile.name : 'Click to browse'}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setResumeFile(file);
                                            handleResumeUpload(file);
                                        }
                                    }}
                                />
                                {!uploading && (
                                    <button type="button" className="mt-4 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-500/30 transition-colors">
                                        Choose File
                                    </button>
                                )}
                            </div>

                            {/* Upload progress bar */}
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/50">Uploading...</span>
                                        <span className="text-primary-400 font-semibold">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                </div>
                            )}

                            {/* Current resume info */}
                            {resumeInfo && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                                    <HiCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-emerald-300 text-sm font-medium">Resume uploaded</p>
                                        <p className="text-white/40 text-xs mt-0.5">Version: {resumeInfo.version || 'Latest'}</p>
                                    </div>
                                </div>
                            )}

                            {!resumeInfo && !uploading && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                                    <HiDocumentText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-amber-300 text-sm font-medium">Almost there!</p>
                                        <p className="text-white/40 text-xs mt-0.5">Upload your resume and click "Complete Setup" to access the dashboard.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8">
                        {step > 0 ? (
                            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all">
                                <HiArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Next <HiArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading || uploading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><HiCheck className="w-4 h-4" /> {isUpdate ? 'Save Changes' : 'Complete Setup'}</>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
