import React, { useState, useMemo } from 'react';
import { Fraction } from './Fraction';
import { motion } from 'framer-motion';

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label htmlFor={label} className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
        <input
            id={label}
            type="number"
            value={value}
            onChange={onChange}
            min="0"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            aria-label={label}
        />
    </div>
);

const ResultCard: React.FC<{ title: string; value: string; formulaNum: string; formulaDen: string; }> = ({ title, value, formulaNum, formulaDen }) => (
    <motion.div
        className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-lg font-semibold text-sky-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-slate-100 mb-4" aria-live="polite">{value}</p>
         <div className="text-slate-400 font-mono text-sm mt-auto flex items-center flex-wrap justify-center">
            <span>Formula:</span>
            <Fraction numerator={formulaNum} denominator={formulaDen} />
            <span>&nbsp;x 1,000</span>
        </div>
    </motion.div>
);


export const BirthRateCalculator: React.FC = () => {
    const [births, setBirths] = useState('8000');
    const [totalPop, setTotalPop] = useState('600000');
    const [womenPop, setWomenPop] = useState('150000');

    const { cbr, gfr, error } = useMemo(() => {
        const numBirths = parseFloat(births);
        const numTotalPop = parseFloat(totalPop);
        const numWomenPop = parseFloat(womenPop);

        if (isNaN(numBirths) || isNaN(numTotalPop) || isNaN(numWomenPop)) {
            return { cbr: '...', gfr: '...', error: null };
        }
        
        if (numBirths < 0 || numTotalPop < 0 || numWomenPop < 0) {
            return { cbr: '...', gfr: '...', error: 'Inputs cannot be negative.'};
        }
        
        if (numWomenPop > numTotalPop) {
             return { cbr: '...', gfr: '...', error: 'Women of childbearing age cannot exceed total population.'};
        }

        const cbrValue = numTotalPop > 0 ? (numBirths / numTotalPop) * 1000 : 0;
        const gfrValue = numWomenPop > 0 ? (numBirths / numWomenPop) * 1000 : 0;
        
        return {
            cbr: cbrValue.toFixed(1),
            gfr: gfrValue.toFixed(1),
            error: null
        }

    }, [births, totalPop, womenPop]);


    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">Birth & Fertility Rate Calculator</h4>
            <p className="text-center text-slate-400 mb-6 max-w-2xl mx-auto">
               Enter the data to see how the choice of denominator changes the calculated rate, highlighting the difference between a <strong className="text-sky-400">Crude Birth Rate (CBR)</strong> and a <strong className="text-sky-400">General Fertility Rate (GFR)</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <InputField label="Total Live Births" value={births} onChange={e => setBirths(e.target.value)} />
                <InputField label="Total Population" value={totalPop} onChange={e => setTotalPop(e.target.value)} />
                <InputField label="Women Aged 15-44" value={womenPop} onChange={e => setWomenPop(e.target.value)} />
            </div>

            {error && <div role="alert" className="text-center p-3 mb-6 rounded-md border text-sm bg-red-900/50 border-red-500 text-red-300">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <ResultCard title="Crude Birth Rate (CBR)" value={cbr} formulaNum={parseFloat(births).toLocaleString()} formulaDen={parseFloat(totalPop).toLocaleString()} />
                <ResultCard title="General Fertility Rate (GFR)" value={gfr} formulaNum={parseFloat(births).toLocaleString()} formulaDen={parseFloat(womenPop).toLocaleString()} />
            </div>
        </div>
    );
};
