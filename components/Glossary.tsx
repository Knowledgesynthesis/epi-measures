import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 transition-transform"
        animate={{ rotate: isOpen ? 0 : -90 }}
        transition={{ duration: 0.2 }}
    >
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </motion.svg>
);

const glossaryTerms = [
    { term: 'Cohort', definition: 'A group of individuals who share a defining characteristic (e.g., birth year, exposure to a risk factor) and are followed over time to observe outcomes.' },
    { term: 'Incidence', definition: 'The rate of new cases of a disease occurring in a population at risk during a specified time period. It measures the appearance of new events.' },
    { term: 'Morbidity', definition: 'Any departure, subjective or objective, from a state of physiological or psychological well-being. In short, it refers to sickness, illness, or disease.' },
    { term: 'Mortality', definition: 'A measure of the frequency of death in a defined population during a specified interval.' },
    { term: 'Person-Time', definition: 'An estimate of the actual time-at-risk that all participants contributed to a study. It is the sum of the time each individual was observed and at risk of the outcome.' },
    { term: 'Prevalence', definition: 'The proportion of a population found to have a condition at a specific point in time (point prevalence) or during a period of time (period prevalence). It measures existing cases (old + new).' },
    { term: 'Rate', definition: 'A measure of the frequency with which an event occurs in a defined population over a specified period of time. The denominator includes a measure of time.' },
    { term: 'Risk (Cumulative Incidence)', definition: 'The probability that an individual will develop a disease over a specified period, calculated as the number of new cases divided by the number of people at risk at the start of the period.' },
];

const GlossaryItem: React.FC<{ term: string, definition: string }> = ({ term, definition }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-700/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left text-lg font-semibold text-slate-100 hover:text-teal-400 transition-colors"
                aria-expanded={isOpen}
            >
                <span>{term}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 pr-6 text-slate-300">{definition}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Glossary: React.FC = () => {
    return (
        <div className="w-full">
            {glossaryTerms.map(item => <GlossaryItem key={item.term} {...item} />)}
        </div>
    );
};
