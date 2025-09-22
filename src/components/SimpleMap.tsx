import React from 'react';
import { SeatCluster } from '../types';

interface SimpleMapProps {
  seats: SeatCluster[];
  selectedSeat?: string;
  onSeatClick: (seatId: string) => void;
  className?: string;
}

export function SimpleMap({ seats, selectedSeat, onSeatClick, className = '' }: SimpleMapProps) {
  const getConfidenceColor = (confidence: string, isSelected: boolean) => {
    if (isSelected) return '#3B82F6';
    
    switch (confidence) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg border ${className}`}>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-3">Campus Map</h3>
        
        <svg viewBox="0 0 400 250" className="w-full h-48 bg-white rounded border">
          {/* Background buildings */}
          <rect x="50" y="50" width="120" height="80" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" rx="4" />
          <text x="110" y="95" textAnchor="middle" className="fill-gray-600 text-xs">Main Library</text>
          
          <rect x="200" y="70" width="100" height="60" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" rx="4" />
          <text x="250" y="105" textAnchor="middle" className="fill-gray-600 text-xs">STEM</text>
          
          <rect x="320" y="120" width="60" height="80" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" rx="4" />
          <text x="350" y="165" textAnchor="middle" className="fill-gray-600 text-xs">Eng</text>
          
          <rect x="60" y="160" width="80" height="60" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" rx="4" />
          <text x="100" y="195" textAnchor="middle" className="fill-gray-600 text-xs">Union</text>

          {/* Seat clusters */}
          {seats.map((seat) => (
            <g key={seat.id}>
              <circle
                cx={seat.coords.x}
                cy={seat.coords.y}
                r={selectedSeat === seat.id ? 8 : 6}
                fill={getConfidenceColor(seat.confidence, selectedSeat === seat.id)}
                stroke={selectedSeat === seat.id ? '#1D4ED8' : 'white'}
                strokeWidth={selectedSeat === seat.id ? 2 : 1}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSeatClick(seat.id)}
              />
              {seat.hasPower && (
                <circle
                  cx={seat.coords.x + 6}
                  cy={seat.coords.y - 6}
                  r={3}
                  fill="#10B981"
                  className="pointer-events-none"
                />
              )}
            </g>
          ))}
        </svg>
        
        <div className="flex items-center justify-center space-x-6 mt-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            High Confidence
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
            Medium
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            Low
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <div className="w-2 h-2 rounded-full bg-green-500 -ml-1" />
            Power
          </div>
        </div>
      </div>
    </div>
  );
}