import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetTime: number;
  onExpiry?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function Countdown({ targetTime, onExpiry, className = '', showIcon = true }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, targetTime - now);
      setTimeLeft(remaining);
      
      if (remaining === 0 && onExpiry) {
        onExpiry();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [targetTime, onExpiry]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 120000; // Less than 2 minutes

  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && (
        <Clock 
          className={`w-4 h-4 mr-2 ${isUrgent ? 'text-red-500' : 'text-gray-600'}`} 
        />
      )}
      <span 
        className={`font-mono text-sm font-medium ${
          isUrgent ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}