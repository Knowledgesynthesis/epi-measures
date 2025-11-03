import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);

const PlusIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
);


interface Participant {
    id: number;
    followUp: number; // in years
    hasEvent: boolean;
}

const initialParticipants: Participant[] = [
    { id: 1, followUp: 5, hasEvent: false },
    { id: 2, followUp: 3, hasEvent: true },
    { id: 3, followUp: 8, hasEvent: false },
];

export const PersonTimeVisualizer: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

    const handleAddParticipant = () => {
        if (participants.length >= 10) return;
        const newId = (participants[participants.length - 1]?.id || 0) + 1;
        setParticipants([...participants, { id: newId, followUp: 5, hasEvent: false }]);
    };
    
    const handleRemoveParticipant = (id: number) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    const handleUpdate = (id: number, field: keyof Participant, value: number | boolean) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const { totalPersonYears, totalCases, incidenceDensity } = useMemo(() => {
        const totalPersonYears = participants.reduce((sum, p) => sum + p.followUp, 0);
        const totalCases = participants.filter(p => p.hasEvent).length;
        const density = totalPersonYears > 0 ? (totalCases / totalPersonYears) * 1000 : 0;
        return {
            totalPersonYears,
            totalCases,
            incidenceDensity: density
        };
    }, [participants]);

    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">Interactive Person-Time Visualizer</h4>
            <p className="text-center text-slate-400 mb-6 max-w-2xl mx-auto">
                Add participants, adjust their follow-up time, and mark events to see how <strong className="text-sky-400">Incidence Density</strong> is calculated from person-time data.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Controls & Participants */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                         <h5 className="font-semibold text-slate-300">Study Participants ({participants.length})</h5>
                         <button onClick={handleAddParticipant} disabled={participants.length >= 10} className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-md text-white text-sm font-semibold transition disabled:bg-slate-600 disabled:cursor-not-allowed">
                            <PlusIcon /> Add
                         </button>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        <AnimatePresence>
                        {participants.map(p => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-slate-300">Person {p.id}</span>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-red-400 transition">
                                            <input type="checkbox" checked={p.hasEvent} onChange={(e) => handleUpdate(p.id, 'hasEvent', e.target.checked)} className="accent-red-500 w-4 h-4" />
                                            Event
                                        </label>
                                        <button onClick={() => handleRemoveParticipant(p.id)} className="text-slate-500 hover:text-red-400 transition" aria-label={`Remove person ${p.id}`}>
                                            <XIcon />
                                        </button>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <input type="range" min="0.5" max="10" step="0.5" value={p.followUp} onChange={(e) => handleUpdate(p.id, 'followUp', parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                                    <span className="font-mono text-teal-400 w-16 text-right">{p.followUp.toFixed(1)} yrs</span>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Results */}
                 <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col justify-center text-center">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-slate-900/50 rounded-lg">
                            <h5 className="text-sm font-semibold text-slate-400">New Cases</h5>
                            <p className="text-3xl font-bold text-red-400">{totalCases}</p>
                        </div>
                        <div className="p-3 bg-slate-900/50 rounded-lg">
                            <h5 className="text-sm font-semibold text-slate-400">Total Person-Years</h5>
                            <p className="text-3xl font-bold text-teal-400">{totalPersonYears.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-700/50">
                        <h4 className="text-lg font-semibold text-sky-400 mb-1">Incidence Density</h4>
                         <p className="font-mono text-sm text-slate-400 mb-2">({totalCases} cases / {totalPersonYears.toFixed(1)} person-years) × 1,000</p>
                         <p className="text-4xl font-bold text-slate-100">{incidenceDensity.toFixed(1)}</p>
                        <p className="text-slate-400 text-sm">per 1,000 person-years</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};
