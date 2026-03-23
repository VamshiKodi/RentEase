# RentEase - Comprehensive Project Documentation (A-Z)

## 1. Project Overview

**RentEase** is a premium, broker-free residential rental marketplace designed to connect property owners directly with potential tenants. The platform eliminates the middleman, saving users from heavy brokerage fees while providing a modern, "warm and soft" user experience.

### Core Philosophy

- **Broker-Free:** Direct connection between owners and tenants.
- **Verified Listings:** Focus on high-quality, real listings.
- **User-Centric Design:** A shift from clinical, cold interfaces to a warm, inviting aesthetic using beige, cream, and deep brown tones.
- **Privacy-First:** Location data is used transparently for nearby searches.

---

## 2. Branding Evolution

The project underwent a significant rebranding from **HomeLink** to **RentEase**. This involved:

- **Name Change:** Systematic replacement of all "HomeLink" instances in UI, metadata, and server responses.
- **Visual Identity:** Transitioned from a purple/dark-themed UI to a "Warm & Soft" palette.
- **Domain Alignment:** Email addresses and support links updated to `@rentease.com`.

---

## 3. Technical Stack

### Frontend (Client)

- **Framework:** React.js with Vite for fast builds and HMR.
- **Styling:** Tailwind CSS with custom configuration for the "Warm Soft" theme.
- **Animations:** Framer Motion for smooth transitions and hover effects.
- **Icons:** Lucide React for consistent, modern iconography.
- **Maps:** Leaflet.js for interactive property location visualization.
- **State Management:** React Context API for Authentication and Global State.
- **Routing:** React Router DOM for seamless navigation and anchor-link support.
- **API Client:** Axios for robust communication with the backend.

### Backend (Server)

- **Environment:** Node.js with Express framework.
- **Database:** MongoDB with Mongoose ODM for flexible schema modeling.
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies for secure sessions.
- **Security:** BcryptJS for password hashing.
- **File Uploads:** Multer for handling property images.
- **Validation:** Express Validator for sanitizing user inputs.

---

## 4. Key Features & Functionality

### A. Dynamic Property Discovery

- **Geospatial Search:** Uses MongoDB's `$near` operator to find properties based on the user's GPS coordinates.
- **Advanced Filtering:** Filter by BHK, Rent Range, Property Type, and Amenities.
- **Search Bar:** Real-time search by city, state, or address.

### B. User Experience (UX)

- **Favorites System:**
  - **Guests:** Favorites are persisted in `localStorage`.
  - **Logged-in Users:** Favorites are synced to the database.
- **Smooth Navigation:** Custom implementation for anchor-links (e.g., "How It Works") that handles cross-page scrolling.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

### C. Property Management

- **Listing Creation:** Owners can upload multiple images and specify precise locations via an interactive map or manual entry.
- **Verification Flow:** (Infrastructure ready) for marking properties as "Verified".

### D. Interactive Details Page

- **Contact Options:** Direct links for Phone, Email, and WhatsApp.
- **Image Gallery:** Swiper.js for beautiful property photo browsing.
- **Nearby Context:** Map integration showing the property's exact location.

---

## 5. Directory Structure

```text
Home_Rent/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Footer, Card, Map)
│   │   ├── context/        # Auth and Global State
│   │   ├── pages/          # Full page views (Home, Browse, About, etc.)
│   │   ├── index.css       # Global styles & Tailwind layers
│   │   └── main.jsx        # Entry point
│   └── tailwind.config.js  # Custom theme definitions
├── server/                 # Express Backend
│   ├── models/             # Mongoose Schemas (User, House, Message)
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth & Error handling
│   └── server.js           # Entry point
└── DOCUMENTATION.md        # Technical API & Setup guide
```

---

## 6. Development Milestones (The "What We Did")

- **Initial Setup:** Configured the MERN stack with Vite.
- **Core Features:** Built the authentication system and property listing CRUD operations.
- **Geospatial Logic:** Implemented "Search Near Me" functionality using browser geolocation.
- **UI Redesign:**
  - Moved away from the original dark/purple theme.
  - Implemented a custom Tailwind color palette (`primary-50` to `primary-950`).
  - Added beige backgrounds (`#faf6f1`) and soft borders (`#e8dfd3`).
- **Branding Overhaul:** Completed the full transition from HomeLink to RentEase.
- **Navigation Fixes:** Solved the "How It Works" scroll-to-id issue that wasn't working with standard React Router links.
- **Documentation:** Created high-level and deep-dive documentation for future maintenance.

---

## 7. How to Run the Project

- **Install All:** Run `npm run install-all` from the root.
- **Environment Variables:** Configure `.env` in the server folder (MongoDB URI, JWT Secret).
- **Start Dev Server:** Run `npm run dev` to launch both frontend (5173) and backend (5000) simultaneously.

---
**Project Status:** Active & Brand Consistent.
**Version:** 1.2.0 (The RentEase Release)
