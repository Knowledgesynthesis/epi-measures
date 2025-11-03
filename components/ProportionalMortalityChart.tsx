import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; max: number; colorClass: string; }> = ({ label, value, onChange, max, colorClass }) => (
    <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">{label}: <span className="font-bold text-slate-200">{value}</span></label>
        <input
            type="range"
            min="0"
            max={max}
            step="1"
            value={value}
            onChange={onChange}
            className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colorClass}`}
        />
    </div>
);

const PieChart: React.FC<{ disease: number, other: number, size: number }> = ({ disease, other, size }) => {
    const total = disease + other;
    const diseasePercent = total > 0 ? (disease / total) * 100 : 0;
    
    const conicGradient = `conic-gradient(from 0deg, #0ea5e9 0% ${diseasePercent}%, #334155 ${diseasePercent}% 100%)`;

    return (
        <motion.div
            className="rounded-full border-2 border-slate-700"
            style={{ width: size, height: size, background: conicGradient }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        />
    );
};

const PopulationColumn: React.FC<{
    title: string;
    description: string;
    diseaseDeaths: number;
    setDiseaseDeaths: (val: number) => void;
    otherDeaths: number;
    setOtherDeaths: (val: number) => void;
}> = ({ title, description, diseaseDeaths, setDiseaseDeaths, otherDeaths, setOtherDeaths }) => {

    const { totalDeaths, proportionalMortality } = useMemo(() => {
        const total = diseaseDeaths + otherDeaths;
        const proportion = total > 0 ? (diseaseDeaths / total) * 100 : 0;
        return { totalDeaths: total, proportionalMortality: proportion };
    }, [diseaseDeaths, otherDeaths]);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col items-center">
            <h5 className="text-lg font-bold text-slate-100 mb-1">{title}</h5>
            <p className="text-sm text-slate-400 mb-4 h-10 text-center">{description}</p>
            
            <div className="space-y-4 w-full mb-6">
                <Slider label="Deaths from Disease X" value={diseaseDeaths} onChange={e => setDiseaseDeaths(parseInt(e.target.value))} max={50} colorClass="accent-sky-500" />
                <Slider label="Deaths from Other Causes" value={otherDeaths} onChange={e => setOtherDeaths(parseInt(e.target.value))} max={200} colorClass="accent-slate-500" />
            </div>

            <PieChart disease={diseaseDeaths} other={otherDeaths} size={128} />
            
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg w-full text-center">
                <p className="font-mono text-sm">Total Deaths = {totalDeaths}</p>
                <p className="font-semibold text-lg mt-2">Proportional Mortality:</p>
                <p className="font-mono text-teal-400 text-xl font-bold">
                    ({diseaseDeaths} / {totalDeaths}) = {proportionalMortality.toFixed(1)}%
                </p>
            </div>
        </div>
    );
};


export const ProportionalMortalityChart: React.FC = () => {
    const [popA_disease, setPopA_disease] = useState(4);
    const [popA_other, setPopA_other] = useState(96);
    const [popB_disease, setPopB_disease] = useState(4);
    const [popB_other, setPopB_other] = useState(196);
    
    return (
         <div className="my-8 p-4 sm:p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">Interactive Proportional Mortality Trap</h4>
            <p className="text-center text-slate-400 mb-6 max-w-2xl mx-auto">
                Use the sliders to adjust the death counts. Notice how the <strong className="text-teal-400">proportion</strong> changes even if the <strong className="text-sky-400">absolute number of deaths</strong> from Disease X is the same in both populations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <PopulationColumn
                    title="Population A"
                    description="A group with fewer total deaths (e.g., a healthier or younger population)."
                    diseaseDeaths={popA_disease}
                    setDiseaseDeaths={setPopA_disease}
                    otherDeaths={popA_other}
                    setOtherDeaths={setPopA_other}
                />
                 <PopulationColumn
                    title="Population B"
                    description="A group with more total deaths from other causes (e.g., a general or older population)."
                    diseaseDeaths={popB_disease}
                    setDiseaseDeaths={setPopB_disease}
                    otherDeaths={popB_other}
                    setOtherDeaths={setPopB_other}
                />
            </div>
             <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h4 className="text-lg font-semibold text-amber-400 text-center">Key Takeaway</h4>
              <p className="mt-2 text-slate-300 text-center max-w-3xl mx-auto">
                This demonstrates why comparing proportional mortality can be misleading. A higher proportion does not automatically mean a higher underlying risk of dying from that disease. To make a fair comparison, you need <strong className="font-semibold text-slate-100">disease-specific mortality rates</strong>, which use the total population at risk as the denominator, not just the total number of deaths.
              </p>
            </div>
        </div>
    );
};
