import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Home() {
  const navigate = useNavigate();
  const { activeHold, activeSession } = useApp();

  const handleFindSeat = () => {
    navigate('/find');
  };

  const handleFindRoom = () => {
    navigate('/room');
  };

  const handleActiveHold = () => {
    if (activeHold) {
      navigate(`/arrival/${activeHold.id}`);
    }
  };

  const handleActiveSession = () => {
    if (activeSession) {
      navigate(`/session/${activeSession.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NookScout</h1>
              <p className="text-gray-600 text-sm">Find your perfect study space</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Active Status */}
        {(activeHold || activeSession) && (
          <div className="mb-6">
            {activeHold && (
              <div 
                onClick={handleActiveHold}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-orange-900">Active Hold</h3>
                      <p className="text-sm text-orange-700">Tap to view arrival details</p>
                    </div>
                  </div>
                  <div className="text-orange-600 font-mono text-sm">
                    {Math.max(0, Math.floor((activeHold.expiresAt - Date.now()) / 60000))}m left
                  </div>
                </div>
              </div>
            )}
            
            {activeSession && (
              <div 
                onClick={handleActiveSession}
                className="bg-green-50 border border-green-200 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-green-900">Study Session Active</h3>
                      <p className="text-sm text-green-700">Tap to manage your session</p>
                    </div>
                  </div>
                  <div className="text-green-600 font-mono text-sm">
                    {Math.max(0, Math.floor((activeSession.endsAt - Date.now()) / 60000))}m left
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          <button
            onClick={handleFindSeat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Find a seat now</h2>
                <p className="text-blue-100">Discover quiet study spaces across campus</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-200" />
            </div>
          </button>

          <button
            onClick={handleFindRoom}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl p-6 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Find a group room</h2>
                <p className="text-teal-100">Book collaborative spaces for team work</p>
              </div>
              <Users className="w-8 h-8 text-teal-200" />
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">73%</div>
                <div className="text-sm text-gray-600">Available now</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">How it works</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Find your spot</p>
                <p className="text-xs text-gray-600">Browse available seats with confidence ratings</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Hold while walking</p>
                <p className="text-xs text-gray-600">Reserve your seat for 10 minutes while you travel</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Scan QR to claim</p>
                <p className="text-xs text-gray-600">Verify your arrival and start your study session</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}