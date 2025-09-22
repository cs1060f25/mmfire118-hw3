import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, QrCode, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getStoredHolds, arriveAndVerify, extendHold, mockSeatClusters, releaseSeat, flagSeat, rankSeats, getStoredFilters, cancelHold } from '../data/mock';
import { useApp } from '../contexts/AppContext';
import { Countdown } from '../components/Countdown';
import { SeatCard } from '../components/SeatCard';

export function Arrival() {
  const navigate = useNavigate();
  const { holdId } = useParams<{ holdId: string }>();
  const { updateHolds, updateSessions, showToast } = useApp();
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const holds = getStoredHolds();
  const hold = holds.find(h => h.id === holdId);
  
  if (!hold) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hold not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const seat = mockSeatClusters.find(s => s.id === hold.seatId);
  const isExpired = hold.state === 'expired' || Date.now() > hold.expiresAt;
  const canExtend = !hold.extended && hold.state === 'active' && !isExpired;

  const handleScanQR = () => {
    setIsScanning(true);
    
    // Simulate QR scan delay
    setTimeout(() => {
      setIsScanning(false);
      const session = arriveAndVerify(hold.id);
      
      if (session) {
        updateHolds();
        updateSessions();
        showToast('Seat claimed successfully! Enjoy your study session.', 'success');
        navigate(`/session/${session.id}`);
      } else {
        showToast('Failed to claim seat. Please try again.', 'error');
      }
    }, 1500);
  };

  const handleExtendHold = () => {
    const extendedHold = extendHold(hold.id);
    if (extendedHold) {
      updateHolds();
      showToast('Hold extended by 3 minutes', 'success');
    } else {
      showToast('Extension not available', 'error');
    }
  };

  const handleConflictResolution = (action: 'released' | 'occupied') => {
    if (action === 'released') {
      releaseSeat(hold.seatId);
      showToast('Seat released. You can now claim it!', 'success');
      setShowConflictModal(false);
    } else {
      // Cancel the current hold so user can choose a new seat
      cancelHold(hold.id);
      flagSeat(hold.seatId);
      updateHolds();
      showToast('Seat flagged. Choose another seat.', 'info');
      setShowConflictModal(false);
      navigate('/find');
    }
  };

  if (!seat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seat details not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Arrival</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hold Status */}
        <div className={`rounded-lg border p-4 mb-6 ${
          isExpired 
            ? 'bg-red-50 border-red-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className={`w-5 h-5 mr-3 ${isExpired ? 'text-red-600' : 'text-orange-600'}`} />
              <div>
                <h3 className={`font-medium ${isExpired ? 'text-red-900' : 'text-orange-900'}`}>
                  {isExpired ? 'Hold Expired' : 'Hold Active'}
                </h3>
                <p className={`text-sm ${isExpired ? 'text-red-700' : 'text-orange-700'}`}>
                  {seat.name} • {seat.building}
                </p>
              </div>
            </div>
            
            {!isExpired && (
              <Countdown
                targetTime={hold.expiresAt}
                onExpiry={() => {
                  updateHolds();
                  showToast('Hold has expired', 'error');
                }}
                className={`${isExpired ? 'text-red-600' : 'text-orange-600'}`}
              />
            )}
          </div>
        </div>

        {isExpired ? (
          /* Expired State */
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hold Expired</h2>
            <p className="text-gray-600 mb-6">
              Your 10-minute hold has expired. Here are some nearby alternatives:
            </p>
            
            <div className="space-y-3 mb-6">
              {rankSeats(getStoredFilters()).slice(0, 2).map(altSeat => (
                <SeatCard 
                  key={altSeat.id}
                  seat={altSeat} 
                  onClick={() => navigate(`/seat/${altSeat.id}`)}
                />
              ))}
            </div>
            
            <button
              onClick={() => navigate('/find')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Find Another Seat
            </button>
          </div>
        ) : (
          /* Active Hold State */
          <>
            {/* Extend Hold */}
            {canExtend && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Need more time?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  You can extend your hold by 3 minutes (once per hold)
                </p>
                <button
                  onClick={handleExtendHold}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Extend Hold by 3 Minutes
                </button>
              </div>
            )}

            {/* QR Scan */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-gray-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h3>
                <p className="text-gray-600 mb-6">
                  Scan the QR code on your seat to verify arrival and start your study session
                </p>
                
                <button
                  onClick={handleScanQR}
                  disabled={isScanning}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    isScanning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Scanning...
                    </div>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 inline mr-2" />
                      Scan QR Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conflict Resolution */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Seat occupied?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If someone is already sitting in your reserved seat
              </p>
              <button
                onClick={() => setShowConflictModal(true)}
                className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Resolve Conflict
              </button>
            </div>
          </>
        )}
      </div>

      {/* Conflict Resolution Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolve Seat Conflict</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>NookScout Policy:</strong> You have a valid 10-minute hold on this seat. 
                Politely inform the occupant that the seat is reserved and show them this screen.
              </p>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              What happened when you spoke with the person at your seat?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleConflictResolution('released')}
                className="w-full flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                They understood and left
              </button>
              
              <button
                onClick={() => handleConflictResolution('occupied')}
                className="w-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-800 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Still occupied - show me alternatives
              </button>
            </div>
            
            <button
              onClick={() => setShowConflictModal(false)}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}