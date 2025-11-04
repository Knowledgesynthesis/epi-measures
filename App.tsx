
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { Question } from './components/Question';
import { Fraction } from './components/Fraction';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { RiskVsRateChart } from './components/RiskVsRateChart';
import { InteractiveYPLLCalculator } from './components/InteractiveYPLLCalculator';
import { InteractivePrevalenceModel } from './components/InteractivePrevalenceModel';
import { PersonTimeVisualizer } from './components/PersonTimeVisualizer';
import { ProportionalMortalityChart } from './components/ProportionalMortalityChart';
import { BirthRateCalculator } from './components/BirthRateCalculator';
import { SurvivalCurveChart } from './components/SurvivalCurveChart';
import { CumulativeDiseaseRiskChart } from './components/CumulativeDiseaseRiskChart';

const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong className="font-semibold text-teal-400">{children}</strong>
);

// Wrapper for math formulas with fixed size (text-xl, size #2 out of 5)
const MathBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-xl ${className}`}>{children}</div>
);

const MathInline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xl">{children}</span>
);

interface TableOfContentsProps {
    sections: { id: string; title: string }[];
    activeSection: string;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    canIncrease: boolean;
    canDecrease: boolean;
}

interface MobileMenuProps extends TableOfContentsProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ sections, activeSection, increaseFontSize, decreaseFontSize, canIncrease, canDecrease, isOpen, onClose }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            window.history.pushState(null, '', `#${id}`);
            onClose(); // Close menu after selection
        }
    };

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle ESC key to close menu
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="2xl:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sliding Menu */}
            <aside className={`2xl:hidden fixed top-0 right-0 h-screen w-80 bg-slate-900 border-l border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="p-4">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-200 transition"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <nav className="overflow-y-auto h-full pr-2 pt-4">
                        <div className="mb-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={decreaseFontSize}
                                    disabled={!canDecrease}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                                    aria-label="Decrease font size"
                                >
                                    A-
                                </button>
                                <button
                                    onClick={increaseFontSize}
                                    disabled={!canIncrease}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                                    aria-label="Increase font size"
                                >
                                    A+
                                </button>
                            </div>
                        </div>
                        <ul className="space-y-1">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        onClick={(e) => handleLinkClick(e, section.id)}
                                        className={`block border-l-2 pl-3 py-1.5 transition-colors duration-200 text-sm ${
                                            activeSection === section.id
                                            ? 'border-teal-400 text-teal-300 font-semibold'
                                            : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                        }`}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ sections, activeSection, increaseFontSize, decreaseFontSize, canIncrease, canDecrease }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL hash without causing a full reload
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <aside className="hidden 2xl:block fixed top-0 left-0 h-screen w-72 p-6 pt-20 text-sm">
            <nav className="overflow-y-auto h-full pr-2">
                 <div className="mb-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={decreaseFontSize}
                            disabled={!canDecrease}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                            aria-label="Decrease font size"
                        >
                            A-
                        </button>
                        <button
                            onClick={increaseFontSize}
                            disabled={!canIncrease}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                            aria-label="Increase font size"
                        >
                            A+
                        </button>
                    </div>
                </div>
                <ul className="space-y-1">
                    {sections.map(section => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                onClick={(e) => handleLinkClick(e, section.id)}
                                className={`block border-l-2 pl-3 py-1.5 transition-colors duration-200 text-sm ${
                                    activeSection === section.id
                                    ? 'border-teal-400 text-teal-300 font-semibold'
                                    : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                }`}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const contentSections = [
  {
    id: 'count',
    title: 'Count',
    content: [
      <p key="1"><Strong>Definition:</Strong> The simple number of events or people affected — for example, cases, deaths, or people with a disease.</p>,
      <p key="2"><Strong>Examples:</Strong> 24 influenza cases, 10 deaths, or 50 new TB cases.</p>,
      <p key="3" className="p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg"><Strong>Note:</Strong> Counts lack context about <Strong>population size</Strong> or <Strong>time</Strong>.</p>
    ],
  },
  {
    id: 'rate',
    title: 'Rate',
    content: [
      <p key="1"><Strong>Definition:</Strong> The number of events in a defined time divided by the <Strong>average population at risk</Strong> during that interval, often multiplied by a constant (e.g., 1,000 or 100,000).</p>,
      <h3 key="2" className="text-xl font-semibold text-slate-100">General Form:</h3>,
      <div key="3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Rate} = \frac{\text{Events}}{\text{Population}} \times k \text{ per unit time}" />
        </MathBlock>
      </div>,
      <p key="4">Rates standardize counts to a <Strong>population</Strong> (and often time) and reflect the <Strong>tempo or timing</Strong> of events.</p>,
      <h3 key="5" className="text-xl font-semibold text-slate-100">Example:</h3>,
      <p key="6">50 new TB cases in a city of 500,000 in 1 year →</p>,
      <div key="7" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Incidence rate} = \frac{50}{500{,}000} \times 100{,}000 = 10 \text{ per } 100{,}000 \text{ per year}" />
        </MathBlock>
      </div>,
    ],
  },
  {
    id: 'risk',
    title: 'Risk (Cumulative Incidence)',
    content: [
      <p key="1"><Strong>Definition:</Strong> The <Strong>proportion</Strong> of initially unaffected people who experience the event during a specified period in a fixed cohort.</p>,
      <h3 key="2" className="text-xl font-semibold text-slate-100">Formula:</h3>,
      <div key="3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Risk} = \frac{\text{New events}}{\text{Number initially at risk}}" />
        </MathBlock>
      </div>,
       <div key="q1-container">
         <Question
            question="Which statement best distinguishes a rate from a count?"
            options={[
              "A rate is always larger than a count.",
              "✅ A rate standardizes events to a population (and often time), while a count does not.",
              "A rate ignores population size.",
              "Counts include time; rates never do."
            ]}
            correctFeedback="Correct! Rates standardize events to a population and often time, providing essential context that raw counts lack."
            incorrectFeedback="Not quite. Think about what a rate adds to a simple count. It's about context and comparison."
            explanation={
                <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                    <p><Strong>Explanation:</Strong> A count is a simple tally (e.g., 10 cases), which is hard to interpret without context. A rate (e.g., 10 cases per 100,000 people per year) relates that count to the size of the population and the time period, allowing for meaningful comparisons across different groups or times.</p>
                </div>
            }
          />
       </div>
    ],
  },
  {
    id: 'calculator',
    title: 'Interactive Calculator',
    content: [
      <p key="1">Use the calculator below to see how changing the number of events and population size impacts these measures in real-time. This hands-on approach helps build an intuitive understanding of each concept.</p>,
      <InteractiveCalculator key="2" />
    ],
  },
  {
    id: 'relationship',
    title: 'Relationship Between Rate and Risk',
    content: [
      <p key="1">A <Strong>rate</Strong> measures how quickly events occur, while a <Strong>risk</Strong> measures the probability that an event occurs within a specified period.</p>,
      <p key="2">They are closely related — when <Strong>events are rare</Strong> and the <Strong>time interval is short</Strong>, the rate can be a <Strong>good approximation</Strong> of the risk.<br/>However, when <Strong>events are common</Strong> or the <Strong>follow-up period is long</Strong>, the two measures diverge.</p>,
      <h3 key="3" className="text-2xl font-bold text-slate-100">Example 1 — When Rate ≈ Risk (Events Are Rare)</h3>,
      <p key="4">Suppose a population of <Strong>100,000 people</Strong> is followed for <Strong>1 year</Strong>, and <Strong>10 new cases</Strong> of a rare disease occur.</p>,
      <ul key="5" className="list-disc list-inside space-y-3 pl-4 font-mono">
        <li><Strong>Risk</Strong> = 10 / 100,000 = 0.0001 (or 0.01%)</li>
        <li><Strong>Rate</Strong> = (10 / 100,000 person-years) × 100,000 = 10 per 100,000 per year</li>
      </ul>,
      <p key="6">Because only a few people are affected, the average population at risk remains nearly constant — the rate and risk are almost identical.</p>,
      <h3 key="7" className="text-2xl font-bold text-slate-100">Example 2 — When Rate ≠ Risk (Events Are Common or Follow-Up Is Long)</h3>,
      <p key="8">Now imagine a population of <Strong>100,000 people</Strong> followed for <Strong>10 years</Strong>, during which <Strong>30,000 develop the disease</Strong>.</p>,

      <div key="9" className="pl-4">
        <p className="font-semibold text-slate-200 mb-2">• <Strong>Risk (Cumulative Incidence)</Strong></p>
        <div className="pl-6 mb-4">
          <div className="font-mono text-slate-300">
            Risk = 30,000 / 100,000 = 0.30 <span className="text-slate-400">(or 30% over 10 years)</span>
          </div>
        </div>

        <p className="font-semibold text-slate-200 mb-2">• <Strong>Incidence Rate (Density)</Strong></p>
        <div className="pl-6 space-y-3 mb-4">
          <p>Because new cases occur gradually, on average about half of those who become cases (15,000) leave the "at-risk" pool by the midpoint of follow-up.<br/>
          Thus, the <Strong>average number at risk</Strong> ≈ 100,000 − 15,000 = <Strong>85,000 people</Strong>.</p>

          <div className="font-mono text-slate-300">
            Person-time = 85,000 × 10 = 850,000 person-years
          </div>

          <div className="font-mono text-slate-300">
            Rate = (30,000 / 850,000) × 100,000 = 3,529 per 100,000 person-years
          </div>

          <div className="font-mono text-slate-300 pl-4">
            (≈ <Strong>3.5% per year</Strong>)
          </div>
        </div>
      </div>,

      <p key="10" className="font-semibold text-slate-200"><Strong>Interpretation:</Strong></p>,
      <p key="11">Here, many people are removed from the "at-risk" group as they develop the disease.<br/>
      Although 30% of the population develops the disease over 10 years, the rate (3.5% per year) describes how quickly new cases occur in the remaining at-risk group.<br/>
      The <Strong>rate remains higher numerically</Strong> because it's based on <Strong>person-time</Strong>, while <Strong>risk</Strong> reflects the <Strong>probability</Strong> of becoming a case within a fixed cohort over time.</p>,

      <blockquote key="12" className="border-l-4 border-teal-500 pl-4 italic text-slate-300 bg-slate-800/30 py-3 pr-4 rounded-r">
        In other words, risk and rate diverge when follow-up is long or disease events are common — rate measures speed, risk measures probability.
      </blockquote>
    ],
  },
  {
    id: 'visualization',
    title: 'Visualizing the Difference',
    content: [
      <p key="1">This interactive chart demonstrates how risk and rate diverge as the proportion of the population affected by an event increases over a single time period.</p>,
      <p key="2">While they are nearly identical for rare events (low proportion affected), the rate grows much faster than risk for common events. Drag the slider to see this relationship in action.</p>,
      <RiskVsRateChart key="3" />,

      <h3 key="4" className="text-2xl font-bold text-slate-100 mt-8"><Strong>Mathematical relationship between Risk and Rate</Strong></h3>,

      <p key="5">This figure is based on the fundamental relationship between <em className="italic">risk (cumulative incidence)</em> and <em className="italic">rate (incidence rate or hazard)</em> when events occur at a constant rate over time:</p>,

      <div key="6" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Risk} = 1 - e^{-(\text{Rate} \times \text{Time})}" />
          <BlockMath math="\text{Rate} = -\ln(1 - \text{Risk}) / \text{Time}" />
        </MathBlock>
      </div>,

      <p key="7">For this chart, <Strong>Time = 1 unit</Strong>, so it simplifies to:</p>,

      <div key="8" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Rate} = -\ln(1 - \text{Risk})" />
        </MathBlock>
      </div>,

      <p key="9" className="font-semibold text-slate-200"><Strong>Interpretation:</Strong></p>,
      <ul key="10" className="list-disc list-inside space-y-3 pl-4">
        <li>When events are <em className="italic">rare</em> (&lt;10%) or the <em className="italic">time period is short</em>, the rate and risk are nearly identical (the curves overlap).</li>
        <li>As more of the population experiences the event, the risk increases more slowly, while the rate continues to climb steeply.</li>
        <li>The rate approaches infinity as the risk approaches 100%, because the formula involves a natural logarithm of zero.</li>
      </ul>,

      <p key="11">This mathematical link explains why, in practice, <Strong>rates and risks can differ markedly when follow-up is long or events are common.</Strong></p>
    ],
  },
  {
    id: 'incidence',
    title: 'Incidence',
    content: [
      <p key="1"><Strong>Definition:</Strong> Measures the occurrence of <Strong>new cases</Strong> of a disease among those initially free of the outcome during a specified period. It quantifies the <Strong>risk</Strong> or <Strong>rate</Strong> of developing disease.</p>,
      
      <h3 key="2" className="text-2xl font-bold text-slate-100">Cumulative Incidence (Risk)</h3>,
      <div key="3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Cumulative Incidence (CI)} = \frac{\text{New cases during a specified period}}{\text{Number of people initially at risk}}" />
        </MathBlock>
      </div>,
      <ul key="4" className="list-disc list-inside space-y-3 pl-4">
        <li>Represents the <Strong>probability</Strong> of developing disease over a defined time period.</li>
        <li>Best for <Strong>fixed cohorts</Strong> with minimal loss to follow-up.</li>
        <li>Often synonymous with:
            <ul className="list-['–'] list-inside pl-6 space-y-1 mt-2">
                <li><Strong>Attack rate</Strong> (short-term incidence)</li>
                <li><Strong>Risk of disease</Strong></li>
                <li><Strong>Probability of getting disease</Strong></li>
            </ul>
        </li>
      </ul>,

      <h3 key="5" className="text-2xl font-bold text-slate-100">Incidence Density (Incidence Rate or Person-Time Rate)</h3>,
      <div key="6" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Incidence Density (IR)} = \frac{\text{New cases during a specified time period}}{\text{Total person-time at risk during that period}}" />
        </MathBlock>
      </div>,
      <ul key="7" className="list-disc list-inside space-y-3 pl-4">
        <li>Expressed as cases <Strong>per person-time</Strong>, e.g., <em className="italic">per person-year</em> or <em className="italic">per 1,000 person-months</em>.</li>
        <li>Allows for:
            <ul className="list-['–'] list-inside pl-6 space-y-1 mt-2">
              <li>Variable observation times (due to migration, death, loss to follow-up)</li>
              <li><Strong>Recurrent events</Strong> — if an individual develops the disease more than once, each event contributes both new cases and new person-time.</li>
            </ul>
        </li>
        <li>Provides a <Strong>precise rate</Strong> of occurrence in a dynamic population.</li>
      </ul>,
      <p key="8"><Strong>Person-Time</Strong> combines both: the number of people observed, and the amount of time each contributes while at risk.</p>,
      <p key="9">Example:</p>,
      <ul key="10" className="list-['–'] list-inside space-y-1 pl-4">
        <li>100 people followed for 1 year → 100 person-years</li>
        <li>10 people followed for 10 years → also 100 person-years</li>
        <li>1 person followed for 6 months → 0.5 person-years</li>
      </ul>,
      <p key="11">Thus, “per person-time” means <Strong>per unit of time contributed by each person</Strong>, allowing fair comparisons even when observation time varies.</p>,
      <PersonTimeVisualizer key="pt-viz" />,
       <div key="q2-container">
            <Question
                question="A study tracks a condition that can recur within individuals. Which metric makes full use of the data?"
                options={[
                    "Point prevalence",
                    "Period prevalence",
                    "✅ Incidence density (per person-time)",
                    "Attributable risk",
                ]}
                correctFeedback="Correct! Incidence density uses person-time, making it ideal for dynamic populations and tracking recurrent events."
                incorrectFeedback="Consider which measure is designed to handle variable follow-up times and multiple events per person."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> Incidence density accounts for <Strong>person-time</Strong> and counts <Strong>recurrent events</Strong> within individuals, providing the most comprehensive measure when multiple episodes per person are possible.</p>
                    </div>
                }
            />
        </div>,
    ],
  },
  {
    id: 'prevalence',
    title: 'Prevalence',
    content: [
      <p key="1"><Strong>Definition:</Strong> Measures the <Strong>proportion of existing cases</Strong> (old + new) in a population at a specific point or during a defined period. It represents the <Strong>burden of disease</Strong> at that moment.</p>,
      <div key="2" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Prevalence (P)} = \frac{\text{Existing cases}}{\text{Total population}}" />
        </MathBlock>
      </div>,
      <ul key="3" className="list-disc list-inside space-y-3 pl-4">
        <li><Strong>Point prevalence:</Strong> Disease at a single point in time.</li>
        <li><Strong>Period prevalence:</Strong> Disease during a specified time interval.</li>
        <li>Useful for <Strong>public health planning</Strong> and <Strong>resource allocation</Strong>, but not for measuring risk.</li>
      </ul>,
    ],
  },
  {
    id: 'relationship-incidence-prevalence',
    title: 'Relationship: Incidence, Prevalence & Duration',
    content: [
      <p key="1">In steady-state conditions (stable incidence and duration), the relationship is:</p>,
      <div key="2" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="P = \frac{I \times D}{1 + (I \times D)}" />
        </MathBlock>
      </div>,
      <p key="3">where:</p>,
      <ul key="4" className="list-['–'] list-inside space-y-1 pl-4 font-mono">
        <li>P = Prevalence</li>
        <li>I = Incidence rate (or incidence density)</li>
        <li>D = Average duration of disease (until recovery or death)</li>
      </ul>,
      <h3 key="5" className="text-2xl font-bold text-slate-100">Interpretation</h3>,
      <ul key="6" className="list-disc list-inside space-y-3 pl-4">
          <li><Strong>Inflow:</Strong> New cases enter the pool of disease (incidence).</li>
          <li><Strong>Outflow:</Strong> People leave the pool through recovery or death (duration).</li>
          <li>The <Strong>prevalence</Strong> reflects the balance between these two forces — like the “water level” in a pool.</li>
      </ul>,
      <p key="7">When the disease is <Strong>rare</Strong> (prevalence &lt;10%), the relationship simplifies to:</p>,
      <div key="8" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">
        <span>P ≈ I × D</span>
      </div>,
      <InteractivePrevalenceModel key="bathtub-model" />,
      <h3 key="9" className="text-2xl font-bold text-slate-100">Conceptual Understanding</h3>,
      <p key="10">As incidence increases or duration lengthens, more people are “in the pool” with disease → prevalence rises.<br/>If recovery or death occurs faster, duration shortens → prevalence falls.<br/>This approximation holds <Strong>only when incidence and duration are stable</Strong> over time.</p>,
      <div key="q3-container">
        <Question
            question="In a stable population with a rare disease, which change will increase prevalence the most?"
            options={[
                "✅ Longer average duration due to better survival",
                "Shorter duration due to faster recovery",
                "Lower incidence",
                "Smaller population size",
            ]}
            correctFeedback="Exactly! In the 'bathtub' model (P ≈ I × D), increasing duration (D) keeps people in the 'prevalent' pool longer, raising the water level."
            incorrectFeedback="Remember the formula P ≈ I × D. Which variable change would cause P (prevalence) to increase?"
            explanation={
                <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                    <p><Strong>Explanation:</Strong> When incidence is steady, extending the average duration (e.g., improved survival) keeps more cases in the population at any given time, thereby increasing prevalence.</p>
                </div>
            }
        />
      </div>,
    ],
  },
  {
    id: 'mortality',
    title: 'Mortality and Fatality',
    content: [
      <h3 key="m1" className="text-2xl font-bold text-slate-100">Mortality</h3>,
      <p key="m2"><Strong>Definition:</Strong> Measures the <Strong>frequency of death</Strong> in a population during a specified period of time.</p>,
      <div key="m3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Mortality rate} = \frac{\text{Number of deaths during a specified time period}}{\text{Average number of people alive during that time}} \times k" />
        </MathBlock>
      </div>,
      <p key="m4">Commonly scaled per <Strong>1,000</Strong> or <Strong>100,000</Strong> population.</p>,
      <p key="m5">If the numerator specifies deaths <Strong>from a particular disease</Strong>, it becomes the <Strong>disease-specific mortality rate</Strong>.</p>,
      <div key="m6" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Disease-specific mortality rate} = \frac{\text{Deaths from disease X in a given period}}{\text{Population at midyear (or average population)}} \times k" />
        </MathBlock>
      </div>,
      <p key="m7" className="p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg"><Strong>Interpretation:</Strong> Mortality measures the <Strong>risk of dying</Strong> in the entire population — not just among those who already have the disease.</p>,
      
      <h3 key="c1" className="text-2xl font-bold text-slate-100">Case-Fatality Rate (CFR)</h3>,
      <p key="c2"><Strong>Definition:</Strong> Proportion of individuals with a disease who die from that disease within a specified period.</p>,
      <div key="c3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Case-fatality rate (CFR)} = \frac{\text{Deaths among cases}}{\text{Total number of cases}} \times 100\%" />
        </MathBlock>
      </div>,
      <ul key="c4" className="list-disc list-inside space-y-3 pl-4">
          <li>Measures <Strong>disease severity (prognosis)</Strong> rather than frequency.</li>
          <li>Usually reported for a defined time interval (e.g., 30-day, 1-year, or 5-year CFR).</li>
          <li>Depends on case definition, detection, and timing of follow-up.</li>
      </ul>,
      <h4 key="c5" className="text-xl font-semibold text-slate-100">Example</h4>,
      <p key="c6">If <Strong>200</Strong> people are diagnosed with Disease X and <Strong>10</Strong> die within 30 days:</p>,
      <div key="c7" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{CFR} = \frac{10}{200} \times 100\% = 5\%" />
        </MathBlock>
      </div>,
      <p key="c8">That means <Strong>5% of diagnosed patients</Strong> died within the first 30 days. So the 30-day case-fatality rate (CFR) = <Strong>5%</Strong>.</p>,
      
      <h3 key="l1" className="text-2xl font-bold text-slate-100">Example: Linking Mortality and CFR</h3>,
      <p key="l2">If the city population is <Strong>1,000,000</Strong>, and 10 people die from Disease X within 30 days:</p>,
      <div key="l3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Cause-specific mortality rate} = \frac{10}{1{,}000{,}000} \times 100{,}000 = 1 \text{ per } 100{,}000" />
        </MathBlock>
      </div>,
      <p key="l4">This is <Strong>linked</Strong> to the previous example:</p>,
      <ul key="l5" className="list-disc list-inside space-y-3 pl-4">
          <li>The <Strong>CFR</Strong> (5%) measures <Strong>severity among those diagnosed (cases)</Strong>.</li>
          <li>The <Strong>mortality rate</Strong> (1 per 100,000) measures <Strong>risk of death from that disease in the entire population</Strong>.</li>
      </ul>,
      <p key="l6">Thus, CFR and mortality reflect different perspectives:</p>,
      <ul key="l7" className="list-['–'] list-inside pl-6 space-y-1 mt-2">
          <li><Strong>CFR → how deadly is the disease among those who have it</Strong></li>
          <li><Strong>Mortality rate → how common are deaths due to that disease in the population</Strong></li>
      </ul>,
      
      <h3 key="cr1" className="text-2xl font-bold text-slate-100">Complication Rate</h3>,
      <div key="cr2" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Complication rate} = \frac{\text{Patients with a complication}}{\text{Patients exposed to the disease or treatment}}" />
        </MathBlock>
      </div>,
      <p key="cr3">Represents the <Strong>proportion</Strong> of patients who experience a complication of a disease or its treatment. Requires sufficient follow-up.</p>,
      
      <h3 key="pm1" className="text-2xl font-bold text-slate-100">Proportional Mortality</h3>,
      <p key="pm2"><Strong>Definition:</Strong></p>,
      <div key="pm3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Proportional mortality} = \frac{\text{Deaths due to a specific disease in a time period}}{\text{Total deaths during that same period}}" />
        </MathBlock>
      </div>,
      <p key="pm4">Indicates the <Strong>proportion of all deaths</Strong> in a population that were due to a particular cause.</p>,
      <div key="pm5" className="p-3 bg-yellow-900/50 border-l-4 border-yellow-500 rounded-r-lg text-yellow-300">
          <p><Strong>⚠️ Caution:</Strong> Proportional mortality can be <Strong>misleading</Strong> — it depends not only on deaths from the specific disease but also on deaths from <em className="italic">other</em> causes. If mortality from other causes increases or decreases, proportional mortality may change even if deaths from the disease stay constant.</p>
      </div>,
      <ProportionalMortalityChart key="pm-chart" />,
      <h4 key="e1-1" className="text-xl font-semibold text-slate-100">Example 1 — Hodgkin’s Disease in Teachers (1960s Study)</h4>,
      <ul key="e1-2" className="list-['–'] list-inside space-y-1 pl-4">
          <li>2.5% of deaths in teachers were due to Hodgkin’s disease.</li>
          <li>1.0% of deaths in the general population were due to Hodgkin’s disease.</li>
          <li>Authors concluded that teachers were <Strong>2.5 times more likely</Strong> to die from Hodgkin’s.</li>
      </ul>,
      <p key="e1-3"><Strong>Why this conclusion is misleading:</Strong></p>,
      <p key="e1-4">Proportional mortality looks only at the <em className="italic">distribution of causes of death</em>, not at the <em className="italic">risk of death</em>. If teachers had <Strong>fewer total deaths overall</Strong> (perhaps due to being healthier), Hodgkin’s could make up a higher percentage of their deaths — even if their actual <em className="italic">risk</em> of dying from Hodgkin’s wasn’t higher.</p>,
      <p key="e1-5" className="p-3 bg-red-900/40 border-l-4 border-red-500 rounded-r-lg"><Strong>✅ Therefore, the conclusion is false or misleading.</Strong> To truly assess risk, we’d need <Strong>disease-specific mortality rates</Strong> or <Strong>incidence data</Strong>, not just proportional mortality.</p>,
      
      <h4 key="e2-1" className="text-xl font-semibold text-slate-100">Example 2 — Leukemia in White vs. Black Children in Denver</h4>,
      <ul key="e2-2" className="list-['–'] list-inside space-y-1 pl-4">
          <li>10% of deaths in white children under 10 were due to leukemia.</li>
          <li>5% of deaths in black children under 10 were due to leukemia.</li>
      </ul>,
       <div key="leukemia-q-container">
        <Question
            question="Which statements are true?"
            options={[
              "The relative risk for leukemia in white vs. black children is 2.0",
              "The attributable risk for leukemia in white vs. black children is 5/100",
              "✅ Neither the attributable risk nor the relative risk can be determined from the data provided"
            ]}
            correctFeedback="Correct! The data is proportional mortality, not incidence. We can't determine risk without knowing the size of the at-risk populations."
            incorrectFeedback="This is a classic trap! The data shows the proportion of *deaths*, not the risk of getting the disease in the first place."
            explanation={
                <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                    <p><Strong>Explanation:</Strong> The data provides <Strong>proportional mortality</Strong> (the proportion of total deaths due to leukemia), not risk or incidence. To calculate relative or attributable risk, you need incidence rates, which require knowing the total number of children at risk in each group, not just the distribution of deaths.</p>
                </div>
            }
        />
      </div>,
      
      <h3 key="r1" className="text-2xl font-bold text-slate-100">Relationships Between Measures</h3>,
      <h4 key="r2" className="text-xl font-semibold text-slate-100">1. Mortality, Incidence, and Case Fatality</h4>,
      <div key="r3" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">
          <span>Mortality = Incidence × Case-fatality rate</span>
      </div>,
      <p key="r4">This holds when incidence and case fatality are <Strong>stable over time</Strong>. Mortality combines how often the disease occurs (<Strong>incidence</Strong>) and how deadly it is (<Strong>CFR</Strong>).</p>,
      <h4 key="r5" className="text-xl font-semibold text-slate-100">2. Case Fatality and Survival</h4>,
      <div key="r6" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">
          <span>Survival rate = 1 - Case-fatality rate</span>
      </div>,
      <p key="r7">If 20% of cases die, the survival rate is 80%.</p>,
       <div key="q4-container">
            <Question
                question="Which statement is true?"
                options={[
                    "✅ CFR measures severity among cases, while mortality measures risk of death in the entire population.",
                    "CFR and mortality are identical if the population is large.",
                    "Mortality ignores time by definition.",
                    "CFR requires the total population in the denominator."
                ]}
                correctFeedback="That's right. CFR measures severity in the sick group (cases), while mortality measures death risk in the whole population."
                incorrectFeedback="Think about the denominators. CFR uses 'total cases,' while mortality uses 'total population.' They measure different things."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> CFR evaluates <Strong>severity</Strong> within the diseased group. Mortality evaluates <Strong>risk</Strong> within the entire population. They answer different questions — one about <Strong>prognosis</Strong>, the other about <Strong>population impact</Strong>.</p>
                    </div>
                }
            />
        </div>,
    ]
  },
  {
    id: 'birth-rates',
    title: 'Birth Rate vs Fertility Rate vs Fetal Death Rate',
    content: [
      <h3 key="br1" className="text-2xl font-bold text-slate-100">Crude Birth Rate (CBR)</h3>,
      <p key="br2"><Strong>Definition:</Strong> The total number of <Strong>live births in a year</Strong> per <Strong>midyear (average) population</Strong>, scaled by 1,000.</p>,
      <div key="br3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Crude Birth Rate (CBR)} = \frac{\text{Live births in a year}}{\text{Midyear total population}} \times 1{,}000" />
        </MathBlock>
      </div>,
      <ul key="br4" className="list-disc list-inside space-y-3 pl-4">
        <li>Includes the entire population (men, women, children, elderly) — not just those capable of giving birth.</li>
        <li>Provides a <Strong>general measure of population growth</Strong>, but not reproductive behavior.</li>
      </ul>,
      <h4 key="br5" className="text-xl font-semibold text-slate-100">Example:</h4>,
      <p key="br6">If a city has <Strong>8,000 live births</Strong> and a <Strong>population of 600,000</Strong>:</p>,
      <div key="br7" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{CBR} = \frac{8{,}000}{600{,}000} \times 1{,}000 = 13.3 \text{ per } 1{,}000 \text{ population}" />
        </MathBlock>
      </div>,

      <h3 key="gfr1" className="text-2xl font-bold text-slate-100">General Fertility Rate (GFR)</h3>,
      <p key="gfr2"><Strong>Definition:</Strong> The number of <Strong>live births in a year</Strong> per <Strong>1,000 women of reproductive age</Strong> (typically 15–44 or 10–49 years) at midyear.</p>,
      <div key="gfr3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{General Fertility Rate (GFR)} = \frac{\text{Live births in a year}}{\text{Women aged 15–44 at midyear}} \times 1{,}000" />
        </MathBlock>
      </div>,
      <ul key="gfr4" className="list-disc list-inside space-y-3 pl-4">
        <li>Focuses on women <Strong>at risk of giving birth</Strong> — more precise than the crude birth rate.</li>
        <li>Reflects <Strong>reproductive behavior</Strong> rather than overall population growth.</li>
      </ul>,
      <h4 key="gfr5" className="text-xl font-semibold text-slate-100">Example:</h4>,
      <p key="gfr6">Using the same city data:</p>,
      <ul key="gfr7" className="list-['–'] list-inside space-y-1 pl-4">
        <li>Live births = 8,000</li>
        <li>Women aged 15–44 = 150,000</li>
      </ul>,
      <div key="gfr8" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{GFR} = \frac{8{,}000}{150{,}000} \times 1{,}000 = 53.3 \text{ per } 1{,}000 \text{ women aged 15–44}" />
        </MathBlock>
      </div>,
      <p key="gfr9" className="p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg"><Strong>✅ Explanation:</Strong> The 53.3 value means that for every 1,000 women aged 15–44, there were approximately <Strong>53 live births</Strong> in that year.</p>,
      
      <BirthRateCalculator key="br-calc" />,

      <h3 key="asfr1" className="text-2xl font-bold text-slate-100">Age-Specific Fertility Rate (ASFR)</h3>,
      <p key="asfr2"><Strong>Definition:</Strong></p>,
      <p key="asfr3">The number of <em className="italic">live births per 1,000 women</em> in a specific <Strong>5-year age group</Strong> (e.g., 15–19, 20–24, …, 40–44).</p>,
      <div key="asfr4" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{ASFR}_x = \frac{\text{Births to women in age group x}}{\text{Number of women in that age group}} \times 1{,}000" />
        </MathBlock>
      </div>,
      <p key="asfr5"><Strong>Intuitive explanation:</Strong></p>,
      <p key="asfr6">ASFR shows <em className="italic">how many births per 1,000 women</em> occur each year within each 5-year age band.</p>,

      <h3 key="tfr1" className="text-2xl font-bold text-slate-100 mt-8">Total Fertility Rate (TFR)</h3>,
      <p key="tfr2"><Strong>Definition:</Strong></p>,
      <p key="tfr3">The <Strong>sum of ASFRs</Strong> across all reproductive ages (usually <Strong>15–44 years</Strong>), <Strong>weighted by the width of each age interval</Strong> (typically 5 years).<br/>
      It represents the <em className="italic">average number of children a woman would have</em> over her lifetime if current fertility rates persist.</p>,
      <div key="tfr4" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{TFR} = \sum (\text{ASFR}_x \times n)" />
          <p className="text-center text-sm text-slate-400 mt-3">When all age intervals are 5 years wide:</p>
          <BlockMath math="\text{TFR} = 5 \times \sum \text{ASFR}_x" />
        </MathBlock>
      </div>,
      <p key="tfr5"><Strong>Intuitive explanation:</Strong></p>,
      <p key="tfr6">Since each ASFR is a <em className="italic">rate per year</em>, multiplying by the number of years in each age band (usually 5) converts it to <em className="italic">births per woman</em> over that period.<br/>
      Summing across all ages gives the total lifetime fertility per woman.</p>,

      <h3 key="tfr-ex1" className="text-2xl font-bold text-slate-100 mt-8">Example</h3>,
      <div key="tfr-ex2" className="overflow-x-auto">
        <table className="w-full border-collapse bg-slate-800/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-700/50">
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Age Group (years)</th>
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">ASFR (births per 1,000 women)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border border-slate-700/50">15–19</td><td className="p-3 border border-slate-700/50 font-mono">25</td></tr>
            <tr><td className="p-3 border border-slate-700/50">20–24</td><td className="p-3 border border-slate-700/50 font-mono">90</td></tr>
            <tr><td className="p-3 border border-slate-700/50">25–29</td><td className="p-3 border border-slate-700/50 font-mono">110</td></tr>
            <tr><td className="p-3 border border-slate-700/50">30–34</td><td className="p-3 border border-slate-700/50 font-mono">80</td></tr>
            <tr><td className="p-3 border border-slate-700/50">35–39</td><td className="p-3 border border-slate-700/50 font-mono">40</td></tr>
            <tr><td className="p-3 border border-slate-700/50">40–44</td><td className="p-3 border border-slate-700/50 font-mono">10</td></tr>
          </tbody>
        </table>
      </div>,
      <div key="tfr-ex3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\sum \text{ASFR}_x = 25 + 90 + 110 + 80 + 40 + 10 = 355" />
          <p className="text-center text-sm text-slate-400 mt-3">Then, applying the formula:</p>
          <BlockMath math="\text{TFR} = (5 \times 355) / 1{,}000 = 1.775" />
        </MathBlock>
      </div>,
      <p key="tfr-ex4" className="p-3 bg-teal-900/40 border-l-4 border-teal-500 rounded-r-lg"><Strong>✅ Total Fertility Rate (TFR) = 1.78 children per woman</Strong></p>,
      <p key="tfr-ex5"><Strong>Key takeaway:</Strong></p>,
      <p key="tfr-ex6">TFR ≈ 1.8 means that, on average, each woman would have 1.8 children over her lifetime if current age-specific fertility rates remained constant.</p>,
      
      <h3 key="fd1" className="text-2xl font-bold text-slate-100">Fetal Death (Stillbirth) Rate</h3>,
      <p key="fd2"><Strong>Definition:</Strong> The proportion of <Strong>fetal deaths</Strong> at or beyond a specified gestational age (e.g., ≥20 weeks, ≥22 weeks, or ≥28 weeks — depending on national or WHO definition) per <Strong>1,000 total births (live + fetal)</Strong>.</p>,
       <div key="fd3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Fetal Death Rate} = \frac{\text{Fetal deaths} \geq \text{threshold gestational age}}{\text{Fetal deaths} \geq \text{threshold} + \text{Live births}} \times 1{,}000" />
        </MathBlock>
      </div>,
      <p key="fd4"><Strong>Thresholds:</Strong></p>,
      <ul key="fd5" className="list-['–'] list-inside space-y-1 pl-4">
        <li><Strong>U.S. definition:</Strong> ≥20 weeks or ≥350 g</li>
        <li><Strong>WHO definition:</Strong> ≥22 weeks or ≥500 g</li>
      </ul>,
      <p key="fd6">Used to assess <Strong>quality of prenatal and obstetric care</Strong>.</p>,

      <h3 key="pmr1" className="text-2xl font-bold text-slate-100">Perinatal Mortality Rate</h3>,
      <p key="pmr2"><Strong>Definition:</Strong> Includes <Strong>fetal deaths (stillbirths)</Strong> plus <Strong>deaths in the first 7 days of life</Strong>, divided by all births (live + fetal), per 1,000.</p>,
       <div key="pmr3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Perinatal Mortality Rate} = \frac{\text{Stillbirths} + \text{deaths} < 7 \text{ days}}{\text{Stillbirths} + \text{live births}} \times 1{,}000" />
        </MathBlock>
      </div>,
      <p key="pmr4"><Strong>Notes:</Strong> Sometimes defined with 28 days (alternative WHO definition). Reflects combined outcomes of <Strong>pregnancy and early neonatal care</Strong>.</p>,

      <h3 key="ndr1" className="text-2xl font-bold text-slate-100">Neonatal Death Rate</h3>,
      <p key="ndr2"><Strong>Definition:</Strong> Deaths of infants <Strong>in the first 28 days of life</Strong> per 1,000 live births.</p>,
      <div key="ndr3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Neonatal Death Rate} = \frac{\text{Deaths in first 28 days}}{\text{Live births}} \times 1{,}000" />
        </MathBlock>
      </div>,

      <h3 key="idr1" className="text-2xl font-bold text-slate-100">Infant Death Rate</h3>,
      <p key="idr2"><Strong>Definition:</Strong> Deaths of infants <Strong>under 1 year of age</Strong> per 1,000 live births.</p>,
       <div key="idr3" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Infant Death Rate} = \frac{\text{Deaths under 1 year}}{\text{Live births}} \times 1{,}000" />
        </MathBlock>
      </div>,
       <ul key="idr4" className="list-disc list-inside space-y-3 pl-4">
        <li>Used as a key indicator of <Strong>population health and healthcare quality</Strong>.</li>
        <li>Includes both <Strong>neonatal (&lt;28 days)</Strong> and <Strong>postneonatal (28 days–1 year)</Strong> deaths.</li>
      </ul>,

      <h3 key="cs1" className="text-2xl font-bold text-slate-100">Comparison Summary</h3>,
      <div key="cs2" className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-300">
            <thead>
                <tr className="bg-slate-800/70">
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Measure</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Numerator</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Denominator</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Focus</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Key Use</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Crude Birth Rate (CBR)</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Total population</td>
                    <td className="p-3 border border-slate-700/50 align-top">Overall population growth</td>
                    <td className="p-3 border border-slate-700/50 align-top">Broad demographic measure</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>General Fertility Rate (GFR)</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Women aged 15–44</td>
                    <td className="p-3 border border-slate-700/50 align-top">Women at risk of giving birth</td>
                    <td className="p-3 border border-slate-700/50 align-top">Reproductive behavior</td>
                </tr>
                 <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Age-Specific Fertility Rate (ASFR)</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Live births in an age group</td>
                    <td className="p-3 border border-slate-700/50 align-top">Women in same age group</td>
                    <td className="p-3 border border-slate-700/50 align-top">Age-specific fertility patterns</td>
                    <td className="p-3 border border-slate-700/50 align-top">Used to compute TFR</td>
                </tr>
                 <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Total Fertility Rate (TFR)</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Derived from ASFRs</td>
                    <td className="p-3 border border-slate-700/50 align-top">—</td>
                    <td className="p-3 border border-slate-700/50 align-top">Lifetime births per woman</td>
                    <td className="p-3 border border-slate-700/50 align-top">Long-term population replacement</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Fetal Death (Stillbirth) Rate</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Fetal deaths ≥ threshold</td>
                    <td className="p-3 border border-slate-700/50 align-top">Fetal deaths + live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Late fetal loss</td>
                    <td className="p-3 border border-slate-700/50 align-top">Pregnancy outcomes</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Perinatal Mortality Rate</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Stillbirths + deaths &lt;7 days</td>
                    <td className="p-3 border border-slate-700/50 align-top">Stillbirths + live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Combined prenatal + early neonatal loss</td>
                    <td className="p-3 border border-slate-700/50 align-top">Maternal/infant care indicator</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Neonatal Death Rate</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Deaths &lt;28 days</td>
                    <td className="p-3 border border-slate-700/50 align-top">Live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Early infant survival</td>
                    <td className="p-3 border border-slate-700/50 align-top">Neonatal care quality</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Infant Death Rate</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Deaths &lt;1 year</td>
                    <td className="p-3 border border-slate-700/50 align-top">Live births</td>
                    <td className="p-3 border border-slate-700/50 align-top">Infant survival</td>
                    <td className="p-3 border border-slate-700/50 align-top">Overall child health</td>
                </tr>
            </tbody>
        </table>
      </div>,
      <div key="q5-container">
            <Question
                question="Which measure best adjusts for the population actually at risk of giving birth?"
                options={[
                    "Crude birth rate (CBR)",
                    "✅ General fertility rate (GFR)",
                    "Crude death rate",
                    "Infant mortality rate",
                ]}
                correctFeedback="Correct! The General Fertility Rate (GFR) refines the denominator to only include women of childbearing age, the population actually at risk."
                incorrectFeedback="Think about which rate uses a more specific, relevant denominator for measuring fertility."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> The GFR limits the denominator to <Strong>women of childbearing age (15–44)</Strong>, i.e., those biologically capable of giving birth. CBR, in contrast, includes the entire population (men, children, elderly), which dilutes the measure.</p>
                    </div>
                }
            />
        </div>,
    ]
  },
  {
    id: 'ypll',
    title: 'Years of Potential Life Lost (YPLL)',
    content: [
      <h3 key="ypll-def-h" className="text-2xl font-bold text-slate-100">Definition</h3>,
      <p key="ypll-def-p1"><Strong>Years of Potential Life Lost (YPLL)</Strong> is a measure of <Strong>premature mortality</Strong> that emphasizes deaths occurring <Strong>before a predetermined benchmark age</Strong> (e.g., 65 or 75 years).</p>,
      <p key="ypll-def-p2">It reflects both <Strong>how early</Strong> and <Strong>how many</Strong> deaths occur, giving more weight to deaths at younger ages.</p>,
      <div key="ypll-def-formula" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">
          <span>YPLL (for each death) = Benchmark age - Age at death (if age &lt; benchmark)</span>
      </div>,
      <p key="ypll-def-p3">Total YPLL is obtained by summing across all such deaths. A <Strong>YPLL rate</Strong> divides the total by the population and multiplies by a scaling factor (e.g., per 100,000).</p>,
      
      <h4 key="ypll-kc-h" className="text-xl font-semibold text-slate-100">Key Concepts</h4>,
      <ul key="ypll-kc-ul" className="list-disc list-inside space-y-3 pl-4">
        <li>YPLL accounts for <Strong>age at death</Strong>, not just <Strong>cause of death</Strong>.</li>
        <li><Strong>Early deaths contribute more</Strong> to total YPLL than deaths occurring later in life.</li>
        <li>Common benchmark ages: <Strong>65 years</Strong> (historical) or <Strong>75 years</Strong> (modern U.S. standard).</li>
        <li>Used to identify conditions causing <Strong>premature mortality</Strong>, such as injury, cancer, or heart disease in younger adults.</li>
      </ul>,

      <h3 key="ypll-calc-h" className="text-2xl font-bold text-slate-100">Step-by-Step Calculation</h3>,
      
      <h4 key="ypll-s1-h" className="text-xl font-semibold text-slate-100">Step 1 — Stratify deaths by age group</h4>,
      <p key="ypll-s1-p">Deaths are grouped into fixed <Strong>10-year age intervals</Strong>.</p>,
      <div key="ypll-s1-table-wrapper" className="overflow-x-auto"><table key="ypll-s1-table" className="w-full text-left border-collapse text-slate-300">
        <thead><tr className="bg-slate-800/70"><th className="p-3 border border-slate-700/50">Age Group</th><th className="p-3 border border-slate-700/50">0–10</th><th className="p-3 border border-slate-700/50">11–20</th><th className="p-3 border border-slate-700/50">21–30</th></tr></thead>
        <tbody><tr><td className="p-3 border border-slate-700/50 font-semibold">Number of deaths</td><td className="p-3 border border-slate-700/50">2</td><td className="p-3 border border-slate-700/50">9</td><td className="p-3 border border-slate-700/50">4</td></tr></tbody>
      </table></div>,
      
      <h4 key="ypll-s2-h" className="text-xl font-semibold text-slate-100">Step 2 — Determine years lost for each group</h4>,
      <p key="ypll-s2-p">Subtract the <Strong>midpoint</Strong> of each age interval from the <Strong>benchmark age (75 years)</Strong>.</p>,
      <div key="ypll-s2-table-wrapper" className="overflow-x-auto"><table key="ypll-s2-table" className="w-full text-left border-collapse text-slate-300">
        <thead><tr className="bg-slate-800/70"><th className="p-3 border border-slate-700/50">Age Group</th><th className="p-3 border border-slate-700/50">Midpoint</th><th className="p-3 border border-slate-700/50">Years Lost (75 – midpoint)</th></tr></thead>
        <tbody>
          <tr><td className="p-3 border border-slate-700/50">0–10</td><td className="p-3 border border-slate-700/50">5</td><td className="p-3 border border-slate-700/50">70</td></tr>
          <tr><td className="p-3 border border-slate-700/50">11–20</td><td className="p-3 border border-slate-700/50">15</td><td className="p-3 border border-slate-700/50">60</td></tr>
          <tr><td className="p-3 border border-slate-700/50">21–30</td><td className="p-3 border border-slate-700/50">25</td><td className="p-3 border border-slate-700/50">50</td></tr>
        </tbody>
      </table></div>,

      <h4 key="ypll-s3-h" className="text-xl font-semibold text-slate-100">Step 3 — Multiply by number of deaths</h4>,
      <p key="ypll-s3-p">Multiply <Strong>years lost</Strong> × <Strong>number of deaths</Strong> for each age interval.</p>,
      <div key="ypll-s3-table-wrapper" className="overflow-x-auto"><table key="ypll-s3-table" className="w-full text-left border-collapse text-slate-300">
        <thead><tr className="bg-slate-800/70"><th className="p-3 border border-slate-700/50">Age Group</th><th className="p-3 border border-slate-700/50">Deaths</th><th className="p-3 border border-slate-700/50">Years Lost</th><th className="p-3 border border-slate-700/50">Total Years Lost</th></tr></thead>
        <tbody>
          <tr><td className="p-3 border border-slate-700/50">0–10</td><td className="p-3 border border-slate-700/50">2</td><td className="p-3 border border-slate-700/50">70</td><td className="p-3 border border-slate-700/50">140</td></tr>
          <tr><td className="p-3 border border-slate-700/50">11–20</td><td className="p-3 border border-slate-700/50">9</td><td className="p-3 border border-slate-700/50">60</td><td className="p-3 border border-slate-700/50">540</td></tr>
          <tr><td className="p-3 border border-slate-700/50">21–30</td><td className="p-3 border border-slate-700/50">4</td><td className="p-3 border border-slate-700/50">50</td><td className="p-3 border border-slate-700/50">200</td></tr>
        </tbody>
      </table></div>,
      
      <h4 key="ypll-s4-h" className="text-xl font-semibold text-slate-100">Step 4 — Sum across all age intervals</h4>,
      <div key="ypll-s4-formula" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">Total YPLL = 140 + 540 + 200 = 840 years</div>,
      <p key="ypll-s4-interp" className="p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg"><Strong>✅ Interpretation:</Strong> The total <Strong>Years of Potential Life Lost (YPLL)</Strong> in this example is <Strong>840 years</Strong>. This represents the cumulative number of years that would have been lived had those who died prematurely survived to age 75.</p>,

      <h3 key="ypll-rate-h" className="text-2xl font-bold text-slate-100 mt-8">Converting Total YPLL to a YPLL Rate</h3>,
      <p key="ypll-rate-p1">To compare across populations, YPLL is often expressed as a <Strong>rate</Strong>:</p>,
      <div key="ypll-rate-formula1" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{YPLL Rate} = \frac{\text{Total YPLL}}{\text{Population under benchmark age}} \times k" />
        </MathBlock>
      </div>,
      <p key="ypll-rate-p2">where <em className="italic">k</em> is usually 100,000.</p>,

      <h4 key="ypll-rate-ex-h" className="text-xl font-semibold text-slate-100 mt-6">Example:</h4>,
      <ul key="ypll-rate-ex-ul" className="list-['–'] list-inside space-y-1 pl-4">
        <li>Total YPLL = 840 years</li>
        <li>Population under 75 years = 50,000</li>
        <li>Scaling factor (k) = 100,000</li>
      </ul>,
      <div key="ypll-rate-ex-calc" className="p-4 bg-slate-800/50 rounded-lg text-xl font-mono text-slate-300 space-y-3">
        <div className="flex items-center justify-center flex-wrap">
          <span>YPLL Rate = (840 / 50,000) × 100,000 = 1,680</span>
        </div>
      </div>,
      <p key="ypll-rate-ex-result" className="p-3 bg-teal-900/40 border-l-4 border-teal-500 rounded-r-lg"><Strong>✅ YPLL Rate = 1,680 years lost per 100,000 population under age 75</Strong></p>,
      <p key="ypll-rate-interp-h"><Strong>Interpretation:</Strong></p>,
      <p key="ypll-rate-interp-p">This means that, on average, 1,680 potential years of life are lost for every 100,000 people under age 75 in this population.</p>,

      <h3 key="ypll-ex-h" className="text-2xl font-bold text-slate-100">Example (Simplified Individual-Level)</h3>,
      <p key="ypll-ex-p1"><Strong>Benchmark age:</Strong> 75 years<br/><Strong>Deaths at ages:</Strong> 25, 40, 80</p>,
      <div key="ypll-ex-formula" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 flex-wrap">YPLL = (75 - 25) + (75 - 40) + 0 = 85 years</div>,
      <ul key="ypll-ex-ul" className="list-['–'] list-inside space-y-1 pl-4">
        <li>Death at 25 → 50 years lost</li>
        <li>Death at 40 → 35 years lost</li>
        <li>Death at 80 → none (since age &gt; benchmark)</li>
      </ul>,
      <p key="ypll-ex-total" className="font-semibold text-lg">✅ <Strong>Total YPLL = 85 years</Strong></p>,
      
      <InteractiveYPLLCalculator key="ypll-interactive-calc" />,

      <h3 key="ypll-interp-h" className="text-2xl font-bold text-slate-100">Interpretation</h3>,
      <ul key="ypll-interp-ul" className="list-disc list-inside space-y-3 pl-4">
        <li>YPLL gives <Strong>more weight to deaths at younger ages</Strong>, reflecting potential productive years lost.</li>
        <li>It highlights diseases and injuries with <Strong>premature mortality impact</Strong> (e.g., opioid overdose, trauma, suicide).</li>
        <li>Public health programs targeting <Strong>younger adult mortality</Strong> have the <Strong>largest effect</Strong> on reducing YPLL.</li>
      </ul>,
      
      <h3 key="ypll-takeaway-h" className="text-2xl font-bold text-slate-100">Key Takeaway</h3>,
      <blockquote key="ypll-takeaway-bq" className="p-4 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg text-lg italic space-y-2">
        <p><Strong>YPLL = Benchmark Age − Age at Death</Strong></p>
        <p>It captures <em className="font-semibold">premature mortality</em>, weighting younger deaths more heavily.</p>
        <p>Preventing deaths in early adulthood has the <Strong>largest YPLL reduction</Strong>, even if fewer total deaths occur.</p>
      </blockquote>,
      <div key="q6-container">
        <Question
            question="Which scenario reduces YPLL the most?"
            options={[
              "✅ Preventing deaths among young adults",
              "Preventing deaths among those above the benchmark age",
              "Keeping incidence the same but shortening duration",
              "Increasing average age at death from 80 to 82 when benchmark is 75",
            ]}
            correctFeedback="Precisely. YPLL weights deaths at younger ages more heavily, so preventing these has the biggest impact on the measure."
            incorrectFeedback="Recall that YPLL stands for Years of *Potential* Life Lost. Which deaths represent the most potential lost?"
            explanation={
                <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                    <p><Strong>Explanation:</Strong> YPLL only includes deaths <Strong>before</Strong> the benchmark age (e.g., &lt;75). Preventing <Strong>early deaths</Strong> yields the greatest reduction in YPLL, because each young death contributes many more years lost.</p>
                </div>
            }
        />
      </div>,
    ],
  },
  {
    id: 'life-expectancy',
    title: 'Life Expectancy & Lifetime Risk',
    content: [
      <h3 key="le-h1" className="text-2xl font-bold text-slate-100">Life Expectancy at Birth</h3>,
      <p key="le-p1"><Strong>Definition:</Strong></p>,
      <p key="le-p2">Life expectancy at birth is the <em className="italic">average number of years a newborn is expected to live</em> if current age-specific mortality rates remain constant.<br/>
      It is derived from a <Strong>life table</Strong>, which models survival for a hypothetical cohort (e.g., 100,000 newborns).</p>,
      <div key="le-formula" className="p-4 bg-slate-800/50 rounded-lg text-xl flex items-center justify-center font-mono text-slate-300 text-center">
        <span>Life Expectancy at Birth = Average age at death for that cohort</span>
      </div>,
      <p key="le-kp-h"><Strong>Key points:</Strong></p>,
      <ul key="le-kp-ul" className="list-disc list-inside space-y-3 pl-4">
        <li>Reflects <em className="italic">population mortality patterns</em>, not individual prediction.</li>
        <li>Increases with age as people survive earlier risks.</li>
        <li>Calculated from life-table or survival analysis methods.</li>
      </ul>,

      <h3 key="le-ex-h" className="text-2xl font-bold text-slate-100 mt-8">🔍 Example: Simplified Life Table (Corrected)</h3>,
      <div key="le-ex-table" className="overflow-x-auto">
        <table className="w-full border-collapse bg-slate-800/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-700/50">
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Age Group (years)</th>
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Death Rate (per 1,000)</th>
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Deaths (per 100,000 cohort)</th>
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Survivors (from 100,000)</th>
              <th className="p-3 text-left border border-slate-700/50 font-semibold text-slate-100">Average Remaining Life (years)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border border-slate-700/50">0–19</td><td className="p-3 border border-slate-700/50 font-mono">2</td><td className="p-3 border border-slate-700/50 font-mono">200</td><td className="p-3 border border-slate-700/50 font-mono">99,800</td><td className="p-3 border border-slate-700/50 font-mono">75</td></tr>
            <tr><td className="p-3 border border-slate-700/50">20–39</td><td className="p-3 border border-slate-700/50 font-mono">4</td><td className="p-3 border border-slate-700/50 font-mono">399</td><td className="p-3 border border-slate-700/50 font-mono">99,401</td><td className="p-3 border border-slate-700/50 font-mono">58</td></tr>
            <tr><td className="p-3 border border-slate-700/50">40–59</td><td className="p-3 border border-slate-700/50 font-mono">10</td><td className="p-3 border border-slate-700/50 font-mono">994</td><td className="p-3 border border-slate-700/50 font-mono">98,407</td><td className="p-3 border border-slate-700/50 font-mono">38</td></tr>
            <tr><td className="p-3 border border-slate-700/50">60–79</td><td className="p-3 border border-slate-700/50 font-mono">40</td><td className="p-3 border border-slate-700/50 font-mono">3,936</td><td className="p-3 border border-slate-700/50 font-mono">94,471</td><td className="p-3 border border-slate-700/50 font-mono">19</td></tr>
            <tr><td className="p-3 border border-slate-700/50">80+</td><td className="p-3 border border-slate-700/50 font-mono">200</td><td className="p-3 border border-slate-700/50 font-mono">18,894</td><td className="p-3 border border-slate-700/50 font-mono">75,577</td><td className="p-3 border border-slate-700/50 font-mono">6</td></tr>
          </tbody>
        </table>
      </div>,
      <p key="le-ex-result" className="p-3 bg-teal-900/40 border-l-4 border-teal-500 rounded-r-lg"><Strong>✅ Result:</Strong> Weighted average ≈ <Strong>78 years</Strong> → <em className="italic">Life Expectancy at Birth = 78 years.</em></p>,
      <p key="le-ex-interp"><Strong>Interpretation:</Strong></p>,
      <p key="le-ex-interp-p">On average, a newborn today would live to about 78 years if current mortality rates persist.<br/>
      Each age group's survivors are calculated by subtracting deaths (based on rate × survivors) from the previous row.</p>,
      <SurvivalCurveChart key="le-survival-chart" />,

      <h3 key="lr-h1" className="text-2xl font-bold text-slate-100 mt-8">Lifetime Risk of Disease</h3>,
      <p key="lr-p1"><Strong>Definition:</Strong></p>,
      <p key="lr-p2">The <em className="italic">probability</em> that an individual will develop a disease (or die from it) during their lifetime, assuming current rates persist and adjusting for competing causes of death.</p>,
      <div key="lr-formula" className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
        <MathBlock>
          <BlockMath math="\text{Lifetime Risk} = \int_0^A i(a) \times s(a) \, da" />
        </MathBlock>
      </div>,
      <p key="lr-where">where</p>,
      <ul key="lr-where-ul" className="list-['–'] list-inside space-y-1 pl-4 text-sm">
        <li><MathInline><InlineMath math="i(a)" /></MathInline> = age-specific incidence rate</li>
        <li><MathInline><InlineMath math="s(a)" /></MathInline> = probability of surviving to age <MathInline><InlineMath math="a" /></MathInline></li>
      </ul>,

      <h3 key="lr-ex-h" className="text-2xl font-bold text-slate-100 mt-8">Intuitive Example</h3>,
      <p key="lr-ex-p1">If a disease occurs at <Strong>1% per decade</Strong> from age 30 to 80 (5 decades) <Strong>and there is no competing mortality</Strong>:</p>,
      <div key="lr-ex-calc" className="p-4 bg-slate-800/50 rounded-lg text-xl font-mono text-slate-300 flex items-center justify-center">
        <span>Lifetime Risk ≈ 5%</span>
      </div>,
      <p key="lr-ex-p2">But if only 70% of people survive past 70 (due to other causes), the <Strong>adjusted lifetime risk ≈ 3.5%</Strong>.</p>,
      <div key="lr-takeaway" className="p-3 bg-amber-900/40 border-l-4 border-amber-500 rounded-r-lg">
        <p><Strong>🧠 Takeaway:</Strong> Ignoring competing mortality <Strong>overestimates</Strong> true lifetime risk.</p>
      </div>,

      <h3 key="caution-h" className="text-2xl font-bold text-slate-100 mt-8">"Be careful of cumulative lifetime risk estimates that don't give you the life expectancy on which they are based."</h3>,
      <p key="caution-p1">When you hear statements like</p>,
      <blockquote key="caution-quote" className="p-4 bg-yellow-900/50 border-l-4 border-yellow-500 rounded-r-lg text-yellow-300 italic">
        <p>"1 in 8 women will develop breast cancer,"</p>
      </blockquote>,
      <p key="caution-p2">this assumes survival into older age (e.g., 85 years).</p>,
      <p key="caution-p3">In reality, because not everyone lives that long, the <Strong>observed lifetime risk</Strong> is lower when adjusted by a life table.</p>,

      <h3 key="visual-h" className="text-2xl font-bold text-slate-100 mt-8">📊 Visual Aids</h3>,

      <CumulativeDiseaseRiskChart key="cumulative-risk-chart" />,

      <div key="visual-resource" className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg mt-6">
        <p className="text-sm text-slate-300"><Strong>📚 Interactive Resource:</Strong></p>
        <p className="mt-2"><a href="https://www.ssa.gov/oact/STATS/table4c6.html" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline">U.S. Social Security Period Life Table</a> — Explore real-world life expectancy data by age and sex.</p>
      </div>,

      <h3 key="summary-h" className="text-2xl font-bold text-slate-100 mt-8">Summary</h3>,
      <div key="summary-table-container" className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-300 bg-slate-800/30 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-slate-700/50">
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Concept</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Definition</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Derived From</th>
                    <th className="p-3 border border-slate-700/50 font-semibold text-slate-100 align-top">Key Takeaway</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Life Expectancy at Birth</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Average expected years of life given current mortality</td>
                    <td className="p-3 border border-slate-700/50 align-top">Life table</td>
                    <td className="p-3 border border-slate-700/50 align-top">Reflects population mortality, not individual prediction</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Lifetime Risk</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Probability of developing a disease by a given age</td>
                    <td className="p-3 border border-slate-700/50 align-top">Life table integrating incidence</td>
                    <td className="p-3 border border-slate-700/50 align-top">True probability, adjusted for competing risks</td>
                </tr>
                <tr>
                    <td className="p-3 border border-slate-700/50 align-top"><Strong>Life Table</Strong></td>
                    <td className="p-3 border border-slate-700/50 align-top">Statistical model of survival/death by age</td>
                    <td className="p-3 border border-slate-700/50 align-top">Age-specific mortality data</td>
                    <td className="p-3 border border-slate-700/50 align-top">Basis for life expectancy and lifetime risk</td>
                </tr>
            </tbody>
        </table>
      </div>,

      <h3 key="takeaway-h" className="text-2xl font-bold text-slate-100 mt-8">Key Takeaway</h3>,
      <blockquote key="takeaway-bq" className="p-4 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg text-lg space-y-3">
        <p>Life expectancy and lifetime risk are both <Strong>derived from life tables</Strong>.</p>
        <ul className="list-['–'] list-inside pl-4 space-y-2">
            <li>Life expectancy reflects <Strong>current mortality patterns</Strong>.</li>
            <li>Lifetime risk reflects <Strong>disease probability</Strong>, adjusted for <Strong>competing risks</Strong>.</li>
            <li>Ignoring competing mortality can <Strong>overstate</Strong> true lifetime risk.</li>
        </ul>
      </blockquote>,
      <div key="q7-container">
            <Question
                question="Which statement about life expectancy is most accurate?"
                options={[
                  "It predicts the actual lifespan of any individual.",
                  "✅ It summarizes current age-specific mortality into an average for a hypothetical cohort.",
                  "It equals median age at death.",
                  "It ignores mortality at older ages.",
                ]}
                correctFeedback="Exactly. Life expectancy is a statistical summary of a population's current mortality rates, not a personal prediction."
                incorrectFeedback="Life expectancy is a population-level summary based on current death rates, not an individual's destiny."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> Life expectancy is a <Strong>summary measure</Strong> — not a prediction — based on <Strong>age-specific mortality rates</Strong> applied to a <Strong>hypothetical population</Strong> (via a life table). It includes mortality at all ages, weighted by their contribution to overall death probability.</p>
                    </div>
                }
            />
        </div>,
    ]
  },
  {
    id: 'practice-mcqs',
    title: 'Practice MCQs — Epidemiologic Measures',
    content: [
        <div key="mcq1-container">
            <Question
                question="Cancer registries report 40 new cases of bladder cancer per 100,000 men per year. Which rate is this?"
                options={[
                    "Point prevalence",
                    "Period prevalence",
                    "✅ Incidence density",
                    "Cumulative incidence",
                    "Complication rate"
                ]}
                correctFeedback="Correct! 'Cases per person-time' (100,000 men for a year) is the definition of incidence density."
                incorrectFeedback="Review the definition. The key here is 'new cases' divided by 'person-time'."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> This is a measure of new cases (incidence) over person-time (100,000 men for a year), which is the definition of incidence density.</p>
                    </div>
                }
            />
        </div>,
        <div key="mcq2-container">
            <Question
                question="Sixty percent of adults have a serum cholesterol >200 mg/dL. Which rate is this?"
                options={[
                    "✅ Point prevalence",
                    "Complication rate",
                    "Incidence density",
                    "Cumulative incidence",
                ]}
                correctFeedback="Correct! This is a snapshot of an existing condition ('have') in a population at one time, which is point prevalence."
                incorrectFeedback="Think about whether this measures new events over time or existing cases at a single moment."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> This represents the proportion of a population with a condition at a single point in time, which is the definition of point prevalence.</p>
                    </div>
                }
            />
        </div>,
        <div key="mcq3-container">
            <Question
                question="Which item is not required to judge a prevalence study’s soundness?"
                options={[
                    "✅ Following participants long enough for an outcome like anemia to occur",
                    "Representative sample of the population",
                    "Appropriate population (e.g., all women for cervical infection)",
                    "Clear case definition",
                    "Defined source population",
                ]}
                correctFeedback="That's right. Prevalence studies are cross-sectional (a snapshot) and don't require follow-up. Follow-up is for incidence studies."
                incorrectFeedback="Prevalence studies measure what exists *now*. Which option describes something that happens *over time*?"
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> Prevalence studies are a "snapshot" and do not require follow-up time. Following participants over time is characteristic of an incidence or cohort study.</p>
                    </div>
                }
            />
        </div>,
         <div key="mcq4-container">
            <Question
                question="During an outbreak, 400 people are ill; 16 die. Population = 2,000,000. Which is correct?"
                options={[
                    "✅ CFR = 4%; cause-specific mortality ≈ 0.8 per 100,000.",
                    "CFR = 0.8%; mortality = 4 per 100,000.",
                    "CFR = 0.4%; mortality = 4 per 100,000.",
                    "CFR = 8%; mortality = 0.4 per 100,000.",
                ]}
                correctFeedback="Excellent calculation! CFR = 16/400 = 4%. Mortality = (16/2M) * 100k = 0.8."
                incorrectFeedback="Check your formulas. CFR = deaths/cases. Mortality = deaths/population."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> CFR = (Deaths among cases / Total cases) = 16 / 400 = 4%. Mortality = (Deaths in pop / Total pop) × 100,000 = (16 / 2,000,000) × 100,000 = 0.8 per 100,000.</p>
                    </div>
                }
            />
        </div>,
         <div key="mcq5-container">
            <Question
                question="RA incidence ≈ 40/100,000/year and prevalence ≈ 1/100. Estimated average duration?"
                options={[
                    "10 years",
                    "✅ 25 years",
                    "33 years",
                    "40 years",
                ]}
                correctFeedback="Perfect! Using P ≈ I × D, we get D ≈ P/I = (1/100) / (40/100,000) = 25 years."
                incorrectFeedback="Rearrange the formula P ≈ I × D to solve for Duration (D). Remember to align the units."
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> For rare diseases, P ≈ I × D. So, Duration ≈ Prevalence / Incidence. D ≈ (1/100) / (40/100,000) = 0.01 / 0.0004 = 25 years.</p>
                    </div>
                }
            />
        </div>,
        <div key="mcq6-container">
            <Question
                question="A study enrolls eligible patients over several months; earlier enrollees contribute more follow-up. The denominator uses person-time. This measure is:"
                options={[
                    "Cumulative incidence",
                    "✅ Incidence density",
                    "Complication rate",
                    "Period prevalence",
                ]}
                correctFeedback="Correct! Using person-time to account for variable follow-up is the key feature of incidence density."
                incorrectFeedback="The mention of 'person-time' is the major clue here. Which measure uses that in its denominator?"
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> The use of person-time in the denominator to account for variable follow-up times is the defining feature of incidence density.</p>
                    </div>
                }
            />
        </div>,
        <div key="mcq7-container">
            <Question
                question="Life expectancy at birth increases if:"
                options={[
                    "✅ Age-specific mortality rates decline across multiple age groups.",
                    "Median age of the population rises (with no other changes).",
                    "There are more older people due to past high fertility.",
                    "A single centenarian survives to 110.",
                ]}
                correctFeedback="Correct! Life expectancy is a direct reflection of age-specific mortality rates. If they improve, life expectancy increases."
                incorrectFeedback="Life expectancy is a summary of death rates across the whole population. What would cause that summary to improve?"
                explanation={
                    <div className="mt-4 p-3 bg-sky-900/40 border-l-4 border-sky-500 rounded-r-lg">
                        <p><Strong>Explanation:</Strong> Life expectancy is a summary measure calculated from current age-specific mortality rates. A broad decline in these rates is what causes life expectancy to increase.</p>
                    </div>
                }
            />
        </div>,
    ],
  },
  {
      id: 'references',
      title: 'References',
      content: [
          <ul key="ref-list" className="list-disc list-inside space-y-4 text-slate-400">
            <li>Fletcher, R. H., Fletcher, S. W., & Fletcher, G. S. (2014). <em className="italic">Clinical Epidemiology: The Essentials</em> (5th ed.). Lippincott Williams & Wilkins.</li>
            <li>Elmore, J. G., Wild, D. M. G., Nelson, H. D., & Katz, D. L. (2020). <em className="italic">Jekel’s Epidemiology, Biostatistics, Preventive Medicine, and Public Health</em> (5th ed.). Elsevier.</li>
            <li>American College of Preventive Medicine (ACPM). (2023). <em className="italic">Epidemiology Course: Board Review Slides.</em> American College of Preventive Medicine.</li>
          </ul>
      ]
  }
];

const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const sectionItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
    },
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fontSizes = ['text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
  const [fontSizeIndex, setFontSizeIndex] = useState(2); // default is 'text-xl' (middle option)

  const increaseFontSize = () => {
      setFontSizeIndex(prev => Math.min(prev + 1, fontSizes.length - 1));
  };

  const decreaseFontSize = () => {
      setFontSizeIndex(prev => Math.max(prev - 1, 0));
  };

  const canIncrease = fontSizeIndex < fontSizes.length - 1;
  const canDecrease = fontSizeIndex > 0;

  const allSections = [
    { id: 'overview', title: 'Overview' },
    ...contentSections
  ];

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -80% 0px',
    });

    const elements = allSections.map(s => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);

    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => {
        if(el) observer.unobserve(el)
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-black">
      <TableOfContents
        sections={allSections}
        activeSection={activeSection}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        canIncrease={canIncrease}
        canDecrease={canDecrease}
       />
      <MobileMenu
        sections={allSections}
        activeSection={activeSection}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        canIncrease={canIncrease}
        canDecrease={canDecrease}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="hamburger-btn 2xl:hidden fixed top-6 right-6 z-30 p-3 rounded-lg shadow-lg transition-all duration-300"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div className="2xl:pl-72">
        <div className="flex flex-col items-center w-full">
            <header id="overview" className="h-screen w-full flex flex-col items-center justify-center text-center relative scroll-mt-20 p-4 sm:p-8">
                <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-500">
                    Epidemiological Measures
                    </span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                    An interactive explainer on fundamental concepts in epidemiology
                </p>
                <div className="mt-8">
                    <p className="text-md md:text-lg font-medium text-slate-400">Bashar Hasan, MD</p>
                    <p className="text-sm md:text-base text-slate-500">Evidence-based Practice Center, Mayo Clinic</p>
                </div>
                </motion.div>
                <motion.div
                    className="absolute bottom-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <a href={`#${contentSections[0].id}`} className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition-colors">
                        <span className="text-sm">Scroll Down</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-bounce-slow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5" />
                        </svg>
                    </a>
                </motion.div>
            </header>

            <main className="w-full max-w-5xl lg:max-w-7xl space-y-16 p-4 sm:p-8">
                {contentSections.map((section, index) => (
                <React.Fragment key={section.id}>
                    <motion.section
                        id={section.id}
                        className="py-12 scroll-mt-20"
                        variants={sectionContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-120px" }}
                    >
                        <motion.h2 
                            variants={sectionItemVariants}
                            className="text-3xl md:text-4xl font-bold mb-6 text-slate-100 tracking-tight"
                        >
                            {section.title}
                        </motion.h2>
                        <motion.div 
                            variants={sectionItemVariants}
                            className={`space-y-8 ${fontSizes[fontSizeIndex]} text-slate-300 leading-relaxed`}
                        >
                            {section.content}
                        </motion.div>
                    </motion.section>
                    {index < contentSections.length - 1 &&
                    <motion.hr
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="border-t-2 border-slate-700/50"
                    />}
                </React.Fragment>
                ))}
            </main>

            <footer className="w-full max-w-5xl lg:max-w-7xl text-center py-16 mt-16 text-slate-500">
                <p>End of Presentation</p>
            </footer>
        </div>
      </div>
    </div>
  );
}
