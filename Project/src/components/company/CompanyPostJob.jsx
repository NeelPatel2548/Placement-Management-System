import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { branchOptions } from './companyMockData';

const skillSuggestions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Machine Learning', 'Data Science', 'Deep Learning',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
    'Git', 'Linux', 'REST API', 'GraphQL',
];

export default function CompanyPostJob() {
    const [form, setForm] = useState({
        title: '', description: '', salary: '', location: '', jobType: 'fulltime',
        eligibilityCgpa: '', eligibleBranches: [], skillsRequired: [], deadline: '',
    });
    const [skillInput, setSkillInput] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleBranch = (branch) => {
        setForm(prev => ({
            ...prev,
            eligibleBranches: prev.eligibleBranches.includes(branch)
                ? prev.eligibleBranches.filter(b => b !== branch)
                : [...prev.eligibleBranches, branch],
        }));
    };

    const addSkill = (skill) => {
        if (skill && !form.skillsRequired.includes(skill)) {
            setForm(prev => ({ ...prev, skillsRequired: [...prev.skillsRequired, skill] }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setForm(prev => ({ ...prev, skillsRequired: prev.skillsRequired.filter(s => s !== skill) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Job posted:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all";

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                    <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Job Posted Successfully!</h2>
                <p className="text-white/40 text-sm">Eligible students will be notified about this opportunity.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
                <p className="text-white/40 text-sm mt-1">Fill in the details to create a new job posting</p>
            </motion.div>

            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                onSubmit={handleSubmit} className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 space-y-5">

                {/* Title */}
                <div>
                    <label className="block text-white/60 text-sm mb-2">Job Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Software Development Engineer" className={inputClass} />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white/60 text-sm mb-2">Job Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the role, responsibilities, and requirements..." className={inputClass + " resize-none"} />
                </div>

                {/* Salary & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Annual Salary (₹)</label>
                        <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="e.g. 1200000" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Location</label>
                        <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" className={inputClass} />
                    </div>
                </div>

                {/* Job Type & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Job Type *</label>
                        <select name="jobType" value={form.jobType} onChange={handleChange} className={inputClass}>
                            <option value="fulltime">Full Time</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Application Deadline</label>
                        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputClass} />
                    </div>
                </div>

                {/* Eligibility CGPA */}
                <div>
                    <label className="block text-white/60 text-sm mb-2">Minimum CGPA Required</label>
                    <input name="eligibilityCgpa" type="number" step="0.1" min="0" max="10" value={form.eligibilityCgpa} onChange={handleChange} placeholder="e.g. 7.0" className={inputClass} />
                </div>

                {/* Eligible Branches */}
                <div>
                    <label className="block text-white/60 text-sm mb-2">Eligible Branches</label>
                    <div className="flex flex-wrap gap-2">
                        {branchOptions.map(branch => (
                            <button key={branch} type="button" onClick={() => toggleBranch(branch)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.eligibleBranches.includes(branch)
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                                    }`}>
                                {branch}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skills Required */}
                <div>
                    <label className="block text-white/60 text-sm mb-2">Skills Required</label>
                    <div className="flex gap-2 mb-2">
                        <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                            placeholder="Type or select skills" className={inputClass} />
                        <button type="button" onClick={() => addSkill(skillInput)} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors whitespace-nowrap">Add</button>
                    </div>
                    {form.skillsRequired.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.skillsRequired.map(skill => (
                                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="text-emerald-400/60 hover:text-emerald-400 ml-1">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                        {skillSuggestions.filter(s => !form.skillsRequired.includes(s)).slice(0, 12).map(skill => (
                            <button key={skill} type="button" onClick={() => addSkill(skill)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 text-white/30 text-[11px] hover:text-white/60 hover:bg-white/10 transition-all">
                                + {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                    <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                        Post Job
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
