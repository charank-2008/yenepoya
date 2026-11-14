import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrips } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { CreateTripModal } from './components/CreateTripModal';
import { ReminderModal } from './components/ReminderModal';
import { BookingModal } from './components/BookingModal';
import { AITravelAssistant } from './components/AITravelAssistant';
import { Dashboard } from './pages/Dashboard';
import { TripDetails } from './pages/TripDetails';
import { TicketSearch } from './pages/TicketSearch';
import { RemindersPage } from './pages/RemindersPage';
import { ProfilePage } from './pages/ProfilePage';
import { TravelTicket } from './types';
import { Compass, Heart, ShieldCheck, HelpCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [bookingTicket, setBookingTicket] = useState<TravelTicket | null>(null);
  const [targetTripIdForBooking, setTargetTripIdForBooking] = useState<string | undefined>(undefined);

  const handleSelectTrip = (tripId: string) => {
    setSelectedTripId(tripId);
    setCurrentTab('trip-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedTripId(null);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (ticket: TravelTicket) => {
    setBookingTicket(ticket);
  };

  const handleOpenBookingForTrip = (tripId: string) => {
    setTargetTripIdForBooking(tripId);
    setCurrentTab('tickets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripCreated = (newTripId: string) => {
    handleSelectTrip(newTripId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedTripId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCreateTripModal={() => setIsCreateTripModalOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectTrip={handleSelectTrip}
            openCreateTripModal={() => setIsCreateTripModalOpen(true)}
            openReminderModal={() => setIsReminderModalOpen(true)}
            setCurrentTab={(tab) => {
              setSelectedTripId(null);
              setCurrentTab(tab);
            }}
          />
        )}

        {currentTab === 'trip-details' && selectedTripId && (
          <TripDetails
            tripId={selectedTripId}
            onBack={handleBackToDashboard}
            openBookingForTrip={handleOpenBookingForTrip}
            openReminderModal={() => setIsReminderModalOpen(true)}
          />
        )}

        {currentTab === 'tickets' && (
          <TicketSearch
            onSelectTicketToBook={handleOpenBookingModal}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersPage
            openReminderModal={() => setIsReminderModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">TripMate</span>
            <span>— The All-in-One Trip Planning & Travel Reminder Mobile/Web App</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Offline & Local Data Sync</span>
            </span>
            <span>•</span>
            <span>© 2026 TripMate Technologies</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedTripId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCreateTripModal={() => setIsCreateTripModalOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        defaultTripId={selectedTripId || undefined}
      />

      <BookingModal
        ticket={bookingTicket}
        isOpen={!!bookingTicket}
        onClose={() => setBookingTicket(null)}
        targetTripId={targetTripIdForBooking}
      />

      {/* AI Travel Concierge Assistant */}
      <AITravelAssistant />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <MainApp />
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
