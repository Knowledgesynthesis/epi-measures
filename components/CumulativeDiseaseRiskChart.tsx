import React from 'react';
import { motion } from 'framer-motion';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 400;
const PADDING = 60;

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const CumulativeDiseaseRiskChart: React.FC = () => {
    // Generate data showing cumulative risk with and without competing mortality
    const ages = Array.from({ length: 81 }, (_, i) => i); // 0 to 80 years

    // Disease incidence: 0.1% per year from age 30-80 (1% per decade)
    const diseaseIncidenceRate = 0.001; // per year

    const data = ages.map(age => {
        // Unadjusted risk (no competing mortality) - simple accumulation
        let unadjustedRisk = 0;
        if (age >= 30) {
            unadjustedRisk = (age - 30) * diseaseIncidenceRate * 100; // Convert to percentage
        }

        // Adjusted risk (with competing mortality)
        // Survival probability decreases with age (simplified model)
        // Assume 100% survival at 30, declining to 70% by age 70, 40% by 80
        let survivalProb = 1;
        if (age > 30) {
            if (age <= 70) {
                survivalProb = 1 - ((age - 30) / 40) * 0.3; // Linear decline to 70% by age 70
            } else {
                survivalProb = 0.7 - ((age - 70) / 10) * 0.3; // Further decline to 40% by age 80
            }
        }

        const adjustedRisk = unadjustedRisk * survivalProb;

        return {
            age,
            unadjustedRisk: Math.min(unadjustedRisk, 6), // Cap for display
            adjustedRisk: Math.min(adjustedRisk, 6),
        };
    });

    const maxRisk = 6; // percentage
    const maxAge = 80;

    // Convert to SVG coordinates
    const unadjustedPoints = data.map(d => ({
        x: mapRange(d.age, 0, maxAge, PADDING, CHART_WIDTH - PADDING),
        y: mapRange(d.unadjustedRisk, 0, maxRisk, CHART_HEIGHT - PADDING, PADDING)
    }));

    const adjustedPoints = data.map(d => ({
        x: mapRange(d.age, 0, maxAge, PADDING, CHART_WIDTH - PADDING),
        y: mapRange(d.adjustedRisk, 0, maxRisk, CHART_HEIGHT - PADDING, PADDING)
    }));

    const unadjustedPath = `M ${unadjustedPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const adjustedPath = `M ${adjustedPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

    // Axis labels
    const yLabels = [0, 1, 2, 3, 4, 5, 6];
    const xLabels = [0, 20, 30, 40, 50, 60, 70, 80];

    return (
        <div className="w-full mt-6 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-100 mb-4 text-center">Cumulative Disease Risk vs. Age</h4>

            <div className="relative w-full max-w-3xl mx-auto">
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full">
                    <title>Cumulative disease risk showing effect of competing mortality</title>

                    {/* Y Axis */}
                    <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" strokeWidth="2" />
                    <text x={15} y={CHART_HEIGHT/2} textAnchor="middle" transform={`rotate(-90, 15, ${CHART_HEIGHT/2})`} className="text-xs fill-slate-400">
                        Cumulative Risk (%)
                    </text>
                    {yLabels.map(label => {
                        const y = mapRange(label, 0, maxRisk, CHART_HEIGHT - PADDING, PADDING);
                        return (
                            <g key={`y-${label}`}>
                                <line x1={PADDING - 5} y1={y} x2={CHART_WIDTH - PADDING} y2={y} className="stroke-slate-700/50" strokeDasharray="2 2" />
                                <text x={PADDING - 10} y={y + 4} textAnchor="end" className="text-xs fill-slate-500">
                                    {label}%
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

                    {/* Unadjusted risk curve (without competing mortality) */}
                    <motion.path
                        d={unadjustedPath}
                        fill="none"
                        className="stroke-red-400"
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                    />

                    {/* Adjusted risk curve (with competing mortality) */}
                    <motion.path
                        d={adjustedPath}
                        fill="none"
                        className="stroke-teal-400"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
                    />

                    {/* Legend annotations */}
                    <text x={CHART_WIDTH - 180} y={80} className="text-xs fill-red-400">
                        Without competing mortality
                    </text>
                    <line x1={CHART_WIDTH - 195} y1={76} x2={CHART_WIDTH - 185} y2={76} className="stroke-red-400" strokeWidth="2.5" strokeDasharray="5 3" />

                    <text x={CHART_WIDTH - 180} y={105} className="text-xs fill-teal-400">
                        With competing mortality
                    </text>
                    <line x1={CHART_WIDTH - 195} y1={101} x2={CHART_WIDTH - 185} y2={101} className="stroke-teal-400" strokeWidth="3" />
                </svg>
            </div>

            <div className="mt-4 text-sm text-slate-400 space-y-2">
                <p className="text-center">
                    <strong className="text-slate-300">Key insight:</strong> The dashed red line shows cumulative risk if everyone lived forever (≈5% by age 80).
                </p>
                <p className="text-center">
                    The solid teal line shows <em className="italic">true</em> cumulative risk adjusted for people dying from other causes (≈3.5% by age 80).
                </p>
                <p className="text-center text-amber-400">
                    Notice how the adjusted curve levels off as fewer people remain alive at older ages.
                </p>
            </div>
        </div>
    );
};
