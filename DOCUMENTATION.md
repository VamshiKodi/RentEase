# RentEase - Full Stack House Rental Platform

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Authentication Flow](#authentication-flow)
9. [Features](#features)
10. [Setup Guide](#setup-guide)
11. [Environment Variables](#environment-variables)
12. [Troubleshooting](#troubleshooting)

---

## Overview

RentEase connects property owners with tenants through a modern web platform featuring warm UI design, location-based search, real-time messaging, and comprehensive property management.

### Key Capabilities
- **Three User Roles:** Tenant, Owner, Admin
- **Property Listings:** Create, edit, delete with image upload
- **Advanced Search:** Filter by location, price, BHK, property type
- **Geolocation:** Find nearby properties using GPS coordinates
- **Favorites:** Save properties (guests: localStorage, users: database)
- **Messaging:** Real-time chat between tenants and owners
- **Reviews:** Property rating and feedback system
- **Analytics:** Owner dashboard with view statistics
- **Admin Panel:** User and property management

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React + Vite)                    │
│         Pages (23) | Components (9) | Context (2)            │
└─────────────────────────────┬─────────────────────────────────┘
                              │ HTTP (Axios)
┌─────────────────────────────┴─────────────────────────────────┐
│                    Server (Express + Node)                    │
│    Routes (7) | Middleware | Controllers | Models (4)          │
└─────────────────────────────┬─────────────────────────────────┘
                              │ Mongoose ODM
┌─────────────────────────────┴─────────────────────────────────┐
│                   Database (MongoDB Atlas)                    │
│         Users | Houses | Messages | Reviews                │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **React 18.2.0** - UI library with hooks
- **Vite 5.3.4** - Build tool and dev server
- **React Router DOM 6.15.0** - Client-side routing
- **Tailwind CSS 3.3.3** - Utility-first styling
- **Framer Motion 10.16.4** - Page animations
- **Axios 1.5.0** - HTTP client
- **React Hook Form 7.45.4** - Form validation
- **React Hot Toast 2.4.1** - Notifications
- **Leaflet 1.9.4 + React-Leaflet** - Interactive maps
- **Swiper 10.3.1** - Image carousels
- **Lucide React 0.279.0** - Icon library

### Backend
- **Node.js >=16.0.0** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **Mongoose 7.8.8** - MongoDB ODM
- **JWT 9.0.2** - JSON Web Token authentication
- **BcryptJS 2.4.3** - Password hashing (salt: 12 rounds)
- **Multer 1.4.5** - File upload middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Validator 7.0.1** - Input validation

---

## Project Structure

```
Home_Rent/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx          # Navigation with auth
│   │   │   ├── PropertyCard.jsx    # Property preview card
│   │   │   ├── SearchBar.jsx       # Advanced search filters
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── Loader.jsx          # Loading skeletons
│   │   │   ├── NearbyMap.jsx       # Leaflet map component
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   └── AdminProtectedRoute.jsx # Admin guard
│   │   ├── pages/                  # Route pages (23 total)
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Browse.jsx          # Property listings
│   │   │   ├── PropertyDetails.jsx # Single property view
│   │   │   ├── Favorites.jsx       # Saved properties
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── Messages.jsx        # Chat interface
│   │   │   ├── AddProperty.jsx     # Create listing
│   │   │   ├── Auth.jsx            # Login/Register
│   │   │   ├── AdminDashboard.jsx  # Admin controls
│   │   │   ├── OwnerAnalytics.jsx  # Owner statistics
│   │   │   └── [Static Pages]      # About, Contact, FAQ, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── api/
│   │   │   └── axios.js            # Axios configuration
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles + Tailwind
│   ├── tailwind.config.js          # Warm soft color theme
│   ├── vite.config.js              # Vite configuration
│   └── package.json
│
├── server/                          # Express Backend
│   ├── models/                      # Mongoose Schemas
│   │   ├── User.js                  # User model with bcrypt
│   │   ├── House.js                 # Property with GeoJSON
│   │   ├── Message.js               # Chat messages
│   │   └── Review.js                # Property reviews
│   ├── routes/                      # API Routes (7 modules)
│   │   ├── auth.js                  # Authentication
│   │   ├── houses.js                # Property CRUD + nearby
│   │   ├── messages.js              # Chat system
│   │   ├── favorites.js             # Favorites management
│   │   ├── reviews.js               # Reviews & ratings
│   │   ├── upload.js                # Image upload
│   │   └── admin.js                 # Admin operations
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── uploads/                     # Static image storage
│   ├── server.js                    # Entry point
│   └── package.json
│
├── README.md                        # Quick start guide
├── SETUP_GUIDE.md                   # Detailed setup
├── DOCUMENTATION.md                 # This file
└── package.json                     # Root scripts
```

---

## Database Schema

### User Collection
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| name | String | Required, max 50 | Full name |
| email | String | Required, unique, regex | Email address |
| password | String | Required, min 6, hashed | Bcrypt hashed |
| phone | String | Required, 10 digits | Contact number |
| userType | String | Enum: owner/renter/admin | Role |
| isVerified | Boolean | Default: false | Email verification |
| avatar | String | Optional | Profile image URL |
| favorites | [ObjectId] | Ref: House | Saved properties |
| lastMessagesSeenAt | Date | Optional | Message tracking |
| timestamps | - | Auto | createdAt, updatedAt |

### House Collection
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| title | String | Required, max 100 | Property title |
| description | String | Required, max 1000 | Detailed info |
| location.address | String | Required | Street address |
| location.city | String | Required | City name |
| location.state | String | Required | State name |
| location.pincode | String | Required, 6 digits | Postal code |
| location.coordinates | GeoJSON | [lng, lat] | Map coordinates |
| rent | Number | Required, min 0 | Monthly rent |
| deposit | Number | Default: 0 | Security deposit |
| maintenance | Number | Optional | Monthly maintenance |
| area | Number | Optional | Square footage |
| bhk | Number | Optional | Bedrooms |
| bathrooms | Number | Optional | Bathroom count |
| balconies | Number | Optional | Balcony count |
| furnishing | String | Enum: unfurnished/semi/fully | Furnishing status |
| propertyType | String | Enum: apartment/house/villa/pg | Type |
| tenantType | String | Enum: family/bachelors/any | Preferred tenants |
| parking | Boolean | Optional | Parking available |
| amenities | [String] | Optional | [AC, Geyser, etc.] |
| images | [String] | Max 10 | Image URLs |
| owner | ObjectId | Ref: User, required | Property owner |
| status | String | Enum: available/rented/maintenance | Availability |
| views | Number | Default: 0 | View counter |
| timestamps | - | Auto | createdAt, updatedAt |

### Message Collection
| Field | Type | Description |
|-------|------|-------------|
| sender | ObjectId (Ref: User) | Message sender |
| receiver | ObjectId (Ref: User) | Message recipient |
| house | ObjectId (Ref: House) | Related property |
| content | String (Required) | Message text |
| read | Boolean (Default: false) | Read status |
| createdAt | Date | Timestamp |

### Review Collection
| Field | Type | Validation |
|-------|------|------------|
| user | ObjectId (Ref: User) | Reviewer |
| house | ObjectId (Ref: House) | Property reviewed |
| rating | Number | 1-5 stars |
| comment | String | Optional text |
| createdAt | Date | Timestamp |

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production:  https://your-domain.com/api
```

### Authentication
All protected routes require header:
```
Authorization: Bearer <jwt_token>
```

### Auth Routes (`/api/auth`)

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| POST | `/register` | {name, email, password, phone, userType} | {token, user} | No |
| POST | `/login` | {email, password} | {token, user} | No |
| GET | `/profile` | - | {user} | Yes |
| PUT | `/profile` | {name, phone, avatar} | {user} | Yes |

### House Routes (`/api/houses`)

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/` | city, minRent, maxRent, bhk, type, page, limit | List properties |
| GET | `/:id` | - | Get single property |
| POST | `/` | - | Create property (Owner only) |
| PUT | `/:id` | - | Update property (Owner only) |
| DELETE | `/:id` | - | Delete property (Owner only) |
| GET | `/nearby` | lat, lng, radius (km) | Nearby search |
| GET | `/owner/my-listings` | - | Owner's properties |
| POST | `/:id/view` | - | Increment view count |

### Message Routes (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all conversations |
| GET | `/:userId` | Get chat with specific user |
| POST | `/` | Send new message |
| GET | `/unread-count` | Get unread message count |
| PUT | `/:id/read` | Mark message as read |

### Favorites Routes (`/api/favorites`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's favorites |
| POST | `/:houseId` | Add to favorites |
| DELETE | `/:houseId` | Remove from favorites |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/houses` | List all houses |
| DELETE | `/users/:id` | Delete user |
| DELETE | `/houses/:id` | Delete house |

---

## Frontend Components

### Navbar (`components/Navbar.jsx`)
**Purpose:** Main navigation with authentication state
**Features:**
- Responsive mobile menu
- User dropdown with profile/actions
- Unread message indicators
- Role-based navigation links
- Dark mode toggle (legacy)

**Navigation Links:**
- Home, Browse, How It Works (anchor scroll), Favorites
- Owner: Add Property button
- Authenticated: Dashboard, Messages, Analytics, Admin (if applicable)

### PropertyCard (`components/PropertyCard.jsx`)
**Purpose:** Property preview in listings
**Props:**
```javascript
{
  house: Object,           // Property data
  onFavorite: Function,    // Favorite toggle handler
  isFavorite: Boolean      // Current favorite state
}
```

**Features:**
- Image carousel (Swiper)
- Favorite heart button
- Price, location, BHK display
- Furnishing badges
- Contact owner button

### SearchBar (`components/SearchBar.jsx`)
**Purpose:** Advanced property search
**Props:**
```javascript
{
  onSearch: Function,      // Search handler
  initialValues: Object,   // Default filter values
  showFilters: Boolean     // Show advanced filters
}
```

**Filters:**
- Location (city search)
- Property type (dropdown)
- BHK count (1-5+)
- Price range (min/max)
- Furnishing status
- Tenant preference

### ProtectedRoute (`components/ProtectedRoute.jsx`)
**Purpose:** Route guard for authenticated pages
**Behavior:** Redirects to `/auth` if no valid token

### NearbyMap (`components/NearbyMap.jsx`)
**Purpose:** Leaflet map showing nearby properties
**Features:**
- User location marker
- Property pins with popups
- Radius circle visualization

---

## Authentication Flow

```
Login Form
    │
    ▼
POST /api/auth/login
    │
    ▼
Validate Credentials ──Error──▶ Alert User
    │
    ▼
Generate JWT (7 days expiry)
    │
    ▼
Store in localStorage
    │
    ▼
Set Axios default header
    │
    ▼
Redirect to intended page
    │
    ▼
ProtectedRoute checks token
    │
    ▼
API calls with Bearer token
```

### Token Storage
- **Location:** localStorage (`token` key)
- **Expiry:** 7 days from login
- **Format:** JWT (header.payload.signature)

### Logout Process
1. Call `logout()` from AuthContext
2. Remove token from localStorage
3. Clear Axios auth header
4. Redirect to home

---

## Features

### 1. Property Search & Filter
**Endpoint:** `GET /api/houses`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| city | String | Filter by city name |
| minRent | Number | Minimum rent |
| maxRent | Number | Maximum rent |
| bhk | Number | Bedroom count |
| propertyType | String | apartment/house/villa/pg |
| furnishing | String | unfurnished/semi/fully |
| tenantType | String | family/bachelors/any |
| page | Number | Pagination page |
| limit | Number | Items per page |

**Response:**
```json
{
  "houses": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### 2. Nearby Properties (Geospatial)
**Endpoint:** `GET /api/houses/nearby?lat=xx&lng=yy&radius=10`

**MongoDB Query:**
```javascript
{
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      $maxDistance: radius * 1000  // km to meters
    }
  }
}
```

**Requirements:**
- 2dsphere index on `location.coordinates`
- Valid coordinates from browser geolocation

### 3. Favorites System
**Dual Storage Strategy:**

**Guests (Not Logged In):**
- Store favorite IDs in localStorage (`homelink_favorites`)
- Array of house IDs

**Authenticated Users:**
- Store favorites in User model (`favorites` array)
- API endpoints for sync

**Migration on Login:**
```javascript
// Merge localStorage favorites to DB
localStorageIds.forEach(id => {
  POST /api/favorites/${id}
})
// Clear localStorage after merge
```

### 4. Messaging System
**Conversation Threading:**
- Messages grouped by (houseId + otherUserId)
- Latest message preview in conversation list
- Unread count badge in navbar

**Real-time Feel:**
- Auto-scroll to bottom
- Timestamps formatted
- Read receipts

### 5. Image Upload
**Flow:**
1. Select images in AddProperty form
2. Preview thumbnails
3. On submit, upload to `/api/upload`
4. Multer saves to `/uploads` directory
5. URLs stored in House.images array

**Limits:**
- Max 10 images per property
- Formats: JPG, PNG
- Size limit: Configured in Multer

### 6. Analytics Dashboard (Owner)
**Metrics:**
- Total views per property
- Contact requests
- Favorites received
- Listing performance over time

**Endpoint:** Owner-only routes in `/api/houses/owner/my-listings`

---

## Setup Guide

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

**Step 1: Clone Repository**
```bash
git clone <repository-url>
cd Home_Rent
```

**Step 2: Install Dependencies**
```bash
# Install all (root, server, client)
npm run install-all

# Or separately:
npm run install-server
npm run install-client
```

**Step 3: Configure Environment**
```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentease
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
PORT=5000
```

**Step 4: Run Development**
```bash
# From root directory
npm run dev

# This starts both:
# - Server: http://localhost:5000
# - Client: http://localhost:5173
```

**Step 5: Verify**
- Open browser: http://localhost:5173
- API health check: http://localhost:5000/api/health

---

## Environment Variables

### Server `.env`
| Variable | Required | Example |
|----------|----------|---------|
| MONGODB_URI | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| JWT_SECRET | Yes | `my_super_secret_key_12345` |
| PORT | No | `5000` |

### Security Notes
- Never commit `.env` to git
- Use strong JWT_SECRET (min 32 characters)
- Whitelist IP in MongoDB Atlas
- Rotate credentials regularly

---

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solutions:**
- Check `MONGODB_URI` in `.env`
- Verify network connectivity
- Whitelist current IP in MongoDB Atlas
- Check username/password correctness

### JWT Authentication Errors
```
Error: Invalid token
Error: Token expired
```
**Solutions:**
- Clear browser localStorage
- Re-login to get fresh token
- Check `JWT_SECRET` matches between encode/decode

### Image Upload Failures
```
Error: MulterError: Unexpected field
```
**Solutions:**
- Verify form field name matches Multer config
- Check `uploads/` directory exists and is writable
- Verify file size within limits
- Ensure file type is allowed

### CORS Policy Errors
```
Error: CORS policy violation
```
**Solutions:**
- Add client URL to CORS whitelist in server
- Check `cors()` middleware configuration
- Verify protocol match (http vs https)

### Module Not Found Errors
```
Error: Cannot find module 'xxx'
```
**Solutions:**
```bash
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

### Port Already in Use
```
Error: Port 5000 already in use
```
**Solutions:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Client Build Errors
```bash
cd client
rm -rf dist node_modules
npm install
npm run build
```

### Server Won't Start
```bash
cd server
# Check for syntax errors
node -c server.js
# Run with debug
nodemon server.js
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both client and server |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `npm run build` | Build client for production |
| `npm run start` | Start production server |
| `npm run install-all` | Install all dependencies |
| `npm run install-server` | Install server deps only |
| `npm run install-client` | Install client deps only |

---

## License

MIT License - RentEase Team

Copyright (c) 2026 RentEase

Permission is hereby granted, free of charge, to any person obtaining a copy...
