import React from 'react';
import { MapPin, Zap, Clock, Users } from 'lucide-react';
import { SeatCluster } from '../types';
import { ConfidenceBar } from './ConfidenceBar';

interface SeatCardProps {
  seat: SeatCluster;
  onClick: () => void;
  showDistance?: boolean;
}

export function SeatCard({ seat, onClick, showDistance = true }: SeatCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{seat.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {seat.building} • {seat.level}
          </div>
        </div>
        {showDistance && (
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
            <Clock className="w-3 h-3 mr-1" />
            {seat.etaMins} min
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Likely Free</span>
          </div>
          <ConfidenceBar confidence={seat.confidence} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {seat.hasPower && (
              <div className="flex items-center text-green-600">
                <Zap className="w-4 h-4 mr-1" />
                <span className="text-xs">Power</span>
              </div>
            )}
            {seat.walkHoldEligible && (
              <div className="flex items-center text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Hold OK</span>
              </div>
            )}
          </div>
          
          {seat.currentlyHeld && (
            <span className="text-xs text-orange-600 font-medium">On Hold</span>
          )}
          {seat.currentlyOccupied && (
            <span className="text-xs text-red-600 font-medium">Occupied</span>
          )}
        </div>
      </div>
    </div>
  );
}