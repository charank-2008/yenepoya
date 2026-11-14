import React from 'react';
import { Trip } from '../types';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Bell, 
  DollarSign, 
  ArrowRight, 
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onSelect: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onDelete }) => {
  // Calculate days remaining or elapsed
  const calculateDaysRemaining = (startDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tripStart = new Date(startDateStr);
    tripStart.setHours(0, 0, 0, 0);
    
    const diffTime = tripStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { label: 'Starts Today!', isImminent: true };
    if (diffDays > 0) return { label: `In ${diffDays} days`, isImminent: diffDays <= 7 };
    return { label: 'Past Journey', isImminent: false };
  };

  const daysInfo = calculateDaysRemaining(trip.startDate);
  const budgetPercent = trip.budget > 0 ? Math.min(100, Math.round(((trip.spent || 0) / trip.budget) * 100)) : 0;

  return (
    <div 
      onClick={() => onSelect(trip.id)}
      className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {trip.country}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
            trip.status === 'completed'
              ? 'bg-emerald-600/90 text-white'
              : daysInfo.isImminent
              ? 'bg-rose-600/90 text-white animate-pulse'
              : 'bg-blue-600/90 text-white'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{daysInfo.label}</span>
          </span>
        </div>

        {/* Bottom image overlay info */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xs font-semibold text-blue-200 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-300" />
            <span>{trip.origin} → {trip.destination}</span>
          </p>
          <h3 className="text-lg font-bold leading-snug drop-shadow-sm truncate mt-0.5">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Dates & Style */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{trip.startDate} to {trip.endDate}</span>
            </div>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
              {trip.travelStyle}
            </span>
          </div>

          {/* Quick Stats: Tickets & Days */}
          <div className="grid grid-cols-3 gap-2 py-1 text-center">
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
              <p className="text-[11px] text-slate-500">Days</p>
              <p className="text-sm font-bold text-slate-800">{trip.itinerary?.length || 1}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
              <p className="text-[11px] text-slate-500">Tickets</p>
              <p className="text-sm font-bold text-slate-800">{trip.tickets?.length || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
              <p className="text-[11px] text-slate-500">Checklist</p>
              <p className="text-sm font-bold text-slate-800">
                {trip.packingList?.filter((p) => p.packed).length || 0}/{trip.packingList?.length || 0}
              </p>
            </div>
          </div>

          {/* Budget progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Budget Used</span>
              <span className="text-slate-500">${trip.spent || 0} / ${trip.budget}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent > 90 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5 transition-colors">
            <span>Manage Trip Itinerary</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>

          {trip.weather && (
            <span className="text-xs text-slate-500 font-medium">
              ☀️ {trip.weather.temp}°C
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
