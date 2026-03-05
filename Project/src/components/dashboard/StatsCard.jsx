import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, color, delay = 0 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const target = typeof value === 'number' ? value : parseInt(value) || 0;
        if (target === 0) return;
        let start = 0;
        const duration = 1200;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    const colors = {
        indigo: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/20', shadow: 'shadow-indigo-500/10' },
        emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
        amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-amber-500/10' },
        rose: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' },
    };

    const c = colors[color] || colors.indigo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`bg-[#0f1120] border ${c.border} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 shadow-lg ${c.shadow}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-white/40 text-sm mt-0.5">{label}</p>
        </motion.div>
    );
}
