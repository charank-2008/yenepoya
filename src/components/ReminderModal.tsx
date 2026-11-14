import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Reminder, ReminderPriority } from '../types';
import { 
  X, 
  Bell, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Plane,
  CheckSquare,
  Hotel,
  ShieldCheck,
  CreditCard,
  MapPin
} from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTripId?: string;
}

interface ReminderTemplate {
  name: string;
  icon: string;
  category: Reminder['category'];
  priority: ReminderPriority;
  title: string;
  description: string;
  hourOffsetFromStart?: number; // hours before trip start
}

const SMART_TEMPLATES: ReminderTemplate[] = [
  {
    name: '24h Web Check-in',
    icon: '✈️',
    category: 'flight',
    priority: 'high',
    title: 'Complete 24h Web Check-in',
    description: 'Select your preferred seats, confirm baggage, and download mobile boarding passes.',
    hourOffsetFromStart: -24
  },
  {
    name: 'Luggage Packing Check',
    icon: '🧳',
    category: 'packing',
    priority: 'medium',
    title: 'Finalize Luggage Packing',
    description: 'Verify travel adapters, chargers, weather-appropriate clothing, and toiletries.',
    hourOffsetFromStart: -48
  },
  {
    name: '3h Airport Departure',
    icon: '⏰',
    category: 'flight',
    priority: 'high',
    title: 'Airport Arrival & Baggage Drop',
    description: 'Arrive at the departure terminal 3 hours before flight for security screening.',
    hourOffsetFromStart: -3
  },
  {
    name: 'Hotel Check-In',
    icon: '🏨',
    category: 'hotel',
    priority: 'medium',
    title: 'Hotel Check-in & Key Card',
    description: 'Check in at accommodation and store luggage if arriving before standard check-in.',
    hourOffsetFromStart: 4
  },
  {
    name: 'Passport & Visa Validity',
    icon: '🛂',
    category: 'visa',
    priority: 'high',
    title: 'Verify Passport & Visa Status',
    description: 'Ensure passport has at least 6 months remaining validity from trip departure date.',
    hourOffsetFromStart: -168 // 1 week before
  },
  {
    name: 'Offline Maps & Tickets',
    icon: '🗺️',
    category: 'custom',
    priority: 'low',
    title: 'Download Offline Maps & Guides',
    description: 'Save offline Google Maps area and download PDF tickets in case of no roaming data.',
    hourOffsetFromStart: -12
  }
];

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  defaultTripId
}) => {
  const { trips, addReminder } = useTrips();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tripId, setTripId] = useState(defaultTripId || (trips[0]?.id || ''));
  const [dateTime, setDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString().slice(0, 16);
  });
  const [priority, setPriority] = useState<ReminderPriority>('high');
  const [category, setCategory] = useState<Reminder['category']>('check-in');

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl: ReminderTemplate) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setCategory(tpl.category);
    setPriority(tpl.priority);

    // If a trip is selected and template has an hour offset, auto-compute the scheduled time
    const selectedTrip = trips.find((t) => t.id === tripId);
    if (selectedTrip && tpl.hourOffsetFromStart !== undefined) {
      const tripStartDate = new Date(selectedTrip.startDate + 'T09:00:00');
      tripStartDate.setHours(tripStartDate.getHours() + tpl.hourOffsetFromStart);
      setDateTime(tripStartDate.toISOString().slice(0, 16));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedTrip = trips.find((t) => t.id === tripId);

    addReminder({
      title: title.trim(),
      description: description.trim(),
      tripId: tripId || undefined,
      tripTitle: selectedTrip ? selectedTrip.title : undefined,
      dateTime,
      priority,
      category
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 my-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Bell className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-100">
              Smart Travel Reminder
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Set Travel Alert</h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            Keep track of online check-ins, terminal arrivals, hotel times, and packing deadlines.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Smart Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Travel Templates</span>
              <span className="text-[11px] text-amber-600 font-semibold">1-Click setup</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SMART_TEMPLATES.map((tpl) => (
                <button
                  type="button"
                  key={tpl.name}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all active:scale-95 group shadow-sm"
                >
                  <span className="text-base block mb-0.5">{tpl.icon}</span>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-800 truncate">{tpl.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{tpl.priority} priority</p>
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reminder Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 24h Web Check-in for Delta Flight 142"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Link to Trip */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Attach to Trip Itinerary
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium"
            >
              <option value="">-- Standalone Reminder (No Trip) --</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title} ({trip.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Reminder['category'])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium capitalize"
              >
                <option value="flight">Flight / Boarding</option>
                <option value="train">Train Departure</option>
                <option value="bus">Bus Departure</option>
                <option value="check-in">Web Check-in</option>
                <option value="packing">Packing Checklist</option>
                <option value="hotel">Hotel Check-in/out</option>
                <option value="visa">Passport / Visa</option>
                <option value="currency">Currency / Forex</option>
                <option value="custom">Custom Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold capitalize"
              >
                <option value="high">🔴 High Urgency</option>
                <option value="medium">🟡 Medium Urgency</option>
                <option value="low">🟢 Standard</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Date & Time for Alert
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Instructions or Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Have passport number ready, seat row 14A preferred."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-normal"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>Schedule Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
