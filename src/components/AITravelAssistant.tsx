import React, { useState } from 'react';
import { askGeminiTravelAssistant, isGeminiConfigured } from '../services/geminiService';
import { useTrips } from '../context/TripContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Compass, 
  Loader2, 
  HelpCircle,
  MapPin,
  Utensils,
  Luggage,
  ShieldAlert
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AITravelAssistant: React.FC = () => {
  const { trips } = useTrips();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Default active trip context if available
  const activeTrip = trips[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: activeTrip 
        ? `Hello! I'm your Gemini-powered TripMate AI Concierge ✈️. I can recommend hidden gems in ${activeTrip.destination}, packing tips, local etiquette, or dining spots. What can I help you plan?`
        : `Hello! I'm your Gemini-powered TripMate AI Concierge ✈️. Where are you dreaming of traveling next?`,
      time: 'Just now'
    }
  ]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const aiReply = await askGeminiTravelAssistant(text, {
        destination: activeTrip?.destination,
        tripTitle: activeTrip?.title
      });

      const aiMsg: Message = {
        id: 'm-' + (Date.now() + 1),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'm-' + Date.now(),
          sender: 'ai',
          text: 'Oops, could not connect to Gemini AI right now. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 rounded-full shadow-2xl shadow-blue-500/40 flex items-center gap-2 group active:scale-95 transition-all animate-bounce duration-1000"
          title="Ask Gemini Travel AI"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <span className="hidden sm:inline text-xs font-extrabold pr-1 tracking-wide">
            Ask Gemini AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 ring-2 ring-white animate-pulse"></span>
        </button>
      )}

      {/* Interactive AI Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[600px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold">TripMate AI Concierge</h3>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-400 text-slate-900 tracking-wider">
                    Gemini Live
                  </span>
                </div>
                <p className="text-[11px] text-blue-100">
                  {activeTrip ? `Assisting with ${activeTrip.destination}` : 'Ask anything about travel planning'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                  <span className={`block text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs py-2">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="italic font-medium">Gemini is thinking and exploring recommendations...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleSend(activeTrip ? `What are 3 secret hidden gems to visit in ${activeTrip.destination}?` : 'Suggest 3 budget-friendly dream travel destinations.')}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-blue-600" />
              <span>Hidden Gems</span>
            </button>

            <button
              type="button"
              onClick={() => handleSend(activeTrip ? `What are the top 3 authentic street foods to try in ${activeTrip.destination}?` : 'Top street food cities in the world?')}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Utensils className="w-3 h-3 text-amber-600" />
              <span>Must-Eat Foods</span>
            </button>

            <button
              type="button"
              onClick={() => handleSend(activeTrip ? `What essential items should I pack for ${activeTrip.destination}?` : 'Packing checklist essentials for international travel?')}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Luggage className="w-3 h-3 text-purple-600" />
              <span>Packing Tips</span>
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Gemini anything about your trip..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
