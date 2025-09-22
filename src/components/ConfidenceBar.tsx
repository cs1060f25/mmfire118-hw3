import React from 'react';

interface ConfidenceBarProps {
  confidence: 'Low' | 'Medium' | 'High';
  className?: string;
}

export function ConfidenceBar({ confidence, className = '' }: ConfidenceBarProps) {
  const confidenceData = {
    Low: { width: '33%', color: 'bg-red-400', textColor: 'text-red-700' },
    Medium: { width: '66%', color: 'bg-yellow-400', textColor: 'text-yellow-700' },
    High: { width: '100%', color: 'bg-green-400', textColor: 'text-green-700' }
  };

  const data = confidenceData[confidence];

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
        <div 
          className={`h-2 rounded-full ${data.color}`}
          style={{ width: data.width }}
        />
      </div>
      <span className={`text-xs font-medium ${data.textColor}`}>
        {confidence}
      </span>
    </div>
  );
}