import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, TravelTicket, Reminder, Activity, PackingItem, ExpenseItem } from '../types';
import { sampleTrips, sampleReminders, sampleTickets } from '../data/mockData';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface AddTripOptions {
  autoGenerateItinerary?: boolean;
}

interface TripContextType {
  trips: Trip[];
  reminders: Reminder[];
  tickets: TravelTicket[];
  toasts: Toast[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Trip operations
  addTrip: (newTrip: Omit<Trip, 'id' | 'itinerary' | 'tickets' | 'packingList' | 'expenses' | 'spent'>, options?: AddTripOptions) => string;
  updateTrip: (id: string, tripData: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  getTrip: (id: string) => Trip | undefined;
  
  // Itinerary operations
  addActivity: (tripId: string, dayNumber: number, activity: Omit<Activity, 'id'>) => void;
  toggleActivity: (tripId: string, dayNumber: number, activityId: string) => void;
  deleteActivity: (tripId: string, dayNumber: number, activityId: string) => void;
  
  // Packing list
  togglePackingItem: (tripId: string, itemId: string) => void;
  addPackingItem: (tripId: string, name: string, category: PackingItem['category']) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;
  
  // Expenses
  addExpense: (tripId: string, expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
  
  // Tickets & Booking
  bookTicket: (ticket: TravelTicket, tripId?: string) => void;
  searchTickets: (type?: string, origin?: string, destination?: string, date?: string) => TravelTicket[];
  
  // Reminders
  addReminder: (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  snoozeReminder: (id: string, hours: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('tripmate_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return sampleTrips;
      }
    }
    return sampleTrips;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('tripmate_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return sampleReminders;
      }
    }
    return sampleReminders;
  });

  const [tickets, setTickets] = useState<TravelTicket[]>(() => {
    const saved = localStorage.getItem('tripmate_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return sampleTickets;
      }
    }
    return sampleTickets;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('tripmate_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('tripmate_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('tripmate_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getTrip = (id: string) => {
    return trips.find((t) => t.id === id);
  };

  const addTrip = (
    tripData: Omit<Trip, 'id' | 'itinerary' | 'tickets' | 'packingList' | 'expenses' | 'spent'>,
    options?: AddTripOptions
  ): string => {
    const id = 'trip-' + Date.now();
    
    // Generate day itineraries based on dates
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
    
    const shouldAutoPopulate = options?.autoGenerateItinerary !== false;

    const itinerary = Array.from({ length: Math.min(dayCount, 14) }, (_, index) => {
      const d = new Date(start);
      d.setDate(d.getDate() + index);

      const activities: Activity[] = [];
      if (shouldAutoPopulate) {
        if (index === 0) {
          activities.push(
            {
              id: 'act-' + Math.random(),
              time: '11:00 AM',
              title: `Arrive in ${tripData.destination}`,
              category: 'transport',
              location: `${tripData.destination} Main Terminal`,
              notes: 'Pick up luggage and transit to accommodation',
              completed: false
            },
            {
              id: 'act-' + Math.random(),
              time: '02:00 PM',
              title: 'Check in to Hotel & Unpack',
              category: 'hotel',
              location: tripData.destination,
              notes: 'Freshen up and unpack essentials',
              completed: false
            },
            {
              id: 'act-' + Math.random(),
              time: '07:00 PM',
              title: 'Welcome Dinner & City Orientation',
              category: 'food',
              location: 'City Centre',
              notes: 'Sample local cuisine and evening stroll',
              cost: 45,
              completed: false
            }
          );
        } else if (index === 1) {
          activities.push(
            {
              id: 'act-' + Math.random(),
              time: '09:30 AM',
              title: 'Top Landmarks & Sightseeing Tour',
              category: 'sightseeing',
              location: tripData.destination,
              notes: 'Visit historical highlights and photo spots',
              cost: 30,
              completed: false
            },
            {
              id: 'act-' + Math.random(),
              time: '01:00 PM',
              title: 'Authentic Local Café Lunch',
              category: 'food',
              location: 'Old Town District',
              cost: 25,
              completed: false
            }
          );
        }
      }

      return {
        dayNumber: index + 1,
        date: d.toISOString().split('T')[0],
        title: index === 0 ? 'Arrival & City Orientation' : index === 1 ? 'Landmarks & Cultural Immersion' : `Day ${index + 1} Exploration`,
        activities
      };
    });

    const defaultPacking: PackingItem[] = [
      { id: 'p-' + Math.random(), name: 'Passport / Travel ID & Visa Docs', category: 'documents', packed: false },
      { id: 'p-' + Math.random(), name: 'Boarding Passes & Hotel Vouchers', category: 'documents', packed: false },
      { id: 'p-' + Math.random(), name: 'Universal Travel Power Adapter', category: 'electronics', packed: false },
      { id: 'p-' + Math.random(), name: 'High-Capacity Power Bank', category: 'electronics', packed: false },
      { id: 'p-' + Math.random(), name: 'Comfortable Waterproof Walking Shoes', category: 'clothes', packed: false },
      { id: 'p-' + Math.random(), name: 'Weather-Appropriate Clothing Layers', category: 'clothes', packed: false },
      { id: 'p-' + Math.random(), name: 'Travel Toothbrush & Toiletries', category: 'toiletries', packed: false },
      { id: 'p-' + Math.random(), name: 'Essential Medications & First-Aid', category: 'health', packed: false },
      { id: 'p-' + Math.random(), name: 'Compact Umbrella or Rain Jacket', category: 'essentials', packed: false }
    ];

    const newTrip: Trip = {
      ...tripData,
      id,
      spent: 0,
      itinerary,
      tickets: [],
      packingList: defaultPacking,
      expenses: []
    };

    setTrips((prev) => [newTrip, ...prev]);

    // Automatically generate smart travel reminders
    const checkinDate = new Date(start);
    checkinDate.setHours(checkinDate.getHours() - 24);
    
    const packingDate = new Date(start);
    packingDate.setDate(packingDate.getDate() - 2);

    addReminder({
      tripId: id,
      tripTitle: newTrip.title,
      title: `✈️ Web Check-in: ${newTrip.title}`,
      description: `Online check-in opens 24h prior to departure to ${newTrip.destination}. Select seats & download boarding passes.`,
      dateTime: checkinDate.toISOString().slice(0, 16),
      priority: 'high',
      category: 'flight'
    });

    addReminder({
      tripId: id,
      tripTitle: newTrip.title,
      title: `🧳 Finalize Packing for ${newTrip.destination}`,
      description: 'Review your packing checklist: travel documents, electronics, adaptors, and weather attire.',
      dateTime: packingDate.toISOString().slice(0, 16),
      priority: 'medium',
      category: 'packing'
    });

    showToast(`Trip to ${newTrip.destination} planned successfully!`, 'success');
    return id;
  };

  const updateTrip = (id: string, tripData: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...tripData } : t)));
    showToast('Trip details updated successfully', 'info');
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setReminders((prev) => prev.filter((r) => r.tripId !== id));
    showToast('Trip deleted', 'warning');
  };

  const addActivity = (tripId: string, dayNumber: number, activity: Omit<Activity, 'id'>) => {
    const actId = 'act-' + Date.now();
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const newItinerary = t.itinerary.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: [...day.activities, { ...activity, id: actId, completed: false }]
          };
        });
        return { ...t, itinerary: newItinerary };
      })
    );
    showToast(`Added activity "${activity.title}"`, 'success');
  };

  const toggleActivity = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const newItinerary = t.itinerary.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.id === activityId ? { ...act, completed: !act.completed } : act
            )
          };
        });
        return { ...t, itinerary: newItinerary };
      })
    );
  };

  const deleteActivity = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const newItinerary = t.itinerary.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.filter((act) => act.id !== activityId)
          };
        });
        return { ...t, itinerary: newItinerary };
      })
    );
    showToast('Activity removed', 'info');
  };

  const togglePackingItem = (tripId: string, itemId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          packingList: t.packingList.map((item) =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
          )
        };
      })
    );
  };

  const addPackingItem = (tripId: string, name: string, category: PackingItem['category']) => {
    const newItem: PackingItem = {
      id: 'p-' + Date.now(),
      name,
      category,
      packed: false
    };
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          packingList: [...t.packingList, newItem]
        };
      })
    );
    showToast(`Added "${name}" to packing checklist`, 'success');
  };

  const deletePackingItem = (tripId: string, itemId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          packingList: t.packingList.filter((item) => item.id !== itemId)
        };
      })
    );
  };

  const addExpense = (tripId: string, expense: Omit<ExpenseItem, 'id'>) => {
    const newExp: ExpenseItem = {
      ...expense,
      id: 'e-' + Date.now()
    };
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const newSpent = (t.spent || 0) + expense.amount;
        return {
          ...t,
          spent: newSpent,
          expenses: [newExp, ...t.expenses]
        };
      })
    );
    showToast(`Expense of ${expense.amount} added`, 'success');
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const found = t.expenses.find((e) => e.id === expenseId);
        const diff = found ? found.amount : 0;
        return {
          ...t,
          spent: Math.max(0, (t.spent || 0) - diff),
          expenses: t.expenses.filter((e) => e.id !== expenseId)
        };
      })
    );
    showToast('Expense removed', 'info');
  };

  const bookTicket = (ticket: TravelTicket, tripId?: string) => {
    const bookedTicket: TravelTicket = {
      ...ticket,
      id: 'ticket-' + Date.now(),
      status: 'confirmed',
      bookingRef: ticket.bookingRef || 'TM-' + Math.floor(100000 + Math.random() * 900000),
      tripId
    };

    setTickets((prev) => [bookedTicket, ...prev]);

    if (tripId) {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id !== tripId) return t;
          return {
            ...t,
            tickets: [...t.tickets, bookedTicket],
            spent: (t.spent || 0) + bookedTicket.price
          };
        })
      );
    }

    // Add automatic departure reminder for this ticket
    const depDateTime = `${bookedTicket.departureDate}T${bookedTicket.departureTime.includes('PM') || bookedTicket.departureTime.includes('AM') ? '08:00' : bookedTicket.departureTime}`;
    addReminder({
      tripId,
      tripTitle: bookedTicket.provider,
      title: `${bookedTicket.type.toUpperCase()}: ${bookedTicket.origin} to ${bookedTicket.destination}`,
      description: `Gate/Platform: ${bookedTicket.gateOrPlatform || 'TBA'} | Seat: ${bookedTicket.seat || 'Assigned'} | Ref: ${bookedTicket.bookingRef}`,
      dateTime: depDateTime,
      priority: 'high',
      category: bookedTicket.type
    });

    showToast(`Confirmed ticket with ${bookedTicket.provider}! Ref: ${bookedTicket.bookingRef}`, 'success');
  };

  const searchTickets = (type?: string, origin?: string, destination?: string) => {
    return sampleTickets.filter((item) => {
      const matchType = !type || type === 'all' || item.type === type;
      const matchOrigin = !origin || item.origin.toLowerCase().includes(origin.toLowerCase()) || (item.originCode && item.originCode.toLowerCase().includes(origin.toLowerCase()));
      const matchDest = !destination || item.destination.toLowerCase().includes(destination.toLowerCase()) || (item.destinationCode && item.destinationCode.toLowerCase().includes(destination.toLowerCase()));
      return matchType && (matchOrigin || matchDest || (!origin && !destination));
    });
  };

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'isCompleted'>) => {
    const newRem: Reminder = {
      ...reminderData,
      id: 'rem-' + Date.now() + Math.random().toString().slice(2, 6),
      isCompleted: false
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast(`Reminder created: "${reminderData.title}"`, 'info');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newState = !r.isCompleted;
          if (newState) {
            showToast(`Completed: ${r.title}`, 'success');
          }
          return { ...r, isCompleted: newState };
        }
        return r;
      })
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder deleted', 'info');
  };

  const snoozeReminder = (id: string, hours: number) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const currentDate = new Date(r.dateTime);
          currentDate.setHours(currentDate.getHours() + hours);
          const newDateTime = currentDate.toISOString().slice(0, 16);
          showToast(`Snoozed "${r.title}" for ${hours} hour${hours > 1 ? 's' : ''}`, 'info');
          return {
            ...r,
            dateTime: newDateTime,
            snoozedUntil: newDateTime
          };
        }
        return r;
      })
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        reminders,
        tickets,
        toasts,
        showToast,
        removeToast,
        addTrip,
        updateTrip,
        deleteTrip,
        getTrip,
        addActivity,
        toggleActivity,
        deleteActivity,
        togglePackingItem,
        addPackingItem,
        deletePackingItem,
        addExpense,
        deleteExpense,
        bookTicket,
        searchTickets,
        addReminder,
        toggleReminder,
        deleteReminder,
        snoozeReminder
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
