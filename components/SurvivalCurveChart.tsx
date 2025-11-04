import React from 'react';
import { motion } from 'framer-motion';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 400;
const PADDING = 60;

const data = [
    { age: 0, survivors: 100000 },
    { age: 1, survivors: 99300 },   // Infant mortality
    { age: 10, survivors: 99100 },
    { age: 20, survivors: 98800 },
    { age: 30, survivors: 98200 },
    { age: 40, survivors: 97200 },
    { age: 50, survivors: 95500 },
    { age: 60, survivors: 92500 },
    { age: 70, survivors: 86000 },
    { age: 80, survivors: 72000 },
    { age: 90, survivors: 45000 },
    { age: 100, survivors: 15000 },
    { age: 105, survivors: 4000 },
    { age: 110, survivors: 500 },
    { age: 115, survivors: 0 },
];

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

const path = data
    .map(p => ({
        x: mapRange(p.age, 0, 115, PADDING, CHART_WIDTH - PADDING),
        y: mapRange(p.survivors, 0, 100000, CHART_HEIGHT - PADDING, PADDING)
    }))
    .map(p => `${p.x},${p.y}`)
    .join(' ');

export const SurvivalCurveChart: React.FC = () => {
    const xAxisLabels = [0, 20, 40, 60, 80, 100];
    const yAxisLabels = [0, 25000, 50000, 75000, 100000];

    return (
        <div className="w-full mt-6 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-100 mb-4 text-center">Survival Curve from Life Table</h4>

            <div className="flex justify-center">
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full max-w-3xl" aria-labelledby="chart-title-survival" role="img">
                    <title id="chart-title-survival">Survival curve showing decline from 100,000 births</title>

                    {/* Y Axis */}
                    <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" strokeWidth="2" />
                    <text x={15} y={CHART_HEIGHT/2} textAnchor="middle" transform={`rotate(-90, 15, ${CHART_HEIGHT/2})`} className="text-xs fill-slate-400">
                        Number of Survivors
                    </text>
                    {yAxisLabels.map(label => {
                        const y = mapRange(label, 0, 100000, CHART_HEIGHT - PADDING, PADDING);
                        return (
                            <g key={`y-${label}`}>
                                <line x1={PADDING - 5} y1={y} x2={CHART_WIDTH - PADDING} y2={y} className="stroke-slate-700/50" strokeDasharray="2 2" />
                                <text x={PADDING - 10} y={y + 4} textAnchor="end" className="text-xs fill-slate-500">{label / 1000}k</text>
                            </g>
                        );
                    })}

                    {/* X Axis */}
                    <line x1={PADDING} y1={CHART_HEIGHT - PADDING} x2={CHART_WIDTH - PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" strokeWidth="2" />
                    <text x={CHART_WIDTH / 2} y={CHART_HEIGHT - PADDING + 35} textAnchor="middle" className="text-xs fill-slate-400">
                        Age (years)
                    </text>
                    {xAxisLabels.map(label => {
                        const x = mapRange(label, 0, 115, PADDING, CHART_WIDTH - PADDING);
                        return (
                            <g key={`x-${label}`}>
                                <line x1={x} y1={CHART_HEIGHT - PADDING} x2={x} y2={CHART_HEIGHT - PADDING + 5} className="stroke-slate-600" strokeWidth="2" />
                                <text x={x} y={CHART_HEIGHT - PADDING + 20} textAnchor="middle" className="text-xs fill-slate-500">{label}</text>
                            </g>
                        );
                    })}

                    <motion.path d={`M ${path}`} fill="none" className="stroke-sky-500" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeInOut' }}/>
                </svg>
            </div>

            <p className="mt-4 text-sm text-slate-400 text-center">
                Starting with 100,000 newborns, the curve shows how the cohort declines through different age groups based on mortality rates.
            </p>
        </div>
    );
};
