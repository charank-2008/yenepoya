# ✈️ TripMate - Smart Trip Planning & Travel Reminder Mobile/Web App

**TripMate** is a modern, responsive, all-in-one trip planning and travel reminder application designed for seamless trip organization, ticket searching, itinerary creation, and travel notifications.

---

## 🌟 Key Features

### 1. 🧭 Personalized Dashboard & Trip Workspace
- **Welcome & Statistics**: Overview of upcoming trips, total countries/cities explored, active reminder counts, and ticket bookings.
- **Hero Spotlight**: Countdown and quick actions for the nearest upcoming journey.
- **Trip Status Categories**: Easily filter between *All*, *Upcoming*, and *Past Journeys*.
- **Trending Destinations**: Inspiration cards with estimated daily budgets and flights.

### 2. 🔐 User Authentication & Profile
- **Authentication**: Sign Up, Login, 1-Click Google Sign-In, and Forgot Password recovery modal.
- **Personalized Profile**: Configure avatar, name, email, home city/airport, preferred currency (`USD`, `EUR`, `GBP`, `INR`, `JPY`, etc.), and travel style (`Comfort`, `Luxury`, `Budget`, `Backpacking`).
- **Passport Expiry Tracker**: Built-in monitor warning if passport validity is under 6 months before international departures.

### 3. 🗺️ Comprehensive Trip Planning
- **New Trip Creator**:
  - Starting location & Destination with smart autocomplete.
  - Departure and Return dates with automatic duration counter.
  - Presets of curated travel photography covers.
  - Travel style selector (Solo, Couple, Family, Friends, Business).
  - Target budget and currency selector.
  - Automatic generation of smart travel alerts (24-hour web check-in & 3-day packing reminders).

### 4. 📅 Day-by-Day Interactive Itinerary
- Dynamic timeline broken down by Day 1, Day 2, Day 3...
- Add activities with time, category (*Sightseeing*, *Food & Dining*, *Transit/Transfer*, *Flight*, *Hotel*, *Leisure*, *Shopping*), location, estimated cost, and notes.
- Mark activities as completed with an interactive check-off circle.

### 5. 🎫 Integrated Ticket Booking Engine (Flights, Trains & Buses)
- Search global travel tickets across **Flights**, **High-speed Trains**, and **Intercity Buses**.
- Filter by carrier, pricing, duration, and stops.
- **Interactive Booking Checkout & Boarding Pass Generator**:
  - Issues instant digital boarding pass with unique PNR booking reference (e.g. `TM-849201`).
  - Scannable QR code preview, assigned seat, terminal/gate, and passenger information.
  - Automatically links booked tickets to the selected trip itinerary and creates departure notifications.

### 6. ⏰ Smart Travel Reminders & Alerts
- Real-time travel notifications for:
  - 24h Web Check-in
  - Luggage packing checklists
  - Flight boarding & terminal gates
  - Hotel check-in/out notices
  - Passport and visa expiry alerts
- Priority levels: 🔴 High Urgency, 🟡 Medium, 🟢 Standard.
- Check off completed tasks with instant notification updates.

### 7. 🎒 Packing Checklist & 💰 Expense Tracker
- **Categorized Packing Checklist**: Essentials, Clothing, Electronics, Toiletries, Health, and Documents with completion progress bar.
- **Trip Expense Manager**: Log receipts and track actual spend against target budget with remaining funds meter.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Styling**: Tailwind CSS with custom travel color palette, frosted glassmorphism, and responsive mobile-first shell
- **Icons**: Lucide React
- **Build Tool**: Vite 6
- **Persistence**: Supabase Cloud Sync with local offline fallback

---

## 🗄️ Supabase Cloud Configuration

Your Supabase project is configured in `.env`:
```env
VITE_SUPABASE_URL=https://mcqqqmjfeqnowaauydpd.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret
```

### Initializing Tables in Supabase
A ready-to-run database migration script is provided in `supabase/schema.sql`. You can copy and execute it in your [Supabase SQL Editor](https://supabase.com/dashboard/project/mcqqqmjfeqnowaauydpd/sql) to set up tables for:
- `profiles` (User metadata & travel style)
- `trips` (Trip itineraries, budgets, packing lists, expenses)
- `tickets` (Flights, trains, buses, booking references, seats)
- `reminders` (Scheduled notifications & travel alerts)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Emits optimized static bundles into the `dist/` directory.
