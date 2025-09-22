import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, List, Map, Settings } from 'lucide-react';
import { SeatCluster, Filters } from '../types';
import { rankSeats, getStoredFilters, saveFilters } from '../data/mock';
import { SeatCard } from '../components/SeatCard';
import { SimpleMap } from '../components/SimpleMap';

export function Find() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(getStoredFilters());
  const [seats, setSeats] = useState<SeatCluster[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  useEffect(() => {
    const rankedSeats = rankSeats(filters);
    setSeats(rankedSeats);
  }, [filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Persist immediately for consistency
    const next = { ...filters, ...newFilters };
    saveFilters(next);
  };

  const handleSeatClick = (seatId: string) => {
    navigate(`/seat/${seatId}`);
  };

  const handleMapSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    // Auto-scroll to the seat in the list if in map view
    const element = document.getElementById(`seat-${seatId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Find a Seat</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`p-1.5 rounded ${view === 'map' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.quiet}
                    onChange={(e) => handleFilterChange({ ...filters, quiet: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Quiet spaces</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.power}
                    onChange={(e) => handleFilterChange({ ...filters, power: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Power outlets</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max walk time: {filters.maxWalkMins} minutes
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={filters.maxWalkMins}
                  onChange={(e) => handleFilterChange({ ...filters, maxWalkMins: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.walkHoldOnly}
                  onChange={(e) => handleFilterChange({ ...filters, walkHoldOnly: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Walk-hold eligible only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {seats.length} available seats • Showing best matches first
          </p>
        </div>

        {/* Results */}
        {seats.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mb-4">
              <Settings className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No seats match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your preferences to see more options</p>
            <button
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Adjust Filters
            </button>
          </div>
        ) : (
          <>
            {view === 'map' && (
              <div className="mb-6">
                <SimpleMap
                  seats={seats}
                  selectedSeat={selectedSeat}
                  onSeatClick={handleMapSeatClick}
                  className="h-64"
                />
              </div>
            )}

            <div className="space-y-3">
              {seats.map((seat) => (
                <div key={seat.id} id={`seat-${seat.id}`}>
                  <SeatCard 
                    seat={seat} 
                    onClick={() => handleSeatClick(seat.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}