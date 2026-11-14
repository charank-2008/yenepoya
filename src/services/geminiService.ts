import { Activity, ActivityCategory } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(GEMINI_API_KEY);

interface GenerateItineraryParams {
  destination: string;
  durationDays: number;
  travelStyle: string;
  budget: number;
  currency: string;
  notes?: string;
}

export interface GeneratedDayActivity {
  time: string;
  title: string;
  category: ActivityCategory;
  location: string;
  notes: string;
  cost: number;
}

export interface GeneratedDay {
  dayNumber: number;
  title: string;
  activities: GeneratedDayActivity[];
}

/**
 * Calls Gemini API to generate tailored day-by-day itineraries
 */
export async function generateItineraryWithGemini(
  params: GenerateItineraryParams
): Promise<GeneratedDay[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompt = `You are TripMate's World-Class AI Travel Concierge.
Generate a realistic, inspiring day-by-day travel itinerary for a trip to:
Destination: ${params.destination}
Duration: ${params.durationDays} days
Travel Style: ${params.travelStyle}
Budget: ${params.budget} ${params.currency}
Special notes: ${params.notes || 'None'}

Return ONLY a valid JSON array of days without markdown fences.
Each object must have:
- dayNumber: number (1 to ${params.durationDays})
- title: string (e.g. "Arrival & Historic Seine Cruise")
- activities: array of objects with:
  - time: string (e.g. "09:30 AM", "01:00 PM", "07:30 PM")
  - title: string (specific activity or sightseeing title)
  - category: one of ["sightseeing", "food", "transport", "hotel", "leisure", "shopping", "flight"]
  - location: string (real street or attraction name in ${params.destination})
  - notes: string (practical traveler advice or highlight)
  - cost: number (estimated cost in ${params.currency})

Ensure 3-4 realistic activities per day. Return purely the JSON array.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from Gemini');
    }

    const cleaned = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
      return parsed.itinerary;
    }
    if (parsed.days && Array.isArray(parsed.days)) {
      return parsed.days;
    }
    throw new Error('Parsed response is not an array of days');
  } catch (err) {
    console.warn('Gemini itinerary generation error, using fallback:', err);
    throw err;
  }
}

/**
 * Ask Gemini Travel Concierge questions in real-time
 */
export async function askGeminiTravelAssistant(
  question: string,
  context?: { destination?: string; tripTitle?: string; currentDay?: number }
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "I'm TripMate's AI Travel Concierge. Please configure your Gemini API key in .env to enable live answers!";
  }

  const systemContext = context?.destination 
    ? `The user is currently planning or taking a trip to ${context.destination} (${context.tripTitle || ''}).`
    : `The user is using the TripMate travel planning application.`;

  const prompt = `${systemContext}
You are a warm, knowledgeable, and culturally savvy AI Travel Assistant named TripMate AI.
Answer the user's travel question concisely with bullet points, practical advice, and local recommendations.
User question: "${question}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate advice right now. Please try again.";
  } catch (err: any) {
    console.warn('Gemini Assistant error:', err);
    return `Could not reach Gemini AI: ${err.message || 'Please check your connection and try again.'}`;
  }
}
