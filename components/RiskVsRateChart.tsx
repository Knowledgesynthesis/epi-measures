import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 420;
const PADDING = 60;

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const RiskVsRateChart: React.FC = () => {
    const [affectedProportion, setAffectedProportion] = useState(0.1); // Start at 10%

    const { riskPath, ratePath, currentRisk, currentRate, riskPoint, ratePoint } = useMemo(() => {
        const points = Array.from({ length: 100 }, (_, i) => i / 100);

        // Risk is linear: y = x
        const riskDataPoints = points.map(p => ({
            x: p,
            y: p,
        }));

        // Rate is logarithmic: y = -ln(1-x)
        // We cap it before it goes to infinity at p=1
        const rateDataPoints = points.slice(0, 99).map(p => ({
            x: p,
            y: -Math.log(1 - p),
        }));
        
        const maxYValue = 2.5; // Cap the Y-axis for better visualization

        const toSvgCoords = (dataPoints: {x: number, y: number}[]) => {
            return dataPoints.map(p => ({
                x: mapRange(p.x, 0, 1, PADDING, CHART_WIDTH - PADDING),
                y: mapRange(p.y, 0, maxYValue, CHART_HEIGHT - PADDING, PADDING)
            })).map(p => `${p.x},${p.y}`).join(' ');
        }
        
        const riskPath = toSvgCoords(riskDataPoints);
        const ratePath = toSvgCoords(rateDataPoints);

        const currentRiskValue = affectedProportion;
        // Rate approaches infinity as proportion -> 1. Cap for display.
        const currentRateValue = affectedProportion < 1 ? -Math.log(1 - affectedProportion) : Infinity;

        const riskPoint = {
            x: mapRange(affectedProportion, 0, 1, PADDING, CHART_WIDTH - PADDING),
            y: mapRange(currentRiskValue, 0, maxYValue, CHART_HEIGHT - PADDING, PADDING)
        }
        const ratePoint = {
            x: mapRange(affectedProportion, 0, 1, PADDING, CHART_WIDTH - PADDING),
            y: mapRange(currentRateValue, 0, maxYValue, CHART_HEIGHT - PADDING, PADDING)
        }

        return {
            riskPath: `M ${riskPath}`,
            ratePath: `M ${ratePath}`,
            currentRisk: currentRiskValue,
            currentRate: currentRateValue,
            riskPoint,
            ratePoint
        };
    }, [affectedProportion]);
    
    const yAxisLabels = [0, 0.5, 1.0, 1.5, 2.0, 2.5];
    const xAxisLabels = [0, 20, 40, 60, 80, 100];


    return (
        <div className="w-full mt-8 p-4 sm:p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg flex flex-col items-center">
            
            <div className="w-full max-w-lg mb-6">
                <label htmlFor="affected-slider" className="block text-center text-slate-400 mb-2">
                    Proportion of Population Affected: <span className="font-bold text-slate-100">{(affectedProportion * 100).toFixed(0)}%</span>
                </label>
                <input
                    id="affected-slider"
                    type="range"
                    min="0"
                    max="0.98" // Cap before rate goes to infinity
                    step="0.01"
                    value={affectedProportion}
                    onChange={(e) => setAffectedProportion(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    aria-label="Proportion of population affected slider"
                />
            </div>

            <div className="relative w-full max-w-2xl mx-auto">
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full" aria-labelledby="chart-title" role="img">
                    <title id="chart-title">Chart showing divergence of Risk and Rate</title>
                    {/* Grid lines and axes */}
                    <text x={CHART_WIDTH/2} y={PADDING - 20} textAnchor="middle" className="text-sm fill-slate-300 font-semibold">Risk vs. Rate Divergence</text>
                    
                    {/* Y Axis */}
                    <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" />
                    <text x={15} y={CHART_HEIGHT/2} textAnchor="middle" transform={`rotate(-90, 15, ${CHART_HEIGHT/2})`} className="text-xs fill-slate-400">Value (per unit time)</text>
                     {yAxisLabels.map(label => {
                        const y = mapRange(label, 0, 2.5, CHART_HEIGHT - PADDING, PADDING);
                        return (
                             <g key={`y-${label}`}>
                                <line x1={PADDING - 5} y1={y} x2={CHART_WIDTH - PADDING} y2={y} className="stroke-slate-700/50" strokeDasharray="2 2" />
                                <text x={PADDING - 10} y={y+4} textAnchor="end" className="text-xs fill-slate-500">{label.toFixed(1)}</text>
                             </g>
                        );
                    })}

                    {/* X Axis */}
                    <line x1={PADDING} y1={CHART_HEIGHT - PADDING} x2={CHART_WIDTH - PADDING} y2={CHART_HEIGHT - PADDING} className="stroke-slate-600" />
                    <text x={CHART_WIDTH/2} y={CHART_HEIGHT - PADDING + 35} textAnchor="middle" className="text-xs fill-slate-400">Proportion Affected (%)</text>
                    {xAxisLabels.map(label => {
                        const x = mapRange(label/100, 0, 1, PADDING, CHART_WIDTH - PADDING);
                        return (
                            <g key={`x-${label}`}>
                                <line x1={x} y1={CHART_HEIGHT - PADDING} x2={x} y2={CHART_HEIGHT-PADDING+5} className="stroke-slate-600" />
                                <text x={x} y={CHART_HEIGHT - PADDING + 20} textAnchor="middle" className="text-xs fill-slate-500">{label}</text>
                            </g>
                        );
                    })}
                    
                    {/* Data lines */}
                    <motion.path d={riskPath} fill="none" className="stroke-sky-500" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }}/>
                    <motion.path d={ratePath} fill="none" className="stroke-teal-400" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }}/>
                    
                    {/* Indicator line */}
                    {affectedProportion > 0 && 
                        <line x1={riskPoint.x} y1={PADDING} x2={riskPoint.x} y2={CHART_HEIGHT - PADDING} className="stroke-slate-500" strokeDasharray="4 2" />
                    }
                    
                    {/* Points on lines */}
                    {affectedProportion > 0 &&
                        <>
                            <motion.circle cx={riskPoint.x} cy={riskPoint.y} r="5" className="fill-sky-500 stroke-2 stroke-slate-900" animate={{cx: riskPoint.x, cy: riskPoint.y}} transition={{duration: 0.1}}/>
                            <motion.circle cx={ratePoint.x} cy={ratePoint.y} r="5" className="fill-teal-400 stroke-2 stroke-slate-900" animate={{cx: ratePoint.x, cy: ratePoint.y}} transition={{duration: 0.1}}/>
                        </>
                    }
                </svg>
            </div>
            
            <div className="w-full max-w-lg mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                        <span className="w-3 h-3 rounded-full bg-sky-500 mr-2"></span>
                        <h4 className="font-semibold text-slate-300">Risk</h4>
                    </div>
                    <p className="text-2xl font-bold text-sky-400" aria-live="polite">{(currentRisk * 100).toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                        <span className="w-3 h-3 rounded-full bg-teal-400 mr-2"></span>
                        <h4 className="font-semibold text-slate-300">Rate</h4>
                    </div>
                    <p className="text-2xl font-bold text-teal-400" aria-live="polite">{currentRate.toFixed(3)} <span className="text-base text-slate-400">per person-time</span></p>
                </div>
            </div>
        </div>
    );
};
