import { motion } from 'framer-motion';
import { HiAcademicCap } from 'react-icons/hi';

export default function PracticeTestsPage() {
    const tests = [
        { id: 1, title: 'Aptitude Test - Basic', questions: 30, time: '30 min', difficulty: 'Easy', color: 'emerald' },
        { id: 2, title: 'Coding Challenge - Arrays', questions: 10, time: '45 min', difficulty: 'Medium', color: 'amber' },
        { id: 3, title: 'Aptitude Test - Advanced', questions: 50, time: '60 min', difficulty: 'Hard', color: 'red' },
        { id: 4, title: 'Logical Reasoning', questions: 25, time: '25 min', difficulty: 'Easy', color: 'emerald' },
        { id: 5, title: 'Coding Challenge - DSA', questions: 5, time: '60 min', difficulty: 'Hard', color: 'red' },
        { id: 6, title: 'Verbal Ability', questions: 20, time: '20 min', difficulty: 'Medium', color: 'amber' },
    ];

    const diffColors = {
        Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        Hard: 'bg-red-500/15 text-red-400 border-red-500/20',
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Practice Tests</h1>
                <p className="text-white/40 text-sm mt-1">Prepare for placement assessments</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tests.map((test, i) => (
                    <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
                                <HiAcademicCap className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${diffColors[test.difficulty]}`}>
                                {test.difficulty}
                            </span>
                        </div>
                        <h3 className="text-white font-semibold mt-3">{test.title}</h3>
                        <div className="flex gap-4 mt-2 text-xs text-white/40">
                            <span>{test.questions} questions</span>
                            <span>{test.time}</span>
                        </div>
                        <button className="w-full mt-4 py-2.5 rounded-xl bg-primary-500/15 text-primary-400 text-sm font-medium hover:bg-primary-500/25 transition-colors">
                            Start Test
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
