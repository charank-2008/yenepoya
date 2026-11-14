import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { TravelTicket, TransportType } from '../types';
import { 
  Plane, 
  Train, 
  Bus, 
  Search, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Luggage,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeftRight,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface TicketSearchProps {
  onSelectTicketToBook: (ticket: TravelTicket) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
}

export const TicketSearch: React.FC<TicketSearchProps> = ({
  onSelectTicketToBook,
  defaultOrigin = '',
  defaultDestination = ''
}) => {
  const { searchTickets } = useTrips();

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [transportType, setTransportType] = useState<string>('all');
  const [origin, setOrigin] = useState(defaultOrigin || 'New York');
  const [destination, setDestination] = useState(defaultDestination || 'Paris');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });

  // Filters
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

  const handleSwapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Search results
  const rawResults = searchTickets(transportType, origin, destination);

  const filteredResults = rawResults.filter((item) => {
    const matchesNonStop = nonStopOnly ? item.stops === 0 : true;
    const matchesPrice = item.price <= maxPrice;
    return matchesNonStop && matchesPrice;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return a.duration.localeCompare(b.duration);
  });

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-500" />;
      case 'train':
        return <Train className="w-5 h-5 text-emerald-500" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-500" />;
      default:
        return <Plane className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Multi-Modal Ticket Booking Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Find & Book Travel Tickets
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Search scheduled flights, high-speed rail, and express buses. Reserve your seat and generate an instant boarding pass.
          </p>
        </div>

        {/* Search Panel Box */}
        <div className="mt-6 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-800 space-y-4">
          {/* Top Row: Transport mode + Trip type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            {/* Transport Mode Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setTransportType('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  transportType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setTransportType('flight')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  transportType === 'flight' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flights</span>
              </button>
              <button
                onClick={() => setTransportType('train')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  transportType === 'train' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Trains</span>
              </button>
              <button
                onClick={() => setTransportType('bus')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  transportType === 'bus' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Buses</span>
              </button>
            </div>

            {/* Oneway / Roundtrip Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
              <button
                onClick={() => setTripType('oneway')}
                className={`px-3 py-1 rounded-lg transition-all ${tripType === 'oneway' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600'}`}
              >
                One-Way
              </button>
              <button
                onClick={() => setTripType('roundtrip')}
                className={`px-3 py-1 rounded-lg transition-all ${tripType === 'roundtrip' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600'}`}
              >
                Round-Trip
              </button>
            </div>
          </div>

          {/* Form inputs with Swap Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Origin */}
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                From (City / Airport)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. New York (JFK)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center -my-2 sm:my-0">
              <button
                type="button"
                onClick={handleSwapCities}
                title="Swap Origin and Destination"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 flex items-center justify-center transition-all shadow-sm active:rotate-180 duration-200"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination */}
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                To (City / Station)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Paris (CDG)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className={tripType === 'roundtrip' ? 'sm:col-span-2' : 'sm:col-span-5'}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Return Date if roundtrip */}
            {tripType === 'roundtrip' && (
              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    min={departureDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Chips & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNonStopOnly(!nonStopOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              nonStopOnly ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {nonStopOnly && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Direct Routes Only</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Max Price: ${maxPrice}</span>
            <input
              type="range"
              min="30"
              max="1000"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'duration')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="price">Lowest Price ($)</option>
            <option value="duration">Fastest Travel Time</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {sortedResults.length > 0 ? (
          sortedResults.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              {/* Carrier & Mode */}
              <div className="flex items-start sm:items-center gap-4 min-w-[210px]">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {getTransportIcon(ticket.type)}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{ticket.provider}</h4>
                  <p className="text-xs text-slate-500 capitalize font-medium">
                    {ticket.type} • {ticket.stops === 0 ? 'Non-stop' : `${ticket.stops} stop`}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Luggage className="w-3 h-3" /> Included
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> Free Wi-Fi
                    </span>
                  </div>
                </div>
              </div>

              {/* Timing & Route */}
              <div className="flex-1 flex items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-lg font-black text-slate-900">{ticket.departureTime}</p>
                  <p className="text-xs font-semibold text-slate-600">{ticket.origin}</p>
                  <span className="text-[10px] text-slate-400">{ticket.departureDate}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-blue-600">{ticket.duration}</span>
                  <div className="w-24 sm:w-36 h-0.5 bg-slate-200 relative my-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600 absolute -top-[3px] right-0"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ticket.stops === 0 ? 'Direct Route' : '1 Transfer'}
                  </span>
                </div>

                <div>
                  <p className="text-lg font-black text-slate-900">{ticket.arrivalTime}</p>
                  <p className="text-xs font-semibold text-slate-600">{ticket.destination}</p>
                  <span className="text-[10px] text-slate-400">{ticket.arrivalDate}</span>
                </div>
              </div>

              {/* Price & Book CTA */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2 shrink-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Per Traveler</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">${ticket.price}</p>
                </div>

                <button
                  onClick={() => onSelectTicketToBook(ticket)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>Select Seat & Book</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No matching tickets found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your price filter or route cities (e.g. New York, Paris, Tokyo, Boston, Amsterdam).
            </p>
            <button
              onClick={() => {
                setOrigin('New York');
                setDestination('Paris');
                setMaxPrice(1000);
                setNonStopOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              Reset Search to NYC → Paris
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
