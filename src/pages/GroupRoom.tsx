import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Clock, PenTool } from 'lucide-react';
import { mockGroupRooms } from '../data/mock';
import { useApp } from '../contexts/AppContext';

interface GroupRoomFilters {
  capacity: number;
  whiteboard: boolean;
}

export function GroupRoom() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [filters, setFilters] = useState<GroupRoomFilters>({
    capacity: 4,
    whiteboard: true
  });

  const filteredRooms = mockGroupRooms.filter(room => {
    return room.capacity >= filters.capacity && (!filters.whiteboard || room.hasWhiteboard);
  });

  const handleBookRoom = (roomId: string) => {
    showToast('Group room booking not implemented yet', 'info');
  };

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
            <h1 className="text-lg font-semibold text-gray-900">Find a Group Room</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Room Requirements</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Size: {filters.capacity} people
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 people</span>
                <span>8 people</span>
              </div>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.whiteboard}
                onChange={(e) => setFilters({ ...filters, whiteboard: e.target.checked })}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-gray-700">Whiteboard required</span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {filteredRooms.length} available rooms
          </p>
        </div>

        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{room.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {room.building} • {room.level}
                  </div>
                </div>
                
                <div className="flex items-center bg-teal-50 text-teal-700 px-2 py-1 rounded text-sm font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {room.etaMins} min
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-blue-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">Up to {room.capacity} people</span>
                </div>
                
                {room.hasWhiteboard && (
                  <div className="flex items-center text-green-600">
                    <PenTool className="w-4 h-4 mr-1" />
                    <span className="text-sm">Whiteboard</span>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-lg mb-4 ${
                room.available 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  room.available ? 'text-green-800' : 'text-red-800'
                }`}>
                  {room.available ? 'Available now' : 'Currently in use'}
                </p>
                {room.available && (
                  <p className="text-xs text-green-700 mt-1">
                    15-minute arrival grace period • Door QR required
                  </p>
                )}
              </div>

              <button
                onClick={() => handleBookRoom(room.id)}
                disabled={!room.available}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  room.available
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {room.available ? 'Reserve Room' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms match your criteria</h3>
            <p className="text-gray-600 mb-4">Try adjusting your group size or requirements</p>
          </div>
        )}
      </div>
    </div>
  );
}