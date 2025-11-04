import React from 'react';
import { motion } from 'framer-motion';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 400;
const PADDING = 60;

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const SurvivalCurveChart: React.FC = () => {
    // Data from the life table example
    const data = [
        { age: 0, survivors: 100000, label: '0' },
        { age: 19, survivors: 100000, label: '19' },
        { age: 20, survivors: 99800, label: '20' },
        { age: 39, survivors: 99800, label: '39' },
        { age: 40, survivors: 99400, label: '40' },
        { age: 59, survivors: 99400, label: '59' },
        { age: 60, survivors: 98500, label: '60' },
        { age: 79, survivors: 98500, label: '79' },
        { age: 80, survivors: 96000, label: '80' },
        { age: 100, survivors: 70000, label: '100' }, // Extrapolated for visual effect
    ];

    const maxSurvivors = 100000;
    const maxAge = 100;

    // Convert data points to SVG coordinates
    const points = data.map(d => ({
        x: mapRange(d.age, 0, maxAge, PADDING, CHART_WIDTH - PADDING),
        y: mapRange(d.survivors, 0, maxSurvivors, CHART_HEIGHT - PADDING, PADDING)
    }));

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    // Y-axis labels (survivors)
    const yLabels = [0, 25000, 50000, 75000, 100000];
    // X-axis labels (age)
    const xLabels = [0, 20, 40, 60, 80, 100];

    return (
        <div className="w-full mt-6 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-100 mb-4 text-center">Survival Curve from Life Table</h4>

            <div className="relative w-full max-w-3xl mx-auto">
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full">
                    <title>Survival curve showing decline from 100,000 births</title>

                    {/* Y Axis */}
                    <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" strokeWidth="2" />
                    <text x={20} y={CHART_HEIGHT/2} textAnchor="middle" transform={`rotate(-90, 20, ${CHART_HEIGHT/2})`} className="text-xs fill-slate-400">
                        Number of Survivors
                    </text>
                    {yLabels.map(label => {
                        const y = mapRange(label, 0, maxSurvivors, CHART_HEIGHT - PADDING, PADDING);
                        return (
                            <g key={`y-${label}`}>
                                <line x1={PADDING - 5} y1={y} x2={CHART_WIDTH - PADDING} y2={y} className="stroke-slate-700/50" strokeDasharray="2 2" />
                                <text x={PADDING - 10} y={y + 4} textAnchor="end" className="text-xs fill-slate-500">
                                    {(label / 1000).toFixed(0)}k
                                </text>
                            </g>
                        );
                    })}

                    {/* X Axis */}
                    <line x1={PADDING} y1={CHART_HEIGHT - PADDING} x2={CHART_WIDTH - PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" strokeWidth="2" />
                    <text x={CHART_WIDTH/2} y={CHART_HEIGHT - PADDING + 40} textAnchor="middle" className="text-xs fill-slate-400">
                        Age (years)
                    </text>
                    {xLabels.map(label => {
                        const x = mapRange(label, 0, maxAge, PADDING, CHART_WIDTH - PADDING);
                        return (
                            <g key={`x-${label}`}>
                                <line x1={x} y1={CHART_HEIGHT - PADDING} x2={x} y2={CHART_HEIGHT - PADDING + 5} className="stroke-slate-600" strokeWidth="2" />
                                <text x={x} y={CHART_HEIGHT - PADDING + 20} textAnchor="middle" className="text-xs fill-slate-500">
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Survival curve */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        className="stroke-sky-400"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                    />

                    {/* Data points */}
                    {points.slice(0, 9).map((point, i) => (
                        <motion.circle
                            key={i}
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            className="fill-sky-400 stroke-2 stroke-slate-900"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * i, duration: 0.3 }}
                        />
                    ))}
                </svg>
            </div>

            <p className="mt-4 text-sm text-slate-400 text-center">
                Starting with 100,000 newborns, the curve shows how the cohort declines through different age groups based on mortality rates.
            </p>
        </div>
    );
};
