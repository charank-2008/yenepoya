import React, { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Sparkles, 
  Image as ImageIcon,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Wand2,
  Bot,
  Loader2
} from 'lucide-react';
import { generateItineraryWithGemini, isGeminiConfigured } from '../services/geminiService';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (tripId: string) => void;
}

const PRESET_COVERS = [
  {
    name: 'Paris',
    city: 'Paris',
    country: 'France',
    currency: 'EUR',
    budget: 2400,
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    budget: 3200,
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Bali Beach',
    city: 'Bali',
    country: 'Indonesia',
    currency: 'USD',
    budget: 1500,
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Swiss Alps',
    city: 'Zurich / Zermatt',
    country: 'Switzerland',
    currency: 'EUR',
    budget: 3500,
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'New York',
    city: 'New York',
    country: 'USA',
    currency: 'USD',
    budget: 2800,
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Rome',
    city: 'Rome',
    country: 'Italy',
    currency: 'EUR',
    budget: 2200,
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80'
  }
];

const QUICK_DESTINATIONS = [
  { city: 'Paris', country: 'France', flag: '🇫🇷', coverIdx: 0 },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', coverIdx: 1 },
  { city: 'Bali', country: 'Indonesia', flag: '🇮🇩', coverIdx: 2 },
  { city: 'Swiss Alps', country: 'Switzerland', flag: '🇨🇭', coverIdx: 3 },
  { city: 'New York', country: 'USA', flag: '🇺🇸', coverIdx: 4 },
  { city: 'Rome', country: 'Italy', flag: '🇮🇹', coverIdx: 5 },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onTripCreated
}) => {
  const { addTrip, updateTrip, showToast } = useTrips();

  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('New York, USA');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [budget, setBudget] = useState('2000');
  const [currency, setCurrency] = useState('USD');
  const [travelStyle, setTravelStyle] = useState('solo');
  const [companionsCount, setCompanionsCount] = useState('1');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [autoGenerateItinerary, setAutoGenerateItinerary] = useState(true);
  const [useGeminiAI, setUseGeminiAI] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Calculate days & nights count
  const tripDuration = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
    const nights = Math.max(0, days - 1);
    return { days: Math.max(1, days), nights };
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const handleSelectQuickDestination = (dest: typeof QUICK_DESTINATIONS[0]) => {
    setDestination(`${dest.city}, ${dest.country}`);
    setCountry(dest.country);
    setTitle(`${dest.city} Discovery Tour`);
    const preset = PRESET_COVERS[dest.coverIdx];
    if (preset) {
      setCoverImage(preset.url);
      setCurrency(preset.currency);
      setBudget(preset.budget.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeCover = customCoverUrl.trim() || coverImage;
    const finalDest = destination.trim() || 'Exciting Destination';
    const finalTitle = title.trim() || `Journey to ${finalDest}`;
    const days = tripDuration ? tripDuration.days : 7;

    const tripId = addTrip(
      {
        title: finalTitle,
        origin: origin.trim() || 'Hometown',
        destination: finalDest,
        country: country.trim() || finalDest.split(',')[1]?.trim() || 'Global',
        startDate,
        endDate,
        coverImage: activeCover,
        status: 'upcoming',
        budget: Number(budget) || 1500,
        currency,
        travelStyle,
        companionsCount: Number(companionsCount) || 1,
        notes: notes.trim(),
        weather: {
          temp: 21,
          condition: 'Partly Sunny',
          icon: 'sun'
        }
      },
      { autoGenerateItinerary: !useGeminiAI }
    );

    // If Gemini AI generation is active, trigger generation
    if (useGeminiAI && isGeminiConfigured) {
      setIsGeneratingAI(true);
      try {
        const aiDays = await generateItineraryWithGemini({
          destination: finalDest,
          durationDays: Math.min(days, 10),
          travelStyle,
          budget: Number(budget) || 1500,
          currency,
          notes: notes.trim()
        });

        if (aiDays && Array.isArray(aiDays) && aiDays.length > 0) {
          const formattedItinerary = aiDays.map((d, index) => {
            const dateObj = new Date(startDate);
            dateObj.setDate(dateObj.getDate() + index);
            return {
              dayNumber: d.dayNumber || (index + 1),
              date: dateObj.toISOString().split('T')[0],
              title: d.title || `Day ${index + 1} Discovery`,
              activities: (d.activities || []).map((act: any) => ({
                id: 'act-' + Math.random(),
                time: act.time || '10:00 AM',
                title: act.title || 'Sightseeing',
                category: act.category || 'sightseeing',
                location: act.location || finalDest,
                notes: act.notes || '',
                cost: act.cost || 0,
                completed: false
              }))
            };
          });

          updateTrip(tripId, { itinerary: formattedItinerary });
          showToast(`Gemini AI generated customized itinerary for ${finalDest}!`, 'success');
        }
      } catch (err) {
        console.warn('Gemini auto-generation fallback used:', err);
      } finally {
        setIsGeneratingAI(false);
      }
    }

    onClose();
    if (onTripCreated) {
      onTripCreated(tripId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 my-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Compass className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-100">
              Trip Planner Pro
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Plan a Complete Trip</h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Build day-by-day itineraries, organize tickets, and schedule smart travel reminders in one place.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Destination Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Popular Destinations (1-Click Auto-Fill)</span>
              <span className="text-[11px] text-blue-600 font-semibold">Tap to pre-fill</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_DESTINATIONS.map((dest) => (
                <button
                  type="button"
                  key={dest.city}
                  onClick={() => handleSelectQuickDestination(dest)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/80 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <span>{dest.flag}</span>
                  <span>{dest.city}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trip Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Trip Name / Title
            </label>
            <input
              type="text"
              placeholder="e.g. 7 Days in Paris & Versailles, Summer in Bali"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Starting Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. New York, USA"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Destination (City, Country)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Travel Dates & Duration Badge */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Live Duration pill */}
            {tripDuration && (
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Trip Duration: {tripDuration.nights} Night{tripDuration.nights === 1 ? '' : 's'} / {tripDuration.days} Day{tripDuration.days === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>

          {/* Budget, Currency & Travel Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Budget
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple / Romance</option>
                <option value="friends">Friends Adventure</option>
                <option value="family">Family Trip</option>
                <option value="business">Business / Work</option>
              </select>
            </div>
          </div>

          {/* Gemini AI Auto-Generate Checklist & Itinerary */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <input
              type="checkbox"
              id="geminiAICheck"
              checked={useGeminiAI}
              onChange={(e) => setUseGeminiAI(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="geminiAICheck" className="cursor-pointer text-xs leading-relaxed text-slate-700">
              <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI-Powered Itinerary (Gemini Flash AI)</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </strong>
              Tailors custom daily visits, hidden gems, and local dining spots based on your destination and travel style.
            </label>
          </div>

          {/* Cover Photo Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Trip Photography
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_COVERS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCoverUrl('');
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                    coverImage === preset.url && !customCoverUrl
                      ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold text-center py-0.5">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <div className="mt-3">
              <input
                type="url"
                placeholder="Or paste a custom image URL (Unsplash, etc.)"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Trip Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes & Trip Goals
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Try authentic ramen, buy museum passes early, attend sunset boat tour..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-normal"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeneratingAI}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              {isGeneratingAI && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isGeneratingAI ? 'Gemini Generating...' : 'Build Complete Itinerary'}</span>
              {!isGeneratingAI && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
