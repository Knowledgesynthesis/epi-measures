import React, { useState, useMemo } from 'react';
import { Fraction } from './Fraction';
import { motion } from 'framer-motion';

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; min?: string; }> = ({ label, value, onChange, placeholder, type = 'number', min }) => (
    <div className="flex-1 min-w-[120px]">
        <label htmlFor={label} className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
        <input
            id={label}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            aria-label={label}
        />
    </div>
);

const ResultCard: React.FC<{ title: string; value: string | number; unit?: string; children: React.ReactNode; }> = ({ title, value, unit, children }) => (
    <motion.div
        className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-lg font-semibold text-sky-400 mb-2">{title}</h3>
        <p className="text-3xl md:text-4xl font-bold text-slate-100 mb-4" aria-live="polite">
            {value}
            {unit && <span className="text-lg md:text-xl text-slate-400 ml-2">{unit}</span>}
        </p>
        <div className="text-slate-400 font-mono text-sm md:text-base mt-auto">
            {children}
        </div>
    </motion.div>
);

export const InteractiveCalculator: React.FC = () => {
    const [events, setEvents] = useState('50');
    const [population, setPopulation] = useState('500000');
    const [multiplier, setMultiplier] = useState('100000');
    const [timeUnit, setTimeUnit] = useState('year');

    const { displayValues, error } = useMemo(() => {
        const numEvents = parseFloat(events);
        const numPopulation = parseFloat(population);
        const numMultiplier = parseFloat(multiplier);

        if (isNaN(numEvents) || isNaN(numPopulation)) {
            return {
                displayValues: { count: '...', risk: '...', rate: '...' },
                error: null
            };
        }

        let currentError: string | null = null;
        if (numPopulation <= 0) currentError = 'Population must be greater than 0.';
        else if (numEvents < 0) currentError = 'Events cannot be negative.';
        else if (numEvents > numPopulation) currentError = 'Warning: Events exceed population, so risk is > 100%.';

        const riskValue = numPopulation > 0 ? numEvents / numPopulation : 0;
        const finalMultiplier = isNaN(numMultiplier) || numMultiplier <= 0 ? 100000 : numMultiplier;
        const rateValue = numPopulation > 0 ? riskValue * finalMultiplier : 0;

        const display = {
            count: numEvents.toLocaleString(),
            risk: `${(riskValue * 100).toPrecision(4)}%`,
            rate: rateValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        };

        if (currentError && (currentError.includes('Population') || currentError.includes('negative'))){
             display.risk = '...';
             display.rate = '...';
        }

        return { displayValues: display, error: currentError };
    }, [events, population, multiplier]);

    const numEvents = parseFloat(events) || 0;
    const numPopulation = parseFloat(population) || 1;
    const numMultiplier = parseFloat(multiplier) || 100000;


    const getErrorStyle = () => {
        if (!error) return '';
        if (error.startsWith('Warning')) {
            return 'bg-yellow-900/50 border-yellow-500 text-yellow-300';
        }
        return 'bg-red-900/50 border-red-500 text-red-300';
    }


    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <InputField label="Number of Events" value={events} onChange={e => setEvents(e.target.value)} placeholder="e.g., 50" min="0" />
                <InputField label="Population at Risk" value={population} onChange={e => setPopulation(e.target.value)} placeholder="e.g., 500,000" min="1" />
                <InputField label="Rate Multiplier (k)" value={multiplier} onChange={e => setMultiplier(e.target.value)} placeholder="e.g., 100,000" min="1" />
                <InputField label="Time Unit" type="text" value={timeUnit} onChange={e => setTimeUnit(e.target.value)} placeholder="e.g., year" />
            </div>

            {error && <div role="alert" className={`text-center p-3 mb-6 rounded-md border text-sm ${getErrorStyle()}`}>{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <ResultCard title="Count" value={displayValues.count} unit="events">
                    <p>The raw number of events.</p>
                    <p className="mt-4 break-all">Formula: <span className="text-slate-100">{numEvents.toLocaleString()}</span></p>
                </ResultCard>

                <ResultCard title="Risk" value={displayValues.risk}>
                    <p>The proportion of the population that experiences the event.</p>
                    <div className="mt-4 flex items-center flex-wrap">
                        <span>Formula:</span>
                        <Fraction numerator={numEvents.toLocaleString()} denominator={numPopulation.toLocaleString()} />
                        <span>&nbsp;x 100%</span>
                    </div>
                </ResultCard>

                <ResultCard title="Rate" value={displayValues.rate} unit={`per ${numMultiplier.toLocaleString()} per ${timeUnit || 'time'}`}>
                     <p>The frequency of events over a period.</p>
                     <div className="mt-4 flex items-center flex-wrap">
                        <span>Formula:</span>
                        <Fraction numerator={numEvents.toLocaleString()} denominator={numPopulation.toLocaleString()} />
                         <span>&nbsp;x {numMultiplier.toLocaleString()} per {timeUnit || 'time'}</span>
                    </div>
                </ResultCard>
            </div>
        </div>
    );
};
