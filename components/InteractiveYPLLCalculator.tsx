import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);


export const InteractiveYPLLCalculator: React.FC = () => {
    const [benchmarkAge, setBenchmarkAge] = useState('75');
    const [ages, setAges] = useState<number[]>([25, 40, 80]);
    const [currentAgeInput, setCurrentAgeInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAddAge = () => {
        const age = parseInt(currentAgeInput, 10);
        if (isNaN(age) || age < 0) {
            setError("Please enter a valid, non-negative age.");
            return;
        }
        if (ages.length >= 10) {
            setError("Maximum of 10 ages allowed for this demo.");
            return;
        }
        setAges([...ages, age].sort((a,b) => a-b));
        setCurrentAgeInput('');
        setError(null);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddAge();
        }
    };

    const handleRemoveAge = (indexToRemove: number) => {
        setAges(ages.filter((_, index) => index !== indexToRemove));
    };

    const calculation = useMemo(() => {
        const benchAge = parseInt(benchmarkAge, 10);
        if (isNaN(benchAge) || benchAge <= 0) {
            return { individualCalcs: [], totalYPLL: 0, error: "Benchmark age must be a positive number." };
        }

        const individualCalcs = ages.map(age => {
            const ypll = age < benchAge ? benchAge - age : 0;
            return { age, ypll };
        });

        const totalYPLL = individualCalcs.reduce((sum, item) => sum + item.ypll, 0);

        return { individualCalcs, totalYPLL, error: null };
    }, [benchmarkAge, ages]);

    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
             <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">Interactive YPLL Calculator</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Inputs */}
                <div className="md:col-span-1">
                    <label htmlFor="benchmark-age" className="block text-sm font-medium text-slate-400 mb-1">Benchmark Age</label>
                    <input
                        id="benchmark-age"
                        type="number"
                        value={benchmarkAge}
                        onChange={(e) => setBenchmarkAge(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                </div>
                <div className="md:col-span-2">
                     <label htmlFor="age-at-death" className="block text-sm font-medium text-slate-400 mb-1">Add Age at Death</label>
                     <div className="flex gap-2">
                        <input
                            id="age-at-death"
                            type="number"
                            value={currentAgeInput}
                            onChange={(e) => setCurrentAgeInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., 35"
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                        />
                        <button onClick={handleAddAge} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white font-semibold transition whitespace-nowrap">Add Age</button>
                    </div>
                </div>
            </div>
             {(error || calculation.error) && <div role="alert" className="text-center p-3 mb-4 rounded-md border text-sm bg-red-900/50 border-red-500 text-red-300">{error || calculation.error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Ages List & Total */}
                <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col">
                    <h5 className="font-semibold text-slate-300 mb-3 text-center">Ages at Death ({ages.length})</h5>
                    <div className="flex flex-wrap justify-center gap-2 min-h-[40px]">
                        <AnimatePresence>
                        {ages.map((age, index) => (
                             <motion.div
                                key={`${age}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2 bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                <span>{age}</span>
                                <button onClick={() => handleRemoveAge(index)} className="text-slate-400 hover:text-red-400 transition" aria-label={`Remove age ${age}`}>
                                    <XIcon />
                                </button>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                     <div className="mt-auto pt-4 border-t border-slate-700/50 text-center">
                        <h4 className="text-lg font-semibold text-teal-400 mb-1">Total YPLL</h4>
                        <motion.p 
                            key={calculation.totalYPLL}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-slate-100"
                        >
                            {calculation.totalYPLL.toLocaleString()}
                        </motion.p>
                        <p className="text-slate-400 text-sm">years</p>
                    </div>
                </div>

                 {/* Calculation Breakdown */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-slate-300 mb-3 text-center">Calculation Breakdown</h5>
                    <div className="space-y-2 font-mono text-sm max-h-60 overflow-y-auto pr-2">
                        {calculation.individualCalcs.length > 0 ? (
                            calculation.individualCalcs.map(({ age, ypll }, index) => (
                                <div key={index} className={`p-2 rounded ${ypll > 0 ? 'bg-slate-700/50' : 'bg-slate-900/30 text-slate-500'}`}>
                                    {ypll > 0 ? (
                                        <span>Age {age}: <span className="text-slate-100 font-semibold">{benchmarkAge} - {age} = <span className="text-teal-400">{ypll} years</span></span></span>
                                    ) : (
                                        <span>Age {age}: <span className="text-slate-400">≥ {benchmarkAge}, 0 years lost</span></span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 italic pt-4">Add ages to see calculations.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};