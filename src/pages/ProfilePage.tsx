import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  LogOut, 
  Save, 
  AlertCircle,
  Sparkles,
  Plane,
  Award,
  Database,
  CheckCircle2,
  ExternalLink,
  Code
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isCloudConnected, updateProfile, logout } = useAuth();
  const { trips, showToast } = useTrips();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@example.com');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'San Francisco, USA');
  const [passportExpiry, setPassportExpiry] = useState(user?.passportExpiry || '2028-10-15');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || 'USD');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || 'comfort');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      homeCity,
      passportExpiry,
      preferredCurrency,
      travelStyle: travelStyle as any,
      bio
    });
    showToast('Profile and preferences updated successfully!', 'success');
  };

  // Passport expiry warning calculation
  const getPassportStatus = () => {
    if (!passportExpiry) return null;
    const expiry = new Date(passportExpiry);
    const now = new Date();
    const monthsLeft = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24 * 30.5);
    
    if (monthsLeft < 6) {
      return {
        warning: true,
        message: 'Passport expires in less than 6 months! Many international destinations require at least 6 months validity.'
      };
    }
    return {
      warning: false,
      message: 'Passport validity is in good standing (> 6 months).'
    };
  };

  const passportStatus = getPassportStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
          />
          <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 ring-2 ring-white text-white" title="Active Traveler">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              TripMate Explorer
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {email} • Based in <strong className="text-slate-800">{homeCity}</strong>
          </p>

          <p className="text-xs text-slate-600 max-w-lg italic pt-1">
            "{bio || 'Exploring culture, mountains, and great street food around the world.'}"
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Plane className="w-4 h-4 text-blue-600" />
              <span>{trips.length} Total Trips Planned</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Pro Member</span>
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="self-center sm:self-start px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Supabase Cloud Sync Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Supabase Cloud Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Connected</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Project: https://mcqqqmjfeqnowaauydpd.supabase.co
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                Cloud authentication & real-time persistence enabled with Row Level Security.
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard/project/mcqqqmjfeqnowaauydpd/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Open Supabase SQL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Passport Validity Alert Banner */}
      {passportStatus && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          passportStatus.warning
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          {passportStatus.warning ? (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            <p className="font-bold">Passport Expiration Monitor</p>
            <p>{passportStatus.message}</p>
          </div>
        </div>
      )}

      {/* Edit Profile & Travel Preferences Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Personal & Travel Preferences</h3>
          <p className="text-xs text-slate-500">Configure your default currency, passport tracker, and travel pace.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Home City / Airport
            </label>
            <input
              type="text"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Passport Expiry Date
            </label>
            <input
              type="date"
              value={passportExpiry}
              onChange={(e) => setPassportExpiry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preferred Currency
            </label>
            <select
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
              <option value="AUD">AUD ($) - Australian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Travel Comfort Style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="comfort">Comfort & Convenience</option>
              <option value="luxury">Luxury & Premium</option>
              <option value="budget">Smart Budget Saver</option>
              <option value="backpacking">Backpacking & Hostels</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Travel Bio & Bucket List
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-normal"
            placeholder="Tell us about your dream trips and travel habits..."
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
