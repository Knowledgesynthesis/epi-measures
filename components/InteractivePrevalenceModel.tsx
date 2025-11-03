import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Fraction } from './Fraction';

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min: number; max: number; step: number; unit: string; }> = ({ label, value, onChange, min, max, step, unit }) => (
    <div>
        <label htmlFor={label} className="block text-center text-slate-400 mb-2">
            {label}: <span className="font-bold text-slate-100">{value.toFixed(1)} {unit}</span>
        </label>
        <input
            id={label}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            aria-label={label}
        />
    </div>
);

const FaucetIcon: React.FC<{ flowRate: number }> = ({ flowRate }) => {
    const animationDuration = Math.max(0.2, 20 / flowRate);
    return (
        <svg width="40" height="60" viewBox="0 0 40 60" className="absolute -top-8 left-4 text-slate-500">
            <path d="M 5 20 L 5 25 L 35 25 L 35 20 L 22 20 L 22 5 L 18 5 L 18 20 Z" fill="currentColor" />
            <path d="M 5 25 L 35 25 Q 38 28 35 30 L 5 30 Q 2 28 5 25 Z" fill="currentColor" />
            {flowRate > 0 && Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                    key={i}
                    cx="20"
                    cy="30"
                    r="3"
                    className="text-sky-400"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: [0, 25], opacity: [1, 0] }}
                    transition={{
                        duration: animationDuration,
                        repeat: Infinity,
                        delay: i * (animationDuration / 3),
                        ease: "linear"
                    }}
                    fill="currentColor"
                />
            ))}
        </svg>
    );
};


const DrainIcon: React.FC<{ duration: number }> = ({ duration }) => {
    // Inverse relationship: short duration = high rate of outflow
    const outflowRate = 50 / duration;
    const animationDuration = Math.max(0.2, 20 / outflowRate);

    return (
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-0 left-1/2 -translate-x-1/2 text-slate-600">
            {/* Elliptical drain centered on the top edge */}
            <ellipse cx="30" cy="0" rx="20" ry="6" fill="currentColor" />
            
            {/* Droplets falling from the drain */}
            {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                    key={i}
                    cx="30"
                    cy="0" // Start from the center of the drain
                    r="2.5"
                    className="text-sky-700"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: [0, 55], opacity: [1, 0] }} // Animate falling down
                    transition={{
                        duration: animationDuration,
                        repeat: Infinity,
                        delay: i * (animationDuration / 3),
                        ease: "linear"
                    }}
                    fill="currentColor"
                />
            ))}
        </svg>
    );
};


export const InteractivePrevalenceModel: React.FC = () => {
    const [incidence, setIncidence] = useState(5.0); // new cases per 1,000 people/year
    const [duration, setDuration] = useState(10.0); // years

    const { exactPrevalence, approxPrevalence, waterLevel, differencePercent } = useMemo(() => {
        const incidenceRate = incidence / 1000; // Convert to proportion for calculation
        
        const approxProduct = incidenceRate * duration;
        const exactPrevalenceValue = approxProduct / (1 + approxProduct);

        const level = Math.min(100, exactPrevalenceValue * 100);
        const diff = Math.abs(exactPrevalenceValue - approxProduct);
        
        return { 
            exactPrevalence: exactPrevalenceValue * 100, 
            approxPrevalence: approxProduct * 100, 
            waterLevel: level,
            differencePercent: diff * 100
        };
    }, [incidence, duration]);

    const getDifferenceColor = () => {
        if (differencePercent < 2) return 'text-green-400';
        if (differencePercent < 10) return 'text-yellow-400';
        return 'text-red-400';
    }

    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">The Bathtub Analogy: Exact vs. Approximate Prevalence</h4>
            <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
                Adjust the sliders to see how the exact prevalence formula and the common approximation (<strong className="text-teal-400">P ≈ I × D</strong>) compare. The approximation works well when prevalence is low.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Slider label="Incidence Rate" value={incidence} onChange={e => setIncidence(parseFloat(e.target.value))} min={0} max={100} step={0.5} unit="per 1,000 person-years" />
                <Slider label="Average Duration" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} min={1} max={50} step={0.5} unit="years" />
            </div>
            
             <div className="flex flex-col items-center">
                {/* Bathtub */}
                <div className="relative w-full max-w-sm h-56 bg-slate-800/50 border-2 border-slate-700 rounded-t-lg">
                    <FaucetIcon flowRate={incidence} />
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-600 to-sky-500"
                        animate={{ height: `${waterLevel}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                     <div className="absolute top-2 right-2 text-right p-2 bg-slate-900/60 rounded-lg">
                        <h5 className="text-xs font-semibold text-slate-300">True Prevalence (Water Level)</h5>
                        <p className="text-lg font-bold text-slate-100">{exactPrevalence.toFixed(2)}%</p>
                    </div>
                </div>
                {/* Drain and Outflow Space */}
                <div className="relative w-full max-w-sm h-16">
                     <DrainIcon duration={duration} />
                </div>
            </div>

             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-slate-800 p-4 rounded-lg">
                     <h5 className="font-semibold text-slate-300 mb-2">Exact Formula</h5>
                     <div className="font-mono text-sm flex items-center justify-center p-2 bg-slate-900/50 rounded mb-3">
                        <span>P =&nbsp;</span>
                        <Fraction numerator="I × D" denominator="1 + (I × D)" />
                     </div>
                     <p className="text-3xl font-bold text-sky-400">{exactPrevalence.toFixed(2)}%</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                     <h5 className="font-semibold text-slate-300 mb-2">Approximation</h5>
                     <div className="font-mono text-sm flex items-center justify-center p-2 bg-slate-900/50 rounded mb-3 h-[60px]">
                        <span>P ≈ I × D</span>
                     </div>
                     <p className="text-3xl font-bold text-teal-400">{approxPrevalence.toFixed(2)}%</p>
                </div>
             </div>
             <div className={`mt-4 text-center p-3 rounded-lg bg-slate-800 border border-slate-700 ${getDifferenceColor()}`}>
                <span className="font-semibold">Difference:</span> {differencePercent.toFixed(2)} percentage points. The approximation is close when this value is small.
             </div>
        </div>
    );
};