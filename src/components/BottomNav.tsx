import React from 'react';
import { useTrips } from '../context/TripContext';
import { Home, Ticket, Bell, User as UserIcon, Plus } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateTripModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openCreateTripModal
}) => {
  const { reminders } = useTrips();
  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold ${
          currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setCurrentTab('tickets')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold ${
          currentTab === 'tickets' ? 'text-blue-600' : 'text-slate-500'
        }`}
      >
        <Ticket className="w-5 h-5" />
        <span>Tickets</span>
      </button>

      {/* Floating Center Action Button */}
      <button
        onClick={openCreateTripModal}
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentTab('reminders')}
        className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold ${
          currentTab === 'reminders' ? 'text-blue-600' : 'text-slate-500'
        }`}
      >
        <Bell className="w-5 h-5" />
        <span>Reminders</span>
        {pendingRemindersCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {pendingRemindersCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold ${
          currentTab === 'profile' ? 'text-blue-600' : 'text-slate-500'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </div>
  );
};
