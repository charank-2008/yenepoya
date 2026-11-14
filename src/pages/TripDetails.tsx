import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Trip, Activity, ActivityCategory, PackingItem, ExpenseItem, Restaurant } from '../types';
import { getNearbyRestaurants } from '../data/mockData';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Plane, 
  Train, 
  Bus, 
  Bell, 
  CheckSquare, 
  Receipt, 
  Compass, 
  CloudSun, 
  QrCode, 
  Share2, 
  Printer, 
  Download,
  AlertTriangle,
  Utensils,
  Hotel,
  Camera,
  Coffee,
  X,
  Edit,
  Save,
  Sparkles,
  Star,
  Award,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface TripDetailsProps {
  tripId: string;
  onBack: () => void;
  openBookingForTrip: (tripId: string) => void;
  openReminderModal: () => void;
}

const QUICK_ACTIVITY_TEMPLATES = [
  { title: 'Airport Arrival & Hotel Transit', category: 'transport' as ActivityCategory, time: '10:30 AM', cost: 15 },
  { title: 'Hotel Check-In & Unpack', category: 'hotel' as ActivityCategory, time: '02:00 PM', cost: 0 },
  { title: 'Historic Old Town Walking Tour', category: 'sightseeing' as ActivityCategory, time: '04:00 PM', cost: 20 },
  { title: 'Traditional Sunset Dinner', category: 'food' as ActivityCategory, time: '07:30 PM', cost: 45 },
  { title: 'Art & Culture Museum Pass', category: 'sightseeing' as ActivityCategory, time: '10:00 AM', cost: 25 },
  { title: 'Café & Specialty Bakery', category: 'food' as ActivityCategory, time: '09:00 AM', cost: 12 },
];

export const TripDetails: React.FC<TripDetailsProps> = ({
  tripId,
  onBack,
  openBookingForTrip,
  openReminderModal
}) => {
  const { 
    getTrip, 
    updateTrip,
    deleteTrip, 
    addActivity, 
    toggleActivity, 
    deleteActivity,
    togglePackingItem,
    addPackingItem,
    deletePackingItem,
    addExpense,
    deleteExpense,
    reminders,
    toggleReminder,
    addReminder,
    showToast
  } = useTrips();

  const trip = getTrip(tripId);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'tickets' | 'packing' | 'expenses' | 'reminders' | 'dining'>('itinerary');

  // Edit Trip Modal state
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(trip?.title || '');
  const [editOrigin, setEditOrigin] = useState(trip?.origin || '');
  const [editDestination, setEditDestination] = useState(trip?.destination || '');
  const [editBudget, setEditBudget] = useState(trip?.budget?.toString() || '1500');
  const [editCurrency, setEditCurrency] = useState(trip?.currency || 'USD');
  const [editTravelStyle, setEditTravelStyle] = useState(trip?.travelStyle || 'solo');
  const [editNotes, setEditNotes] = useState(trip?.notes || '');
  const [editCoverImage, setEditCoverImage] = useState(trip?.coverImage || '');

  // New Activity Modal state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('10:00 AM');
  const [actCategory, setActCategory] = useState<ActivityCategory>('sightseeing');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('0');
  const [actNotes, setActNotes] = useState('');

  // Dining & Restaurant states
  const [diningFilter, setDiningFilter] = useState<'all' | 'michelin' | 'bistro' | 'street'>('all');
  const [restaurantToSchedule, setRestaurantToSchedule] = useState<Restaurant | null>(null);
  const [scheduleDayNumber, setScheduleDayNumber] = useState<number>(1);
  const [scheduleMealType, setScheduleMealType] = useState<'Dinner' | 'Lunch' | 'Breakfast'>('Dinner');

  // New Packing Item state
  const [newPackingName, setNewPackingName] = useState('');
  const [newPackingCategory, setNewPackingCategory] = useState<PackingItem['category']>('essentials');

  // New Expense state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('food');
  const [expPaidBy, setExpPaidBy] = useState('Alex');

  if (!trip) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-600 font-semibold">Trip not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Get top nearby restaurants for destination
  const nearbyRestaurants = getNearbyRestaurants(trip.destination);

  // Filter restaurants
  const filteredRestaurants = nearbyRestaurants.filter((r) => {
    if (diningFilter === 'michelin') return r.tag.toLowerCase().includes('michelin') || r.priceRange === '$$$$';
    if (diningFilter === 'bistro') return r.priceRange === '$$' || r.priceRange === '$$$';
    if (diningFilter === 'street') return r.priceRange === '$';
    return true;
  });

  // Handle Edit Trip Save
  const handleSaveTripEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrip(trip.id, {
      title: editTitle.trim() || trip.title,
      origin: editOrigin.trim() || trip.origin,
      destination: editDestination.trim() || trip.destination,
      budget: Number(editBudget) || trip.budget,
      currency: editCurrency,
      travelStyle: editTravelStyle,
      notes: editNotes.trim(),
      coverImage: editCoverImage.trim() || trip.coverImage
    });
    setIsEditTripModalOpen(false);
  };

  // Handle Add Activity
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle) return;

    addActivity(trip.id, selectedDayNumber, {
      title: actTitle,
      time: actTime,
      category: actCategory,
      location: actLocation,
      cost: Number(actCost) || 0,
      notes: actNotes
    });

    // Reset & close
    setActTitle('');
    setActLocation('');
    setActCost('0');
    setActNotes('');
    setIsActivityModalOpen(false);
  };

  // Quick activity template filler
  const handleApplyActivityTemplate = (tpl: typeof QUICK_ACTIVITY_TEMPLATES[0]) => {
    setActTitle(tpl.title);
    setActCategory(tpl.category);
    setActTime(tpl.time);
    setActCost(tpl.cost.toString());
  };

  // Handle Add Restaurant directly into Itinerary
  const handleAddRestaurantToItinerary = () => {
    if (!restaurantToSchedule) return;

    const mealTime = scheduleMealType === 'Dinner' ? '07:30 PM' : scheduleMealType === 'Lunch' ? '01:00 PM' : '09:00 AM';
    const estimatedCost = restaurantToSchedule.priceRange === '$$$$' ? 120 : restaurantToSchedule.priceRange === '$$$' ? 65 : restaurantToSchedule.priceRange === '$$' ? 35 : 15;

    addActivity(trip.id, scheduleDayNumber, {
      title: `${scheduleMealType} at ${restaurantToSchedule.name}`,
      time: mealTime,
      category: 'food',
      location: restaurantToSchedule.address,
      cost: estimatedCost,
      notes: `Specialty: ${restaurantToSchedule.signatureDish} • ${restaurantToSchedule.tag}`
    });

    showToast(`Added ${restaurantToSchedule.name} to Day ${scheduleDayNumber} Itinerary!`, 'success');
    setRestaurantToSchedule(null);
  };

  // Handle Setting Table Reservation Alert
  const handleSetDiningReminder = (restaurant: Restaurant) => {
    const targetDate = trip.startDate ? `${trip.startDate}T19:00` : new Date().toISOString().slice(0, 16);
    addReminder({
      tripId: trip.id,
      tripTitle: trip.title,
      title: `Table Reservation: ${restaurant.name}`,
      description: `Address: ${restaurant.address} | Signature: ${restaurant.signatureDish} | Hours: ${restaurant.openingHours}`,
      dateTime: targetDate,
      priority: 'medium',
      category: 'hotel'
    });
    showToast(`Reminder set for ${restaurant.name}!`, 'info');
  };

  // Handle Add Packing
  const handleAddPacking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingName.trim()) return;
    addPackingItem(trip.id, newPackingName.trim(), newPackingCategory);
    setNewPackingName('');
  };

  // Handle Add Expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    addExpense(trip.id, {
      title: expTitle,
      amount: Number(expAmount) || 0,
      category: expCategory,
      date: new Date().toISOString().split('T')[0],
      paidBy: expPaidBy
    });

    setExpTitle('');
    setExpAmount('');
    setIsExpenseModalOpen(false);
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'sightseeing':
        return <Camera className="w-4 h-4 text-purple-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-emerald-600" />;
      case 'transport':
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'leisure':
        return <Coffee className="w-4 h-4 text-pink-600" />;
      default:
        return <Compass className="w-4 h-4 text-slate-600" />;
    }
  };

  // Packing stats
  const totalPacking = trip.packingList?.length || 0;
  const packedCount = trip.packingList?.filter((i) => i.packed).length || 0;
  const packedPercentage = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  // Reminders for this trip
  const tripReminders = reminders.filter((r) => r.tripId === trip.id);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditTitle(trip.title);
              setEditOrigin(trip.origin);
              setEditDestination(trip.destination);
              setEditBudget(trip.budget.toString());
              setEditCurrency(trip.currency);
              setEditTravelStyle(trip.travelStyle);
              setEditNotes(trip.notes || '');
              setEditCoverImage(trip.coverImage);
              setIsEditTripModalOpen(true);
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Edit Trip Details"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Trip itinerary link copied to clipboard!', 'info');
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Print / PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                deleteTrip(trip.id);
                onBack();
              }
            }}
            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>

          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                  {trip.country}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold capitalize bg-blue-600/90 backdrop-blur-md">
                  {trip.travelStyle} Style
                </span>
                {trip.weather && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 backdrop-blur-md flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5" />
                    <span>{trip.weather.temp}°C • {trip.weather.condition}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {trip.title}
              </h1>

              <p className="text-sm sm:text-base text-blue-200 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-blue-300" />
                <span>{trip.origin}</span>
                <span className="text-white/60">→</span>
                <span className="text-white font-bold">{trip.destination}</span>
                <span className="mx-1 text-white/40">•</span>
                <Calendar className="w-4 h-4 text-blue-300 ml-1" />
                <span>{trip.startDate} to {trip.endDate}</span>
              </p>
            </div>

            {/* Budget Snapshot */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right min-w-[200px]">
              <p className="text-xs text-blue-200">Budget Spent</p>
              <p className="text-2xl font-black text-white">
                ${trip.spent || 0} <span className="text-sm font-normal text-white/70">/ ${trip.budget}</span>
              </p>
              <div className="w-full h-1.5 rounded-full bg-white/20 mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, ((trip.spent || 0) / (trip.budget || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arriving in Destination: Restaurant Discovery Prompt Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">
              Arriving in {trip.destination}? Discover Nearby Top-Rated Restaurants
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Explore Michelin-starred tables, local bistros, and authentic street food within walking distance of your stay.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('dining')}
          className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>Browse Restaurants ({nearbyRestaurants.length})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'itinerary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary & Schedule</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {trip.itinerary?.length || 0} Days
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dining')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'dining'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-500" />
            <span>Nearby Dining</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {nearbyRestaurants.length} Best Spots
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'tickets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Tickets & Passes</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {trip.tickets?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'reminders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Trip Alerts</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {tripReminders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'packing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Packing Checklist</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {packedCount}/{totalPacking}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Expenses & Budget</span>
          </button>
        </div>
      </div>

      {/* TAB: Nearby Best Restaurants */}
      {activeTab === 'dining' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Best Rated Restaurants in {trip.destination}
              </h3>
              <p className="text-xs text-slate-500">
                Curated dining spots near your destination. Add any restaurant directly into your day-by-day itinerary.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
              <button
                onClick={() => setDiningFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${diningFilter === 'all' ? 'bg-white text-amber-600 font-bold shadow-sm' : 'text-slate-600'}`}
              >
                All Spots
              </button>
              <button
                onClick={() => setDiningFilter('michelin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${diningFilter === 'michelin' ? 'bg-white text-amber-600 font-bold shadow-sm' : 'text-slate-600'}`}
              >
                ⭐ Fine Dining
              </button>
              <button
                onClick={() => setDiningFilter('bistro')}
                className={`px-3 py-1.5 rounded-lg transition-all ${diningFilter === 'bistro' ? 'bg-white text-amber-600 font-bold shadow-sm' : 'text-slate-600'}`}
              >
                🍷 Local Bistros
              </button>
              <button
                onClick={() => setDiningFilter('street')}
                className={`px-3 py-1.5 rounded-lg transition-all ${diningFilter === 'street' ? 'bg-white text-amber-600 font-bold shadow-sm' : 'text-slate-600'}`}
              >
                🌯 Street Eats
              </button>
            </div>
          </div>

          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-800 shadow-sm">
                        {rest.tag}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>{rest.rating}</span>
                        <span className="text-[10px] text-white/80">({rest.reviewsCount})</span>
                      </span>
                    </div>

                    {/* Bottom overlay: Name & Cuisine */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-[11px] font-bold text-amber-200">{rest.cuisine}</p>
                      <h4 className="text-lg font-black leading-snug drop-shadow-sm">{rest.name}</h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>{rest.distance}</span>
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {rest.priceRange}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{rest.address}</span>
                    </p>

                    <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-xs text-amber-950">
                      <span className="font-extrabold text-amber-800 block text-[11px] uppercase tracking-wider mb-0.5">
                        🍽️ Signature Specialty
                      </span>
                      <span className="font-medium">{rest.signatureDish}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{rest.openingHours}</span>
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        ● Open Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setRestaurantToSchedule(rest)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Itinerary</span>
                  </button>

                  <button
                    onClick={() => handleSetDiningReminder(rest)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-amber-600 transition-colors"
                    title="Set reservation reminder"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Day-by-Day Journey Itinerary</h3>
              <p className="text-xs text-slate-500">Plan out visits, dining, transfers and reservations.</p>
            </div>
            <button
              onClick={() => {
                setSelectedDayNumber(1);
                setIsActivityModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Activity</span>
            </button>
          </div>

          <div className="space-y-6">
            {trip.itinerary?.map((day) => (
              <div key={day.dayNumber} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{day.title}</h4>
                      <p className="text-xs text-slate-500">{day.date}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDayNumber(day.dayNumber);
                      setIsActivityModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Day {day.dayNumber}</span>
                  </button>
                </div>

                {/* Day's Activities Timeline */}
                <div className="p-6">
                  {day.activities && day.activities.length > 0 ? (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {day.activities.map((act) => (
                        <div
                          key={act.id}
                          className={`relative flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                            act.completed
                              ? 'bg-slate-50/80 border-slate-200 opacity-60'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          {/* Dot marker */}
                          <button
                            onClick={() => toggleActivity(trip.id, day.dayNumber, act.id)}
                            className="absolute -left-[30px] top-4 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center"
                          >
                            {act.completed && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                          </button>

                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                              {getCategoryIcon(act.category)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-600">{act.time}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <h5 className={`text-sm font-bold ${act.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                  {act.title}
                                </h5>
                              </div>
                              {act.location && (
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{act.location}</span>
                                </p>
                              )}
                              {act.notes && (
                                <p className="text-xs text-slate-600 font-normal italic pt-0.5">
                                  {act.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {act.cost ? (
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                                ${act.cost}
                              </span>
                            ) : null}
                            <button
                              onClick={() => deleteActivity(trip.id, day.dayNumber, act.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              title="Delete Activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-500 font-medium">No activities scheduled yet for Day {day.dayNumber}.</p>
                      <button
                        onClick={() => {
                          setSelectedDayNumber(day.dayNumber);
                          setIsActivityModalOpen(true);
                        }}
                        className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Add first activity
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tickets & Passes */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Booked Tickets & Boarding Passes</h3>
              <p className="text-xs text-slate-500">Access flight, train, and bus reservations for this trip.</p>
            </div>
            <button
              onClick={() => openBookingForTrip(trip.id)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book / Add Transport</span>
            </button>
          </div>

          {trip.tickets && trip.tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {trip.tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {t.type === 'flight' ? <Plane className="w-5 h-5" /> : t.type === 'train' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{t.provider}</h4>
                        <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                          {t.type} • Ref: {t.bookingRef}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-2">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">From</p>
                      <p className="text-sm font-bold text-slate-900">{t.origin}</p>
                      <p className="text-xs text-blue-600 font-semibold">{t.departureTime}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-semibold">{t.duration}</span>
                      <div className="w-12 h-0.5 bg-slate-300 relative my-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-[2px] right-0"></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{t.stops === 0 ? 'Non-stop' : `${t.stops} stop`}</span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-medium">To</p>
                      <p className="text-sm font-bold text-slate-900">{t.destination}</p>
                      <p className="text-xs text-blue-600 font-semibold">{t.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
                    <div>
                      <p className="text-xs text-slate-400">Seat / Gate</p>
                      <p className="text-xs font-bold text-slate-800">{t.seat || 'Assigned'} • {t.gateOrPlatform || 'TBA'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">${t.price}</span>
                      <div className="w-10 h-10 bg-slate-100 rounded-lg p-1">
                        <QrCode className="w-full h-full text-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <Plane className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No tickets linked yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Search available flights, trains, or buses for {trip.destination} and reserve tickets with one click.
              </p>
              <button
                onClick={() => openBookingForTrip(trip.id)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Find & Book Transport
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Trip Alerts & Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Reminders for {trip.title}</h3>
              <p className="text-xs text-slate-500">Notifications scheduled specifically for this trip.</p>
            </div>
            <button
              onClick={openReminderModal}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Set Alert</span>
            </button>
          </div>

          {tripReminders.length > 0 ? (
            <div className="space-y-3">
              {tripReminders.map((rem) => (
                <div
                  key={rem.id}
                  onClick={() => toggleReminder(rem.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    rem.isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button className="mt-0.5">
                      {rem.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-600" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          rem.priority === 'high' ? 'bg-rose-500' : rem.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></span>
                        <h4 className={`text-sm font-bold ${rem.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {rem.title}
                        </h4>
                      </div>
                      {rem.description && (
                        <p className="text-xs text-slate-600 mt-1">{rem.description}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                    {rem.dateTime.replace('T', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No reminders scheduled for this trip</h4>
              <p className="text-xs text-slate-500">Set alarms for web check-in, passport renewals, or luggage prep.</p>
              <button
                onClick={openReminderModal}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
              >
                Create First Alert
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Packing Checklist */}
      {activeTab === 'packing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Packing Readiness</h3>
                <p className="text-xs text-slate-500">
                  {packedCount} of {totalPacking} items packed ({packedPercentage}%)
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full sm:w-64">
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${packedPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Add packing form */}
            <form onSubmit={handleAddPacking} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Add packing item (e.g. Sunglasses, Noise cancelling headphones...)"
                value={newPackingName}
                onChange={(e) => setNewPackingName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newPackingCategory}
                onChange={(e) => setNewPackingCategory(e.target.value as PackingItem['category'])}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="essentials">Essentials</option>
                <option value="clothes">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="toiletries">Toiletries</option>
                <option value="documents">Documents</option>
                <option value="health">Health & Meds</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </form>

            {/* Packing List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              {trip.packingList?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => togglePackingItem(trip.id, item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    item.packed
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button className="shrink-0">
                      {item.packed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-600" />
                      )}
                    </button>
                    <span className={`text-xs font-bold truncate ${item.packed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePackingItem(trip.id, item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Expenses & Budget */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Trip Budget</p>
              <p className="text-2xl font-black text-slate-900 mt-1">${trip.budget}</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Spent</p>
              <p className="text-2xl font-black text-blue-600 mt-1">${trip.spent || 0}</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Remaining Funds</p>
              <p className={`text-2xl font-black mt-1 ${
                trip.budget - (trip.spent || 0) < 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                ${Math.max(0, trip.budget - (trip.spent || 0))}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Recorded Expenses</h3>
                <p className="text-xs text-slate-500">Track flight bookings, hotels, food, and sightseeing receipts.</p>
              </div>

              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Expense</span>
              </button>
            </div>

            {trip.expenses && trip.expenses.length > 0 ? (
              <div className="space-y-2.5">
                {trip.expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs capitalize">
                        {exp.category[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          {exp.date} • Paid by {exp.paidBy} • <span className="capitalize">{exp.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-900">${exp.amount}</span>
                      <button
                        onClick={() => deleteExpense(trip.id, exp.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No expenses logged yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Restaurant to Itinerary */}
      {restaurantToSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 my-6 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add to Trip Schedule</h3>
                <p className="text-xs text-amber-100">{restaurantToSchedule.name}</p>
              </div>
              <button
                onClick={() => setRestaurantToSchedule(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <img
                  src={restaurantToSchedule.image}
                  alt={restaurantToSchedule.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{restaurantToSchedule.name}</h4>
                  <p className="text-xs text-slate-600">{restaurantToSchedule.cuisine}</p>
                  <p className="text-[11px] text-amber-800 font-semibold mt-0.5">{restaurantToSchedule.tag}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Which Day of the Trip?
                </label>
                <select
                  value={scheduleDayNumber}
                  onChange={(e) => setScheduleDayNumber(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {trip.itinerary?.map((day) => (
                    <option key={day.dayNumber} value={day.dayNumber}>
                      Day {day.dayNumber} ({day.date}) - {day.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Meal Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner'] as const).map((meal) => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => setScheduleMealType(meal)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        scheduleMealType === meal
                          ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRestaurantToSchedule(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddRestaurantToItinerary}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  Confirm & Schedule Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Trip Details */}
      {isEditTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 my-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Edit Trip Details</h3>
                <p className="text-xs text-blue-100">Update destination, title, budget, or cover</p>
              </div>
              <button
                onClick={() => setIsEditTripModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTripEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trip Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    required
                    value={editOrigin}
                    onChange={(e) => setEditOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Travel Style
                  </label>
                  <select
                    value={editTravelStyle}
                    onChange={(e) => setEditTravelStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="friends">Friends</option>
                    <option value="family">Family</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={editCoverImage}
                  onChange={(e) => setEditCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditTripModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Trip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Activity */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="bg-blue-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add Activity for Day {selectedDayNumber}</h3>
                <p className="text-xs text-blue-100">Schedule sightseeing, transport or food</p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Quick Template pills */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Quick Activity Suggestions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIVITY_TEMPLATES.map((tpl) => (
                    <button
                      type="button"
                      key={tpl.title}
                      onClick={() => handleApplyActivityTemplate(tpl)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all text-left truncate max-w-[200px]"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Louvre Museum Guided Tour"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transport / Transfer</option>
                    <option value="flight">Flight / Boarding</option>
                    <option value="hotel">Hotel Check-in/out</option>
                    <option value="leisure">Relaxation / Beach</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pyramide du Louvre, Paris"
                  value={actLocation}
                  onChange={(e) => setActLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Est. Cost ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={actCost}
                  onChange={(e) => setActCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Booking codes, tips, or what to bring..."
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-normal"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="bg-blue-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Record Trip Expense</h3>
                <p className="text-xs text-blue-100">Keep budget updated automatically</p>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinner at Le Bistro"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
                  >
                    <option value="food">Food & Drinks</option>
                    <option value="stay">Hotel / Lodging</option>
                    <option value="transport">Transport</option>
                    <option value="activity">Activities</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paid By
                </label>
                <input
                  type="text"
                  placeholder="Alex"
                  value={expPaidBy}
                  onChange={(e) => setExpPaidBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
