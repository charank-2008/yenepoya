import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Reminder, ReminderPriority } from '../types';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar, 
  Clock, 
  Tag, 
  AlertTriangle, 
  Plane, 
  Train, 
  Bus, 
  Hotel, 
  CheckSquare, 
  Sparkles,
  SlidersHorizontal,
  Volume2,
  RotateCw,
  Compass,
  CreditCard
} from 'lucide-react';

interface RemindersPageProps {
  openReminderModal: () => void;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({ openReminderModal }) => {
  const { reminders, toggleReminder, deleteReminder, snoozeReminder, showToast } = useTrips();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Audio synthesizer chime for test alert
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
      showToast('🔔 Notification chime sounded successfully!', 'info');
    } catch {
      showToast('🔔 Travel notification alert triggered!', 'info');
    }
  };

  // Compute countdown / time remaining
  const getTimeRemaining = (dateTimeStr: string, isCompleted: boolean) => {
    if (isCompleted) return { label: 'Completed', isUrgent: false, isOverdue: false };
    
    const now = new Date();
    const target = new Date(dateTimeStr);
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs < 0) {
      const hoursAgo = Math.abs(Math.round(diffMs / (1000 * 3600)));
      return { 
        label: hoursAgo > 24 ? `Overdue by ${Math.round(hoursAgo / 24)}d` : `Overdue by ${hoursAgo}h`,
        isUrgent: true,
        isOverdue: true
      };
    }

    const hoursLeft = Math.round(diffMs / (1000 * 3600));
    if (hoursLeft < 1) {
      const minsLeft = Math.max(1, Math.round(diffMs / (1000 * 60)));
      return { label: `Due in ${minsLeft}m`, isUrgent: true, isOverdue: false };
    }
    if (hoursLeft < 24) {
      return { label: `Due in ${hoursLeft}h`, isUrgent: hoursLeft <= 6, isOverdue: false };
    }
    const daysLeft = Math.round(hoursLeft / 24);
    return { label: `In ${daysLeft} day${daysLeft > 1 ? 's' : ''}`, isUrgent: false, isOverdue: false };
  };

  const filteredReminders = reminders.filter((rem) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? !rem.isCompleted
        : rem.isCompleted;

    const matchesPriority = priorityFilter === 'all' || rem.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || rem.category === categoryFilter;

    return matchesStatus && matchesPriority && matchesCategory;
  });

  const getCategoryIcon = (category: Reminder['category']) => {
    switch (category) {
      case 'flight':
        return <Plane className="w-4 h-4 text-sky-500" />;
      case 'train':
        return <Train className="w-4 h-4 text-emerald-500" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-amber-500" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-purple-500" />;
      case 'packing':
        return <CheckSquare className="w-4 h-4 text-indigo-500" />;
      case 'check-in':
        return <Clock className="w-4 h-4 text-rose-500" />;
      case 'currency':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Smart Travel Alerts & Timers</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Travel Activity Reminders
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm">
              Keep track of online check-ins, boarding deadlines, passport renewals, and luggage checklists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={playChime}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Test notification alert audio chime"
            >
              <Volume2 className="w-4 h-4 text-amber-200" />
              <span>Test Bell Sound</span>
            </button>

            <button
              onClick={openReminderModal}
              className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>New Reminder</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Chips & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({reminders.filter((r) => !r.isCompleted).length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({reminders.filter((r) => r.isCompleted).length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({reminders.length})
          </button>
        </div>

        {/* Category & Urgency Filters */}
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="check-in">Web Check-in</option>
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="bus">Bus</option>
            <option value="packing">Packing</option>
            <option value="hotel">Hotel</option>
            <option value="visa">Passport / Visa</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Urgency</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Standard</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length > 0 ? (
          filteredReminders.map((rem) => {
            const timeInfo = getTimeRemaining(rem.dateTime, rem.isCompleted);

            return (
              <div
                key={rem.id}
                onClick={() => toggleReminder(rem.id)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  rem.isCompleted
                    ? 'bg-slate-50/80 border-slate-200 opacity-60'
                    : timeInfo.isOverdue
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <button
                    type="button"
                    className="mt-1 sm:mt-0 shrink-0 text-slate-300 group-hover:text-blue-600 transition-colors"
                  >
                    {rem.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="p-1 rounded-lg bg-slate-100 shrink-0">
                        {getCategoryIcon(rem.category)}
                      </span>
                      <h3 className={`text-sm sm:text-base font-bold truncate ${
                        rem.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {rem.title}
                      </h3>
                      <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        rem.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : rem.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {rem.priority}
                      </span>

                      {/* Time countdown badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        rem.isCompleted
                          ? 'bg-slate-100 text-slate-500'
                          : timeInfo.isOverdue
                          ? 'bg-rose-600 text-white animate-pulse'
                          : timeInfo.isUrgent
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{timeInfo.label}</span>
                      </span>
                    </div>

                    {rem.description && (
                      <p className="text-xs text-slate-600 font-medium line-clamp-2">
                        {rem.description}
                      </p>
                    )}

                    {rem.tripTitle && (
                      <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                        <span>Trip:</span>
                        <span>{rem.tripTitle}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Due Date & Snooze / Delete controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 font-medium">Scheduled Alert</p>
                    <p className="text-xs font-bold text-slate-800">
                      {rem.dateTime.replace('T', ' ')}
                    </p>
                  </div>

                  {/* Snooze Buttons */}
                  {!rem.isCompleted && (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => snoozeReminder(rem.id, 1)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-white hover:text-blue-600 transition-colors"
                        title="Snooze for 1 hour"
                      >
                        +1h
                      </button>
                      <button
                        type="button"
                        onClick={() => snoozeReminder(rem.id, 24)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-white hover:text-blue-600 transition-colors"
                        title="Snooze for 24 hours"
                      >
                        +1d
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReminder(rem.id);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No reminders matching this filter</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You're all caught up! Create a new alert or check past completed reminders.
            </p>
            <button
              onClick={openReminderModal}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              + Create New Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
