
import React from 'react';

interface FractionProps {
  numerator: string;
  denominator: string;
}

export const Fraction: React.FC<FractionProps> = ({ numerator, denominator }) => (
  <div className="inline-flex flex-col items-center justify-center mx-2 leading-tight">
    <span className="text-lg px-2 pt-1">{numerator}</span>
    <span className="border-t border-slate-400 w-full my-1"></span>
    <span className="text-lg px-2 pb-1">{denominator}</span>
  </div>
);
