import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { TravelTicket } from '../types';
import { 
  X, 
  Plane, 
  Train, 
  Bus, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Calendar, 
  Clock, 
  User as UserIcon,
  ShieldCheck,
  Download,
  Share2,
  Luggage,
  Utensils,
  ChevronRight,
  Printer,
  Sparkles,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

interface BookingModalProps {
  ticket: TravelTicket | null;
  isOpen: boolean;
  onClose: () => void;
  targetTripId?: string;
}

const CABIN_CLASSES = [
  { id: 'Economy', name: 'Standard Economy', priceAdd: 0, perks: 'Standard legroom, 1 carry-on' },
  { id: 'Premium Economy', name: 'Premium Economy', priceAdd: 45, perks: '+5" legroom, priority boarding, extra bag' },
  { id: 'Business', name: 'Business / First', priceAdd: 180, perks: 'Lie-flat / extra-wide seat, lounge access, dining' },
];

const SEAT_ROWS = [
  { row: '1', seats: ['A', 'B', 'C', 'D'] },
  { row: '2', seats: ['A', 'B', 'C', 'D'] },
  { row: '3', seats: ['A', 'B', 'C', 'D'] },
  { row: '4', seats: ['A', 'B', 'C', 'D'] },
  { row: '5', seats: ['A', 'B', 'C', 'D'] },
];

const OCCUPIED_SEATS = ['1B', '2A', '3C', '4D', '5B'];

export const BookingModal: React.FC<BookingModalProps> = ({
  ticket,
  isOpen,
  onClose,
  targetTripId
}) => {
  const { trips, bookTicket } = useTrips();
  const { user } = useAuth();

  // Booking Steps: 1: Seat & Cabin Class, 2: Passenger Details, 3: Confirmed Boarding Pass
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Selection states
  const [selectedSeat, setSelectedSeat] = useState<string>('3A');
  const [selectedClass, setSelectedClass] = useState<string>('Economy');
  const [passengerName, setPassengerName] = useState(user?.name || 'Alex Morgan');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'alex.morgan@example.com');
  const [passengerPhone, setPassengerPhone] = useState('+1 (555) 234-5678');
  const [passengerPassport, setPassengerPassport] = useState('P849201948');
  const [selectedMeal, setSelectedMeal] = useState('Standard Gourmet');
  const [selectedTripId, setSelectedTripId] = useState(targetTripId || (trips[0]?.id || ''));
  const [addExtraBaggage, setAddExtraBaggage] = useState(false);
  
  const [confirmedTicket, setConfirmedTicket] = useState<TravelTicket | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !ticket) return null;

  // Calculate dynamic price
  const classObj = CABIN_CLASSES.find((c) => c.id === selectedClass) || CABIN_CLASSES[0];
  const totalPrice = ticket.price + classObj.priceAdd + (addExtraBaggage ? 30 : 0);

  const handleProceedToDetails = () => {
    setCurrentStep(2);
  };

  const handleConfirmReservation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const flightNum = ticket.flightNumber || (ticket.type === 'flight' ? 'SW-742' : ticket.type === 'train' ? 'ES-910' : 'FX-302');
      const bookedData: TravelTicket = {
        ...ticket,
        price: totalPrice,
        travelClass: selectedClass,
        seat: `${selectedSeat} (${selectedClass})`,
        passengerName,
        passengerEmail,
        passengerPassport,
        mealPreference: selectedMeal,
        baggageAllowance: addExtraBaggage ? '2 Checked Bags (23kg each)' : '1 Carry-on + 1 Personal Item',
        flightNumber: flightNum,
        status: 'confirmed',
        bookingRef: 'TM-' + Math.floor(100000 + Math.random() * 900000)
      };

      bookTicket(bookedData, selectedTripId || undefined);
      setConfirmedTicket(bookedData);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 800);
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-500" />;
      case 'train':
        return <Train className="w-5 h-5 text-emerald-500" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-500" />;
      default:
        return <Plane className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 my-6 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 text-white relative">
          <button
            onClick={() => {
              setCurrentStep(1);
              setConfirmedTicket(null);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              {getTransportIcon(ticket.type)}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-100">
              {ticket.type.toUpperCase()} Booking & Seat Reservation
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{ticket.provider}</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                {ticket.origin} → {ticket.destination} • {ticket.departureDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-blue-200">Total Price</p>
              <p className="text-2xl font-black">${totalPrice}</p>
            </div>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20 text-xs font-semibold">
            <span className={`px-2.5 py-0.5 rounded-full ${currentStep === 1 ? 'bg-white text-blue-700 font-bold' : 'bg-white/20 text-white'}`}>
              1. Seat & Class
            </span>
            <span className="text-white/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full ${currentStep === 2 ? 'bg-white text-blue-700 font-bold' : 'bg-white/20 text-white'}`}>
              2. Passenger Info
            </span>
            <span className="text-white/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full ${currentStep === 3 ? 'bg-white text-blue-700 font-bold' : 'bg-white/20 text-white'}`}>
              3. Boarding Pass
            </span>
          </div>
        </div>

        {/* STEP 1: Seat Selection & Travel Class */}
        {currentStep === 1 && (
          <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Travel Class Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Choose Cabin / Travel Class
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CABIN_CLASSES.map((cabin) => (
                  <div
                    key={cabin.id}
                    onClick={() => setSelectedClass(cabin.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedClass === cabin.id
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{cabin.name}</span>
                        {cabin.priceAdd > 0 ? (
                          <span className="text-[11px] font-bold text-blue-600">+${cabin.priceAdd}</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400">Included</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">{cabin.perks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Seat Selection Grid */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Interactive Seat Map ({ticket.type === 'flight' ? 'Aircraft Cabin' : ticket.type === 'train' ? 'Train Coach' : 'Bus Seating'})
                  </h4>
                  <p className="text-[11px] text-slate-500">Selected Seat: <strong className="text-blue-600 text-xs font-bold">{selectedSeat}</strong></p>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-white border border-slate-300"></span> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-600"></span> Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-300"></span> Occupied
                  </span>
                </div>
              </div>

              {/* Cabin Seat Grid Layout */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 max-w-sm mx-auto">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                  <span className="w-8 text-center">Window A</span>
                  <span className="w-8 text-center">Aisle B</span>
                  <span className="w-6 text-center text-slate-300">Aisle</span>
                  <span className="w-8 text-center">Aisle C</span>
                  <span className="w-8 text-center">Window D</span>
                </div>

                <div className="space-y-2 pt-2">
                  {SEAT_ROWS.map((rowObj) => (
                    <div key={rowObj.row} className="flex items-center justify-between px-2">
                      {/* Left seats A and B */}
                      <div className="flex gap-1.5">
                        {['A', 'B'].map((letter) => {
                          const seatCode = `${rowObj.row}${letter}`;
                          const isOccupied = OCCUPIED_SEATS.includes(seatCode);
                          const isSelected = selectedSeat === seatCode;

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatCode)}
                              className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all ${
                                isOccupied
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-500/40 shadow-sm scale-105'
                                  : 'bg-white border border-slate-300 hover:border-blue-500 text-slate-700'
                              }`}
                            >
                              {seatCode}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row number in aisle */}
                      <span className="w-6 text-center text-[10px] font-bold text-slate-400">
                        R{rowObj.row}
                      </span>

                      {/* Right seats C and D */}
                      <div className="flex gap-1.5">
                        {['C', 'D'].map((letter) => {
                          const seatCode = `${rowObj.row}${letter}`;
                          const isOccupied = OCCUPIED_SEATS.includes(seatCode);
                          const isSelected = selectedSeat === seatCode;

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatCode)}
                              className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all ${
                                isOccupied
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-500/40 shadow-sm scale-105'
                                  : 'bg-white border border-slate-300 hover:border-blue-500 text-slate-700'
                              }`}
                            >
                              {seatCode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Journey Options: Meal & Baggage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Complimentary Meal
                </label>
                <select
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Standard Gourmet">Standard Chef's Selection</option>
                  <option value="Vegetarian Lacto-Ovo">Vegetarian / Vegan</option>
                  <option value="Gluten-Free Friendly">Gluten-Free</option>
                  <option value="Halal Certified">Halal Certified</option>
                  <option value="Kosher Certified">Kosher Certified</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Add 23kg Checked Bag</p>
                    <p className="text-[10px] text-slate-500">+$30 USD</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={addExtraBaggage}
                  onChange={(e) => setAddExtraBaggage(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceedToDetails}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <span>Continue to Passenger Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Passenger Details & Trip Attachment */}
        {currentStep === 2 && (
          <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name (Must match official ID/Passport)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email (E-Ticket Delivery)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile (Flight Alert SMS)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passport / National ID Number
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={passengerPassport}
                  onChange={(e) => setPassengerPassport(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Associate with Planned Trip */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attach Booking to Trip Itinerary
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                <option value="">-- Standalone Ticket (Not attached) --</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.title} ({trip.destination})
                  </option>
                ))}
              </select>
            </div>

            {/* Reservation Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Selected Seat & Class:</span>
                <span className="font-bold text-slate-900">{selectedSeat} ({selectedClass})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Baggage:</span>
                <span className="font-semibold text-slate-800">{addExtraBaggage ? 'Included + 1 Extra 23kg Bag' : 'Standard Carry-on'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Meal Plan:</span>
                <span className="font-semibold text-slate-800">{selectedMeal}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount Due:</span>
                <span className="text-blue-600 text-base font-black">${totalPrice}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 active:scale-95 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isProcessing ? 'Confirming Ticket...' : `Pay & Issue Boarding Pass ($${totalPrice})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed Boarding Pass & E-Ticket Preview */}
        {currentStep === 3 && confirmedTicket && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Boarding Pass Card */}
            <div className="border border-blue-200 bg-gradient-to-b from-blue-50/70 via-white to-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed & Ready</span>
              </div>

              {/* Carrier & PNR header */}
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    {getTransportIcon(confirmedTicket.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{confirmedTicket.provider}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">{confirmedTicket.travelClass || 'Economy'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</p>
                  <p className="text-base font-black text-blue-600 font-mono tracking-wider">{confirmedTicket.bookingRef}</p>
                </div>
              </div>

              {/* Passenger & Flight # */}
              <div className="grid grid-cols-2 gap-3 py-3 border-b border-dashed border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Passenger</p>
                  <p className="font-extrabold text-slate-900">{confirmedTicket.passengerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Vehicle / Flight #</p>
                  <p className="font-extrabold text-slate-900 font-mono">{confirmedTicket.flightNumber || 'SW-742'}</p>
                </div>
              </div>

              {/* Departure & Arrival Schedule */}
              <div className="grid grid-cols-3 gap-2 py-4 border-b border-dashed border-slate-200 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Departing</p>
                  <p className="text-base font-black text-slate-900">{confirmedTicket.departureTime}</p>
                  <p className="text-xs font-bold text-slate-700">{confirmedTicket.originCode || 'DEP'}</p>
                  <p className="text-[10px] text-slate-400">{confirmedTicket.departureDate}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] text-blue-600 font-bold">{confirmedTicket.duration}</span>
                  <div className="w-16 h-0.5 bg-blue-300 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600 absolute -top-[3px] right-0"></div>
                  </div>
                  <span className="text-[9px] text-slate-400">{confirmedTicket.stops === 0 ? 'Direct Route' : `${confirmedTicket.stops} Stop`}</span>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Arriving</p>
                  <p className="text-base font-black text-slate-900">{confirmedTicket.arrivalTime}</p>
                  <p className="text-xs font-bold text-slate-700">{confirmedTicket.destinationCode || 'ARR'}</p>
                  <p className="text-[10px] text-slate-400">{confirmedTicket.arrivalDate}</p>
                </div>
              </div>

              {/* Seat, Gate & QR Code */}
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Seat & Gate</p>
                  <p className="text-sm font-black text-slate-900">{confirmedTicket.seat}</p>
                  <p className="text-xs text-slate-500 font-medium">{confirmedTicket.gateOrPlatform || 'Gate B12 (Terminal 2)'}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1.5 shadow-inner">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Notification Confirmation Banner */}
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">TripMate Automated Departure Alert Scheduled</p>
                <p className="text-emerald-700 mt-0.5">
                  We've automatically added a departure reminder for {confirmedTicket.departureDate} at {confirmedTicket.departureTime}.
                </p>
              </div>
            </div>

            {/* Actions: Print and Close */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedTicket(null);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Done & View Trips
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
