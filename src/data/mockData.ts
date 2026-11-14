import { Trip, TravelTicket, Reminder, User, Restaurant } from '../types';

export const initialUser: User = {
  id: 'u-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  homeCity: 'San Francisco, USA',
  passportExpiry: '2028-10-15',
  preferredCurrency: 'USD',
  travelStyle: 'comfort',
  bio: 'Avid traveler, culture enthusiast, and photography lover exploring 30 countries before 30.'
};

export const sampleTickets: TravelTicket[] = [
  // Flights
  {
    id: 't-101',
    type: 'flight',
    provider: 'SkyWings International',
    bookingRef: 'SW-89421',
    origin: 'New York (JFK)',
    originCode: 'JFK',
    destination: 'Paris (CDG)',
    destinationCode: 'CDG',
    departureDate: '2026-12-05',
    departureTime: '06:40 PM',
    arrivalDate: '2026-12-06',
    arrivalTime: '08:15 AM',
    duration: '7h 35m',
    price: 490,
    currency: 'USD',
    seat: '14A (Window)',
    gateOrPlatform: 'Terminal 4, Gate B22',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 0
  },
  {
    id: 't-102',
    type: 'flight',
    provider: 'Air France',
    bookingRef: 'AF-30912',
    origin: 'New York (JFK)',
    originCode: 'JFK',
    destination: 'Paris (CDG)',
    destinationCode: 'CDG',
    departureDate: '2026-12-05',
    departureTime: '10:15 PM',
    arrivalDate: '2026-12-06',
    arrivalTime: '11:45 AM',
    duration: '7h 30m',
    price: 540,
    currency: 'USD',
    seat: '21C',
    gateOrPlatform: 'Terminal 1, Gate 5',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 0
  },
  {
    id: 't-103',
    type: 'flight',
    provider: 'Japan Airlines',
    bookingRef: 'JL-49021',
    origin: 'San Francisco (SFO)',
    originCode: 'SFO',
    destination: 'Tokyo (NRT)',
    destinationCode: 'NRT',
    departureDate: '2027-03-10',
    departureTime: '11:30 AM',
    arrivalDate: '2027-03-11',
    arrivalTime: '03:45 PM',
    duration: '11h 15m',
    price: 780,
    currency: 'USD',
    seat: '18K',
    gateOrPlatform: 'Gate G94',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 0
  },
  // Trains
  {
    id: 't-201',
    type: 'train',
    provider: 'Eurostar Express',
    bookingRef: 'ES-77123',
    origin: 'Paris Gare du Nord',
    originCode: 'PGN',
    destination: 'Amsterdam Centraal',
    destinationCode: 'AMS',
    departureDate: '2026-12-10',
    departureTime: '09:22 AM',
    arrivalDate: '2026-12-10',
    arrivalTime: '12:44 PM',
    duration: '3h 22m',
    price: 95,
    currency: 'USD',
    seat: 'Coach 4, Seat 32',
    gateOrPlatform: 'Platform 7',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 0
  },
  {
    id: 't-202',
    type: 'train',
    provider: 'Shinkansen Nozomi',
    bookingRef: 'JR-11928',
    origin: 'Tokyo Station',
    originCode: 'TYO',
    destination: 'Kyoto Station',
    destinationCode: 'KYO',
    departureDate: '2027-03-14',
    departureTime: '08:00 AM',
    arrivalDate: '2027-03-14',
    arrivalTime: '10:15 AM',
    duration: '2h 15m',
    price: 120,
    currency: 'USD',
    seat: 'Car 7, Seat 12-E',
    gateOrPlatform: 'Track 14',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 1
  },
  // Buses
  {
    id: 't-301',
    type: 'bus',
    provider: 'FlixBus Premium',
    bookingRef: 'FX-55018',
    origin: 'Paris Bercy Seine',
    originCode: 'PBS',
    destination: 'Brussels South',
    destinationCode: 'BRU',
    departureDate: '2026-12-11',
    departureTime: '08:30 AM',
    arrivalDate: '2026-12-11',
    arrivalTime: '12:45 PM',
    duration: '4h 15m',
    price: 32,
    currency: 'USD',
    seat: 'Seat 14',
    gateOrPlatform: 'Bay 3',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 1
  },
  {
    id: 't-302',
    type: 'bus',
    provider: 'Megabus Express',
    bookingRef: 'MB-99201',
    origin: 'Boston South Station',
    originCode: 'BOS',
    destination: 'New York Midtown',
    destinationCode: 'NYC',
    departureDate: '2026-11-28',
    departureTime: '07:00 AM',
    arrivalDate: '2026-11-28',
    arrivalTime: '11:30 AM',
    duration: '4h 30m',
    price: 28,
    currency: 'USD',
    seat: 'Free Seating',
    gateOrPlatform: 'Gate 12',
    status: 'confirmed',
    passengerName: 'Alex Morgan',
    stops: 0
  }
];

export const sampleReminders: Reminder[] = [
  {
    id: 'rem-1',
    tripId: 'trip-1',
    tripTitle: 'Winter Romance in Paris',
    title: 'Complete 24h Web Check-in for SkyWings',
    description: 'Select seats and download boarding passes to phone wallet.',
    dateTime: '2026-12-04T18:40',
    priority: 'high',
    category: 'flight',
    isCompleted: false
  },
  {
    id: 'rem-2',
    tripId: 'trip-1',
    tripTitle: 'Winter Romance in Paris',
    title: 'Pack EU Power Adapter & Warm Coat',
    description: 'Forecast shows 4°C - 8°C with light Parisian rain.',
    dateTime: '2026-12-03T10:00',
    priority: 'medium',
    category: 'packing',
    isCompleted: true
  },
  {
    id: 'rem-3',
    tripId: 'trip-1',
    tripTitle: 'Winter Romance in Paris',
    title: 'Louvre Museum Time-Slot Tickets',
    description: 'Timed entry reserved for 10:30 AM. Bring digital ticket barcode.',
    dateTime: '2026-12-07T09:30',
    priority: 'high',
    category: 'custom',
    isCompleted: false
  },
  {
    id: 'rem-4',
    tripId: 'trip-2',
    tripTitle: 'Cherry Blossom Expedition',
    title: 'Activate Japan Rail Pass Voucher',
    description: 'Visit the JR East Travel Service Center upon landing at Narita.',
    dateTime: '2027-03-10T16:00',
    priority: 'medium',
    category: 'train',
    isCompleted: false
  },
  {
    id: 'rem-5',
    tripId: 'trip-1',
    tripTitle: 'Winter Romance in Paris',
    title: 'Hotel Le Marais Check-in Notice',
    description: 'Send late arrival notice if flight delay exceeds 1 hour.',
    dateTime: '2026-12-06T12:00',
    priority: 'low',
    category: 'hotel',
    isCompleted: false
  }
];

export const sampleTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Winter Romance in Paris',
    origin: 'New York, USA',
    destination: 'Paris, France',
    country: 'France',
    startDate: '2026-12-05',
    endDate: '2026-12-12',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    budget: 2800,
    spent: 1240,
    currency: 'USD',
    travelStyle: 'couple',
    notes: 'Hotel booked in Le Marais district. Remember to try fresh croissants at Du Pain et des Idées.',
    weather: {
      temp: 7,
      condition: 'Partly Cloudy',
      icon: 'cloud-sun'
    },
    itinerary: [
      {
        dayNumber: 1,
        date: '2026-12-06',
        title: 'Arrival & Seine Evening Cruise',
        activities: [
          {
            id: 'act-1',
            time: '08:15 AM',
            title: 'Land at Charles de Gaulle Airport (CDG)',
            category: 'flight',
            location: 'Terminal 2E, CDG Airport',
            notes: 'Take RER B or RoissyBus to city centre.',
            cost: 13,
            completed: false
          },
          {
            id: 'act-2',
            time: '01:00 PM',
            title: 'Check-in at Hotel Le Marais Boutique',
            category: 'hotel',
            location: 'Rue des Rosiers, 75004 Paris',
            notes: 'Confirmation #HM-9421',
            cost: 0,
            completed: false
          },
          {
            id: 'act-3',
            time: '06:30 PM',
            title: 'Bateaux-Mouches Seine River Sunset Cruise',
            category: 'sightseeing',
            location: 'Pont de l\'Alma',
            notes: 'View illuminated Eiffel Tower sparkle at 7 PM sharp.',
            cost: 45,
            completed: false
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-12-07',
        title: 'Art, History & Café Culture',
        activities: [
          {
            id: 'act-4',
            time: '09:00 AM',
            title: 'Breakfast at Café de Flore',
            category: 'food',
            location: 'Boulevard Saint-Germain',
            notes: 'Hot chocolate & buttery tartines.',
            cost: 32,
            completed: false
          },
          {
            id: 'act-5',
            time: '10:30 AM',
            title: 'Louvre Masterpieces Tour',
            category: 'sightseeing',
            location: 'Pyramide du Louvre',
            notes: 'Winged Victory, Mona Lisa, and Napoleon Apartments.',
            cost: 40,
            completed: false
          },
          {
            id: 'act-6',
            time: '04:00 PM',
            title: 'Stroll along Tuileries Garden & Montmartre',
            category: 'leisure',
            location: 'Sacré-Cœur, Montmartre',
            notes: 'Catch street artists and sunset panoramic view.',
            cost: 0,
            completed: false
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-12-08',
        title: 'Palace of Versailles Day Trip',
        activities: [
          {
            id: 'act-7',
            time: '09:15 AM',
            title: 'RER C Train to Versailles Château',
            category: 'transport',
            location: 'Paris St-Michel',
            cost: 8,
            completed: false
          },
          {
            id: 'act-8',
            time: '10:45 AM',
            title: 'Hall of Mirrors & Royal Gardens',
            category: 'sightseeing',
            location: 'Place d\'Armes, Versailles',
            cost: 55,
            completed: false
          }
        ]
      }
    ],
    tickets: [
      sampleTickets[0], // Flight
      sampleTickets[3]  // Eurostar
    ],
    packingList: [
      { id: 'p-1', name: 'Passport & International ID', category: 'documents', packed: true },
      { id: 'p-2', name: 'Boarding Pass & Hotel Vouchers', category: 'documents', packed: true },
      { id: 'p-3', name: 'Universal EU Travel Adapter', category: 'electronics', packed: true },
      { id: 'p-4', name: 'Power Bank (10000mAh)', category: 'electronics', packed: true },
      { id: 'p-5', name: 'Warm Overcoat & Wool Scarf', category: 'clothes', packed: false },
      { id: 'p-6', name: 'Comfortable Waterproof Walking Boots', category: 'clothes', packed: false },
      { id: 'p-7', name: 'Thermal Base Layers (x3)', category: 'clothes', packed: true },
      { id: 'p-8', name: 'Compact Windproof Umbrella', category: 'essentials', packed: false },
      { id: 'p-9', name: 'Lip Balm & Moisturizer', category: 'toiletries', packed: true },
      { id: 'p-10', name: 'Prescription Meds & Travel Aspirin', category: 'health', packed: true }
    ],
    expenses: [
      { id: 'e-1', title: 'Roundtrip Flights NYC-CDG', category: 'transport', amount: 490, date: '2026-11-02', paidBy: 'Alex' },
      { id: 'e-2', title: 'Hotel Le Marais (6 Nights Deposit)', category: 'stay', amount: 620, date: '2026-11-05', paidBy: 'Alex' },
      { id: 'e-3', title: 'Louvre & Versailles Advance Pass', category: 'activity', amount: 95, date: '2026-11-10', paidBy: 'Alex' },
      { id: 'e-4', title: 'Travel Insurance', category: 'other', amount: 35, date: '2026-11-12', paidBy: 'Alex' }
    ]
  },
  {
    id: 'trip-2',
    title: 'Cherry Blossom Expedition',
    origin: 'San Francisco, USA',
    destination: 'Tokyo & Kyoto, Japan',
    country: 'Japan',
    startDate: '2027-03-10',
    endDate: '2027-03-22',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    budget: 3500,
    spent: 900,
    currency: 'USD',
    travelStyle: 'solo',
    notes: 'Focus on traditional tea ceremonies, Akihabara tech district, and Gion geisha district.',
    weather: {
      temp: 14,
      condition: 'Sunny & Pleasant',
      icon: 'sun'
    },
    itinerary: [
      {
        dayNumber: 1,
        date: '2027-03-11',
        title: 'Shinjuku Neon & Golden Gai',
        activities: [
          {
            id: 'act-21',
            time: '04:30 PM',
            title: 'Check-in Hotel Gracery Shinjuku (Godzilla Head)',
            category: 'hotel',
            location: 'Shinjuku, Tokyo',
            notes: 'High floor city view room.',
            cost: 0,
            completed: false
          },
          {
            id: 'act-22',
            time: '07:30 PM',
            title: 'Authentic Ramen at Ichiran Shinjuku',
            category: 'food',
            location: 'Kabukicho, Tokyo',
            cost: 18,
            completed: false
          }
        ]
      }
    ],
    tickets: [
      sampleTickets[2],
      sampleTickets[4]
    ],
    packingList: [
      { id: 'p-201', name: 'Passport & Japan Visa Waiver', category: 'documents', packed: true },
      { id: 'p-202', name: 'Suica IC Digital Transit Card', category: 'electronics', packed: false },
      { id: 'p-203', name: 'Slip-on Shoes (for Temple Visits)', category: 'clothes', packed: false },
      { id: 'p-204', name: 'Pocket Wi-Fi Device', category: 'electronics', packed: false }
    ],
    expenses: [
      { id: 'e-201', title: 'JAL Flight SFO - NRT', category: 'transport', amount: 780, date: '2026-11-01', paidBy: 'Alex' },
      { id: 'e-202', title: 'JR Pass 7-Day Voucher', category: 'transport', amount: 120, date: '2026-11-04', paidBy: 'Alex' }
    ]
  },
  {
    id: 'trip-3',
    title: 'Amalfi Coast & Tuscan Hills',
    origin: 'New York, USA',
    destination: 'Positano & Florence, Italy',
    country: 'Italy',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    status: 'completed',
    budget: 4000,
    spent: 3820,
    currency: 'USD',
    travelStyle: 'friends',
    notes: 'Unforgettable boat trip around Capri island and sunset pasta tasting in Positano.',
    itinerary: [],
    tickets: [],
    packingList: [],
    expenses: []
  }
];

export const popularDestinations = [
  {
    city: 'Paris',
    country: 'France',
    tagline: 'City of Light, world-class gastronomy & timeless art',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$180/day',
    flightFrom: '$420'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon hyper-modernity meets ancient shrines & cuisine',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$150/day',
    flightFrom: '$690'
  },
  {
    city: 'Rome',
    country: 'Italy',
    tagline: 'Colosseum wonders, piazzas, and authentic gelato',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$140/day',
    flightFrom: '$480'
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tagline: 'Lush rice terraces, tropical beaches & spiritual temples',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$70/day',
    flightFrom: '$610'
  },
  {
    city: 'New York',
    country: 'USA',
    tagline: 'Broadway shows, Central Park & 24/7 skyline energy',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$230/day',
    flightFrom: '$190'
  },
  {
    city: 'Swiss Alps',
    country: 'Switzerland',
    tagline: 'Glacial lakes, panoramic mountain trains & ski peaks',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
    avgBudget: '$260/day',
    flightFrom: '$530'
  }
];

export const sampleRestaurants: Restaurant[] = [
  // Paris Restaurants
  {
    id: 'rest-paris-1',
    name: 'Le Comptoir du Relais',
    city: 'Paris',
    cuisine: 'Authentic French Bistro & Wine',
    rating: 4.8,
    reviewsCount: 1420,
    priceRange: '$$$',
    distance: '0.3 miles from hotel (6 min walk)',
    address: '9 Carrefour de l\'Odéon, 75006 Paris',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    tag: 'Bib Gourmand & Local Legend',
    signatureDish: 'Duck Confit with Truffle Gratin & Escargots',
    openingHours: '12:00 PM – 11:00 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-paris-2',
    name: 'Benoit Paris (Alain Ducasse)',
    city: 'Paris',
    cuisine: 'Classic French Haute Bistro',
    rating: 4.9,
    reviewsCount: 890,
    priceRange: '$$$$',
    distance: '0.7 miles (Le Marais, near Pompidou)',
    address: '20 Rue Saint-Martin, 75004 Paris',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    tag: '1 Michelin Star',
    signatureDish: 'Seared Scallops, Roasted Veal Chop & Profiteroles',
    openingHours: '12:00 PM – 10:30 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-paris-3',
    name: 'L\'As du Fallafel',
    city: 'Paris',
    cuisine: 'Middle Eastern & Falafel Street Food',
    rating: 4.7,
    reviewsCount: 3200,
    priceRange: '$',
    distance: '0.2 miles (Heart of Jewish Quarter)',
    address: '34 Rue des Rosiers, 75004 Paris',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tag: 'Paris Top Street Food',
    signatureDish: 'Special Pita Falafel with Grilled Eggplant & Tahini',
    openingHours: '11:00 AM – 11:30 PM',
    isOpenNow: true,
    reservationRecommended: false
  },
  {
    id: 'rest-paris-4',
    name: 'Café de Flore',
    city: 'Paris',
    cuisine: 'Iconic Parisian Café & Brasserie',
    rating: 4.6,
    reviewsCount: 2850,
    priceRange: '$$',
    distance: '0.5 miles (Saint-Germain-des-Prés)',
    address: '172 Boulevard Saint-Germain, 75006 Paris',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tag: 'Historic Landmark Café',
    signatureDish: 'Famous Chocolat Chaud Spécial Flore & Croque Monsieur',
    openingHours: '07:30 AM – 01:30 AM',
    isOpenNow: true,
    reservationRecommended: false
  },

  // Tokyo Restaurants
  {
    id: 'rest-tokyo-1',
    name: 'Sushi Sawada Ginza',
    city: 'Tokyo',
    cuisine: 'Traditional Edomae Omakase',
    rating: 4.9,
    reviewsCount: 680,
    priceRange: '$$$$',
    distance: '0.4 miles from Tokyo Station',
    address: 'Ginza 5-Chome, Chuo City, Tokyo',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    tag: '2 Michelin Stars',
    signatureDish: 'Wild Otoro Tuna & Sea Urchin (Uni) Nigiri',
    openingHours: '12:30 PM – 09:30 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-tokyo-2',
    name: 'Afuri Ramen Ebisu',
    city: 'Tokyo',
    cuisine: 'Yuzu Shio Ramen & Craft Gyoza',
    rating: 4.8,
    reviewsCount: 2410,
    priceRange: '$$',
    distance: '0.8 miles from Shibuya Crossing',
    address: '1-1-7 Ebisu, Shibuya City, Tokyo',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    tag: 'Locals Top Ramen',
    signatureDish: 'Yuzu Shio Golden Broth Ramen with Charcoal Pork',
    openingHours: '11:00 AM – 03:00 AM',
    isOpenNow: true,
    reservationRecommended: false
  },
  {
    id: 'rest-tokyo-3',
    name: 'Gonpachi Nishi-Azabu (Kill Bill)',
    city: 'Tokyo',
    cuisine: 'Kushiyaki, Soba & Izakaya',
    rating: 4.7,
    reviewsCount: 3100,
    priceRange: '$$$',
    distance: '1.2 miles from Roppongi Hills',
    address: '1-13-11 Nishi-Azabu, Minato City, Tokyo',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tag: 'Cinematic Dining Experience',
    signatureDish: 'Handmade Soba Noodles & Charcoal Grilled Wagyu Skewers',
    openingHours: '11:30 AM – 02:00 AM',
    isOpenNow: true,
    reservationRecommended: true
  },

  // Rome Restaurants
  {
    id: 'rest-rome-1',
    name: 'Roscioli Salumeria con Cucina',
    city: 'Rome',
    cuisine: 'Roman Trattoria & Artisan Charcuterie',
    rating: 4.9,
    reviewsCount: 2200,
    priceRange: '$$$',
    distance: '0.3 miles from Campo de\' Fiori',
    address: 'Via dei Giubbonari, 21, 00186 Roma',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    tag: 'Rome\'s #1 Carbonara',
    signatureDish: 'Authentic Spaghetti alla Carbonara with Crispy Guanciale',
    openingHours: '12:30 PM – 11:30 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-rome-2',
    name: 'Da Enzo al 29',
    city: 'Rome',
    cuisine: 'Traditional Trastevere Trattoria',
    rating: 4.8,
    reviewsCount: 2900,
    priceRange: '$$',
    distance: '0.5 miles (Heart of Trastevere)',
    address: 'Via dei Vascellari, 29, 00153 Roma',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tag: 'Beloved Roman Classic',
    signatureDish: 'Cacio e Pepe & Fried Artichoke (Carciofi alla Giudia)',
    openingHours: '12:15 PM – 11:00 PM',
    isOpenNow: true,
    reservationRecommended: true
  },

  // Bali Restaurants
  {
    id: 'rest-bali-1',
    name: 'Locavore NXT Ubud',
    city: 'Bali',
    cuisine: 'Progressive Indonesian Farm-to-Table',
    rating: 4.9,
    reviewsCount: 1540,
    priceRange: '$$$$',
    distance: '0.6 miles from Ubud Monkey Forest',
    address: 'Jl. Dewi Sita No.10, Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tag: 'Asia\'s 50 Best Restaurants',
    signatureDish: '18-Course Hyper-Local Tasting Menu & Roasted Heritage Pork',
    openingHours: '05:30 PM – 11:00 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-bali-2',
    name: 'La Lucciola Seminyak',
    city: 'Bali',
    cuisine: 'Beachfront Mediterranean & Italian',
    rating: 4.7,
    reviewsCount: 2100,
    priceRange: '$$$',
    distance: 'Beachfront Petitenget Beach',
    address: 'Pantai Petitenget, Seminyak, Bali',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tag: 'Best Sunset Beachfront',
    signatureDish: 'Pan-Seared Coral Trout with Salsa Verde & Coconut Tiramisu',
    openingHours: '09:00 AM – 11:00 PM',
    isOpenNow: true,
    reservationRecommended: true
  },

  // New York Restaurants
  {
    id: 'rest-nyc-1',
    name: 'Gramercy Tavern',
    city: 'New York',
    cuisine: 'Contemporary American Seasonal',
    rating: 4.8,
    reviewsCount: 3400,
    priceRange: '$$$$',
    distance: '0.4 miles from Union Square',
    address: '42 E 20th St, New York, NY 10003',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    tag: '1 Michelin Star & NYC Icon',
    signatureDish: 'Wood-Fired Duck Breast & Warm Chocolate Bread Pudding',
    openingHours: '11:30 AM – 11:00 PM',
    isOpenNow: true,
    reservationRecommended: true
  },
  {
    id: 'rest-nyc-2',
    name: 'Joe\'s Pizza Greenwich Village',
    city: 'New York',
    cuisine: 'Legendary NYC Thin-Crust Pizza',
    rating: 4.8,
    reviewsCount: 5200,
    priceRange: '$',
    distance: '0.2 miles from Washington Square Park',
    address: '7 Carmine St, New York, NY 10014',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    tag: 'NYC\'s Most Famous Slice',
    signatureDish: 'Classic Fresh Mozzarella & Pepperoni Thin Slice',
    openingHours: '10:00 AM – 03:00 AM',
    isOpenNow: true,
    reservationRecommended: false
  }
];

export const getNearbyRestaurants = (destination: string): Restaurant[] => {
  const destLower = (destination || '').toLowerCase();
  
  // Find matching city
  const matched = sampleRestaurants.filter((r) => 
    destLower.includes(r.city.toLowerCase()) || 
    r.city.toLowerCase().includes(destLower)
  );

  if (matched.length > 0) {
    return matched;
  }

  // Smart fallback generator for any custom destination entered by traveler
  const cityName = destination.split(',')[0].trim() || 'City Centre';
  return [
    {
      id: `rest-${cityName}-1`,
      name: `Le Petit Bistro de ${cityName}`,
      city: cityName,
      cuisine: 'Local Heritage & Fine Dining',
      rating: 4.9,
      reviewsCount: 420,
      priceRange: '$$$',
      distance: '0.4 miles from central square (8 min walk)',
      address: `12 Grand Avenue, ${cityName}`,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      tag: 'Chef\'s Recommended Table',
      signatureDish: `Locally Sourced Seasonal Tasting Menu & Wine Pairing`,
      openingHours: '12:00 PM – 10:30 PM',
      isOpenNow: true,
      reservationRecommended: true
    },
    {
      id: `rest-${cityName}-2`,
      name: `${cityName} Artisanal Roastery & Kitchen`,
      city: cityName,
      cuisine: 'Breakfast, Brunch & Specialty Coffee',
      rating: 4.8,
      reviewsCount: 680,
      priceRange: '$$',
      distance: '0.2 miles from main hotel (4 min walk)',
      address: `5 Market Lane, ${cityName}`,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      tag: 'Locals\' Morning Favorite',
      signatureDish: 'Sourdough French Toast, Truffle Eggs & Cold Brew',
      openingHours: '08:00 AM – 06:00 PM',
      isOpenNow: true,
      reservationRecommended: false
    },
    {
      id: `rest-${cityName}-3`,
      name: `Trattoria Panoramica ${cityName}`,
      city: cityName,
      cuisine: 'Handmade Pasta & Wood-Fired Specialties',
      rating: 4.7,
      reviewsCount: 890,
      priceRange: '$$',
      distance: '0.6 miles (Sunset View Terrace)',
      address: `24 Hillside Way, ${cityName}`,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      tag: 'Panoramic Sunset Dining',
      signatureDish: 'Fresh Handmade Tagliatelle with Wild Mushrooms & Gelato',
      openingHours: '12:30 PM – 11:00 PM',
      isOpenNow: true,
      reservationRecommended: true
    }
  ];
};

