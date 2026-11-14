import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { TripCard } from '../components/TripCard';
import { popularDestinations } from '../data/mockData';
import { 
  PlusCircle, 
  Compass, 
  Calendar, 
  Bell, 
  Ticket, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  Plane,
  Train,
  Bus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  onSelectTrip: (tripId: string) => void;
  openCreateTripModal: () => void;
  openReminderModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTrip,
  openCreateTripModal,
  openReminderModal,
  setCurrentTab
}) => {
  const { user } = useAuth();
  const { trips, reminders, toggleReminder } = useTrips();

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find nearest upcoming trip
  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const nearestTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;

  // Active Reminders
  const activeReminders = reminders.filter((r) => !r.isCompleted).slice(0, 4);

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & Stats Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 -mb-12 w-48 h-48 rounded-full bg-sky-400/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Travel Companion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Traveler'}! ✈️
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Your journeys are organized in one place. You have{' '}
              <strong className="text-white underline underline-offset-4 decoration-amber-400">
                {upcomingTrips.length} upcoming trip{upcomingTrips.length === 1 ? '' : 's'}
              </strong>{' '}
              and {activeReminders.length} pending travel alert{activeReminders.length === 1 ? '' : 's'}.
            </p>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openCreateTripModal}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold shadow-lg shadow-black/10 flex items-center gap-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Plan New Trip</span>
            </button>
            <button
              onClick={() => setCurrentTab('tickets')}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <p className="text-xs text-blue-200 font-medium">Total Trips</p>
            <p className="text-2xl font-black mt-0.5">{trips.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <p className="text-xs text-blue-200 font-medium">Upcoming</p>
            <p className="text-2xl font-black mt-0.5">{upcomingTrips.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <p className="text-xs text-blue-200 font-medium">Active Reminders</p>
            <p className="text-2xl font-black mt-0.5">{activeReminders.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <p className="text-xs text-blue-200 font-medium">Tickets Booked</p>
            <p className="text-2xl font-black mt-0.5">
              {trips.reduce((acc, t) => acc + (t.tickets?.length || 0), 0)}
            </p>
          </div>
        </div>
      </section>

      {/* Hero: Next Upcoming Journey Spotlight */}
      {nearestTrip && (
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={nearestTrip.coverImage}
                alt={nearestTrip.title}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 shadow-md"
              />
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Next Destination</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {nearestTrip.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{nearestTrip.origin} to {nearestTrip.destination}</span>
                  <span className="mx-1">•</span>
                  <span>{nearestTrip.startDate}</span>
                </p>
                <p className="text-xs text-slate-600 font-medium pt-1 line-clamp-1">
                  💡 {nearestTrip.notes || 'Don’t forget to check in online 24h prior to departure!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button
                onClick={() => onSelectTrip(nearestTrip.id)}
                className="w-full lg:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Open Full Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Grid: Trips Section & Active Reminders Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2 Cols: Trips Gallery */}
        <div className="lg:col-span-2 space-y-5">
          {/* Controls: Search & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl self-start">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Trips ({trips.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming ({upcomingTrips.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Journeys
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destination, city, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onSelect={onSelectTrip}
                />
              ))}

              {/* Quick Add Trip Card */}
              <div
                onClick={openCreateTripModal}
                className="min-h-[280px] rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mt-4">Plan Another Trip</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Add custom routes, tickets, packing lists, and day-by-day itineraries.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No trips match your search</h4>
              <p className="text-xs text-slate-500">Try adjusting your filters or start fresh by planning a new trip.</p>
              <button
                onClick={openCreateTripModal}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Plan a New Trip
              </button>
            </div>
          )}
        </div>

        {/* 1 Col Sidebar: Quick Reminders & Ticket Finder */}
        <div className="space-y-6">
          {/* Quick Reminders Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                  <Bell className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-800">Travel Alerts</h3>
              </div>
              <button
                onClick={openReminderModal}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>+ Add</span>
              </button>
            </div>

            {activeReminders.length > 0 ? (
              <div className="space-y-2.5">
                {activeReminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => toggleReminder(rem.id)}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {rem.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          rem.priority === 'high' ? 'bg-rose-500' : rem.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></span>
                        <p className="text-xs font-bold text-slate-900 truncate">{rem.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {rem.description || rem.tripTitle || 'Important travel task'}
                      </p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-1">
                        ⏰ {rem.dateTime.replace('T', ' ')}
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setCurrentTab('reminders')}
                  className="w-full text-center py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors block"
                >
                  View all reminders ({reminders.length}) →
                </button>
              </div>
            ) : (
              <div className="py-6 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">All caught up!</p>
                <p className="text-[11px] text-slate-500">No pending travel alerts right now.</p>
              </div>
            )}
          </div>

          {/* Popular Destinations Inspiration */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Trending Destinations</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">Top Rated</span>
            </div>

            <div className="space-y-3">
              {popularDestinations.slice(0, 3).map((dest) => (
                <div
                  key={dest.city}
                  onClick={openCreateTripModal}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors group"
                >
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      {dest.city}, {dest.country}
                    </p>
                    <p className="text-[11px] text-slate-300 line-clamp-1">{dest.tagline}</p>
                    <p className="text-[10px] text-sky-400 font-semibold mt-0.5">
                      Flights from {dest.flightFrom}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentTab('tickets')}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Search Ticket Booking Options →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
