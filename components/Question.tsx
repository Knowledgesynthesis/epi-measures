import React, { useState, useMemo } from 'react';

interface QuestionProps {
  question: string;
  options: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  explanation?: React.ReactNode;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);

const SquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
    </svg>
);

export const Question: React.FC<QuestionProps> = ({ question, options, correctFeedback, incorrectFeedback, explanation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const correctAnswerIndex = useMemo(() => options.findIndex(opt => opt.startsWith('✅')), [options]);

  const handleSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const isCorrect = selectedAnswer === correctAnswerIndex;

  const getOptionStyle = (index: number) => {
    if (selectedAnswer === null) {
      return 'bg-slate-800 hover:bg-slate-700/70 border-slate-700 hover:border-slate-500 cursor-pointer';
    }

    // Only highlight the selected answer
    if (index === selectedAnswer) {
      if (isCorrect) {
        return 'bg-green-500/20 border-green-500 text-green-300 cursor-pointer';
      } else {
        return 'bg-red-500/20 border-red-500 text-red-300 cursor-pointer';
      }
    }

    return 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-pointer';
  };

  const getIcon = (index: number) => {
      if(selectedAnswer === null) return <SquareIcon />;
      if (index === selectedAnswer) {
        return isCorrect ? <CheckIcon /> : <XIcon />;
      }
      return <SquareIcon />;
  }

  return (
    <div className="w-full p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg">
      <h4 className="text-xl font-semibold mb-4 text-slate-100">{question}</h4>
      <div className="space-y-3">
        {options.map((option, index) => {
          const cleanOption = option.replace('✅ ', '');
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full flex items-center text-left p-4 rounded-md border transition-all duration-200 ${getOptionStyle(index)}`}
            >
              <span className="mr-4 flex-shrink-0">{getIcon(index)}</span>
              <span>{cleanOption}</span>
            </button>
          );
        })}
      </div>
      {selectedAnswer !== null && (
        <div className="mt-4 p-3 text-center rounded-lg bg-slate-900/50">
          {selectedAnswer === correctAnswerIndex ? (
            <p className="text-green-400">{correctFeedback}</p>
          ) : (
            <p className="text-red-400">{incorrectFeedback}</p>
          )}
        </div>
      )}
      {selectedAnswer === correctAnswerIndex && explanation}
    </div>
  );
};
