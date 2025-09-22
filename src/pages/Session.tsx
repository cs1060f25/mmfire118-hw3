import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Zap, Plus, LogOut, Clock, AlertCircle } from 'lucide-react';
import { getStoredSessions, extendSession, endSession, mockSeatClusters, rankSeats, getStoredFilters } from '../data/mock';
import { useApp } from '../contexts/AppContext';
import { Countdown } from '../components/Countdown';
import { SeatCard } from '../components/SeatCard';

export function Session() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { updateSessions, showToast } = useApp();
  const [showPowerHint, setShowPowerHint] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ accurate: '', reason: '' });
  
  const sessions = getStoredSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session not found</h2>
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

  const seat = mockSeatClusters.find(s => s.id === session.seatId);
  const timeLeft = session.endsAt - Date.now();
  const isNearEnd = timeLeft < 600000; // Less than 10 minutes
  const canExtend = !session.extended && session.status === 'active';

  const handleExtendSession = () => {
    // Simulate high demand check (random for demo)
    const isHighDemand = Math.random() < 0.3;
    
    if (isHighDemand) {
      showToast('High demand detected. Here are nearby alternatives:', 'info');
      // In a real app, this would show alternatives
      setTimeout(() => {
        const alternatives = rankSeats(getStoredFilters()).slice(0, 2);
        if (alternatives.length > 0) {
          showToast(`Found ${alternatives.length} available alternatives`, 'info');
        }
      }, 1500);
      return;
    }

    const extendedSession = extendSession(session.id);
    if (extendedSession) {
      updateSessions();
      showToast('Session extended by 15 minutes', 'success');
    } else {
      showToast('Extension not available', 'error');
    }
  };

  const handleCheckOut = () => {
    endSession(session.id);
    updateSessions();
    showToast('Checked out. Thanks for studying with NookScout!', 'success');
    navigate('/');
  };

  const handleFeedbackSubmit = () => {
    // In a real app, this would save feedback
    console.log('Feedback submitted:', feedbackData);
    setShowFeedbackModal(false);
    showToast('Thank you for your feedback!', 'success');
    navigate('/');
  };

  const handleSessionEnd = () => {
    // Auto-end with 3-minute grace
    setTimeout(() => {
      endSession(session.id);
      updateSessions();
      setShowFeedbackModal(true);
    }, 3000); // Simulate grace period
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
            <h1 className="text-lg font-semibold text-gray-900">Study Session</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Session Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-green-900">Active Session</h3>
                <p className="text-sm text-green-700">{seat.name} • {seat.building}</p>
              </div>
            </div>
            
            <Countdown
              targetTime={session.endsAt}
              onExpiry={handleSessionEnd}
              className="text-green-600"
            />
          </div>
        </div>

        {/* Grace Period Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Session Policy</h3>
          <p className="text-sm text-blue-800">
            You have a 3-minute grace period after your session ends to gather your belongings. 
            Please be respectful of other students waiting for this seat.
          </p>
        </div>

        {/* Extension */}
        {isNearEnd && canExtend && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900 mb-2">Session ending soon</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Your session ends in less than 10 minutes. Would you like to extend it?
                </p>
                <button
                  onClick={handleExtendSession}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add 15 minutes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Helper Tools */}
        <div className="grid gap-4 mb-6">
          {seat.hasPower && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Power Available</h3>
                    <p className="text-sm text-gray-600">Need help finding the outlet?</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPowerHint(!showPowerHint)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  {showPowerHint ? 'Hide' : 'Show'} Hint
                </button>
              </div>
              
              {showPowerHint && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 The power outlet is typically located under the desk or along the wall. 
                    Look for a small panel or extension cord near your seating area.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check Out */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-2">Ready to leave?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Check out now to free up the seat for other students
          </p>
          <button
            onClick={handleCheckOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5 inline mr-2" />
            Check Out Now
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Was the availability prediction accurate?
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFeedbackData({ ...feedbackData, accurate: 'yes' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      feedbackData.accurate === 'yes'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFeedbackData({ ...feedbackData, accurate: 'no' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      feedbackData.accurate === 'no'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {feedbackData.accurate === 'no' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    What was wrong? (optional)
                  </p>
                  <select
                    value={feedbackData.reason}
                    onChange={(e) => setFeedbackData({ ...feedbackData, reason: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select a reason</option>
                    <option value="someone-sitting">Someone was already sitting there</option>
                    <option value="qr-missing">QR code was missing/broken</option>
                    <option value="other">Other issue</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}