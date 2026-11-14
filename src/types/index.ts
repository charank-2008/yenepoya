export type TransportType = 'flight' | 'train' | 'bus';

export type ActivityCategory = 'sightseeing' | 'food' | 'transport' | 'hotel' | 'leisure' | 'shopping' | 'flight' | 'meeting';

export type ReminderPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  homeCity: string;
  passportExpiry?: string;
  preferredCurrency: string;
  travelStyle: 'budget' | 'comfort' | 'luxury' | 'backpacking';
  bio?: string;
}

export interface Activity {
  id: string;
  time: string; // e.g. "09:30 AM"
  title: string;
  category: ActivityCategory;
  location: string;
  notes?: string;
  cost?: number;
  completed?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  title: string;
  activities: Activity[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'essentials' | 'clothes' | 'electronics' | 'toiletries' | 'documents' | 'health';
  packed: boolean;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'transport' | 'stay' | 'food' | 'activity' | 'shopping' | 'other';
  amount: number;
  date: string;
  paidBy: string;
}

export interface TravelTicket {
  id: string;
  tripId?: string;
  type: TransportType;
  provider: string; // e.g., Emirates, Eurostar, FlixBus
  bookingRef: string; // e.g., TM-84920
  origin: string;
  originCode?: string;
  destination: string;
  destinationCode?: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  seat?: string;
  gateOrPlatform?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  passengerName: string;
  stops: number; // 0 for direct
  travelClass?: string;
  passengerEmail?: string;
  passengerPassport?: string;
  mealPreference?: string;
  baggageAllowance?: string;
  flightNumber?: string;
}

export interface Reminder {
  id: string;
  tripId?: string;
  tripTitle?: string;
  title: string;
  description?: string;
  dateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  priority: ReminderPriority;
  category: 'check-in' | 'packing' | 'flight' | 'train' | 'bus' | 'hotel' | 'custom' | 'visa' | 'currency' | 'maps';
  isCompleted: boolean;
  notified?: boolean;
  snoozedUntil?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  distance: string;
  address: string;
  image: string;
  tag: string; // e.g. 'Michelin Recommended', 'Local Favorite', 'Scenic View', 'Best Tasting Menu'
  signatureDish: string;
  openingHours: string;
  isOpenNow: boolean;
  reservationRecommended?: boolean;
}

export interface Trip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  country: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'draft';
  budget: number;
  spent: number;
  currency: string;
  travelStyle: string; // solo, couple, family, friends, business
  companionsCount?: number;
  notes?: string;
  weather?: {
    temp: number;
    condition: string;
    icon: string;
  };
  itinerary: DayItinerary[];
  tickets: TravelTicket[];
  packingList: PackingItem[];
  expenses: ExpenseItem[];
}
