import React from 'react';
import { motion } from 'framer-motion';

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
    otherDeaths: number;
}> = ({ title, description, diseaseDeaths, otherDeaths }) => {

    const totalDeaths = diseaseDeaths + otherDeaths;
    const proportionalMortality = totalDeaths > 0 ? (diseaseDeaths / totalDeaths) * 100 : 0;

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col items-center">
            <h5 className="text-lg font-bold text-slate-100 mb-1">{title}</h5>
            <p className="text-sm text-slate-400 mb-6 text-center">{description}</p>

            <div className="space-y-3 w-full mb-6">
                <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-sm text-slate-400">Deaths from Disease X:</span>
                    <span className="font-bold text-sky-400 font-mono">{diseaseDeaths}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-sm text-slate-400">Deaths from Other Causes:</span>
                    <span className="font-bold text-slate-400 font-mono">{otherDeaths}</span>
                </div>
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
    return (
         <div className="my-8 p-4 sm:p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="text-xl font-semibold text-slate-100 mb-4 text-center">The Proportional Mortality Trap</h4>
            <p className="text-center text-slate-400 mb-6 max-w-2xl mx-auto">
                Notice how the <strong className="text-teal-400">proportion</strong> differs between populations even though the <strong className="text-sky-400">absolute number of deaths from Disease X is identical</strong> (4 deaths in both groups).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <PopulationColumn
                    title="Population A (Healthier)"
                    description="A group with fewer total deaths (e.g., a healthier or younger population)."
                    diseaseDeaths={4}
                    otherDeaths={96}
                />
                 <PopulationColumn
                    title="Population B (General)"
                    description="A group with more total deaths from other causes (e.g., a general or older population)."
                    diseaseDeaths={4}
                    otherDeaths={196}
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
