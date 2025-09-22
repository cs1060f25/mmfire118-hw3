import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Zap, Users, AlertCircle } from 'lucide-react';
import { mockSeatClusters, startHold } from '../data/mock';
import { useApp } from '../contexts/AppContext';
import { ConfidenceBar } from '../components/ConfidenceBar';

export function SeatDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { activeHold, activeSession, updateHolds, showToast } = useApp();

  const seat = mockSeatClusters.find(s => s.id === id);

  if (!seat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seat not found</h2>
          <button
            onClick={() => navigate('/find')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to search
          </button>
        </div>
      </div>
    );
  }

  const handleStartHold = () => {
    if (activeHold || activeSession) {
      showToast('You already have an active hold or session', 'error');
      return;
    }

    try {
      const hold = startHold(seat.id);
      updateHolds();
      showToast('Hold started! Head to your seat now.', 'success');
      navigate(`/arrival/${hold.id}`);
    } catch (error) {
      showToast('Failed to start hold. Please try again.', 'error');
    }
  };

  const isUnavailable = activeHold || activeSession || seat.currentlyHeld || seat.currentlyOccupied;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/find')}
              className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Seat Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Seat Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{seat.name}</h2>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{seat.building} • {seat.level}</span>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">{seat.etaMins} min walk</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Likely Free</span>
            </div>
            <ConfidenceBar confidence={seat.confidence} />
            <p className="text-xs text-gray-600 mt-1">
              Based on historical usage patterns and current conditions
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              {seat.hasPower ? (
                <div className="flex items-center text-green-600">
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Power available</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <Zap className="w-5 h-5 mr-2" />
                  <span>No power outlet</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {seat.walkHoldEligible ? (
                <div className="flex items-center text-blue-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Hold eligible</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>No hold option</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Warnings */}
          {isUnavailable && (
            <div className="mb-6">
              {(activeHold || activeSession) && (
                <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800">
                      You have an active {activeHold ? 'hold' : 'session'}
                    </p>
                    <p className="text-orange-700">
                      Complete your current booking before starting a new one.
                    </p>
                  </div>
                </div>
              )}
              
              {(seat.currentlyHeld || seat.currentlyOccupied) && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">
                      This seat is currently {seat.currentlyHeld ? 'on hold' : 'occupied'}
                    </p>
                    <p className="text-red-700">
                      Try another seat or check back in a few minutes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleStartHold}
            disabled={!seat.walkHoldEligible || isUnavailable}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
              seat.walkHoldEligible && !isUnavailable
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!seat.walkHoldEligible 
              ? 'Hold not available for this seat'
              : isUnavailable
              ? 'Unavailable'
              : 'Start 10-minute Walk Hold'
            }
          </button>
        </div>

        {/* Hold Info */}
        {seat.walkHoldEligible && !isUnavailable && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h3 className="font-medium text-blue-900 mb-2">How Walk Hold works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reserve this seat for 10 minutes while you walk over</li>
              <li>• Get one 3-minute extension if needed during your walk</li>
              <li>• Scan the QR code when you arrive to claim the seat</li>
              <li>• Hold expires automatically if not claimed in time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}