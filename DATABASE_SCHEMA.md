# RentEase - Database Schema Documentation

## Table of Contents
1. [User Table](#1-user-table)
2. [House/Property Table](#2-houseproperty-table)
3. [Message Table](#3-message-table)
4. [Review Table](#4-review-table)

---

## 1) User Table

| FIELD NAME | DATA TYPE | USES | CONSTRAINTS |
|------------|-----------|------|-------------|
| _id | ObjectId | Unique identifier for user | PRIMARY KEY, AUTO_GENERATED |
| name | String | To store user's full name | NOT NULL, MAX_LENGTH: 50 |
| email | String | To store user's email address | NOT NULL, UNIQUE, LOWERCASE |
| password | String | To store hashed password | NOT NULL, MIN_LENGTH: 6 |
| phone | String | To store user's phone number | NOT NULL, FORMAT: 10 digits |
| userType | String | To identify user role (owner/renter/admin) | NOT NULL, ENUM: ['owner', 'renter', 'admin'] |
| isVerified | Boolean | To verify if user is authenticated | DEFAULT: false |
| avatar | String | To store profile image URL | DEFAULT: '' |
| favorites | Array[ObjectId] | To store user's favorite house IDs | REF: House |
| lastMessagesSeenAt | Date | To track last seen messages | DEFAULT: null |
| createdAt | Date | To store account creation date | AUTO_GENERATED |
| updatedAt | Date | To store last update timestamp | AUTO_GENERATED |

---

## 2) House/Property Table

| FIELD NAME | DATA TYPE | USES | CONSTRAINTS |
|------------|-----------|------|-------------|
| _id | ObjectId | Unique identifier for property | PRIMARY KEY, AUTO_GENERATED |
| title | String | To store property title/name | NOT NULL, TRIMMED |
| description | String | To store detailed property description | NOT NULL |
| location.address | String | To store street address | NOT NULL |
| location.city | String | To store city name | NOT NULL |
| location.state | String | To store state name | NOT NULL |
| location.pincode | String | To store postal code | NOT NULL |
| location.coordinates | GeoJSON | To store GPS coordinates for map | TYPE: Point, INDEX: 2dsphere |
| rent | Number | To store monthly rental amount | NOT NULL, MIN: 0 |
| deposit | Number | To store security deposit amount | DEFAULT: 0, MIN: 0 |
| area | Number | To store property area in sq ft | NOT NULL, MIN: 1 |
| bhk | String | To store bedroom configuration | NOT NULL, ENUM: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'] |
| furnishing | String | To store furnishing status | NOT NULL, ENUM: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'] |
| propertyType | String | To store type of property | NOT NULL, ENUM: ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse'] |
| amenities | Array[String] | To store available amenities | ENUM: ['WiFi', 'Parking', 'AC', 'Gym', 'Swimming Pool', 'Garden', 'Security', 'Elevator', 'Power Backup', 'Water Supply', 'Balcony', 'Terrace', 'Furnished Kitchen', 'Washing Machine'] |
| images | Array[String] | To store property image URLs | NOT NULL |
| owner | ObjectId | To reference property owner | NOT NULL, REF: User |
| availability | String | To store availability status | DEFAULT: 'Available', ENUM: ['Available', 'Rented', 'Under Maintenance'] |
| approvalStatus | String | To track admin approval status | DEFAULT: 'pending', ENUM: ['pending', 'approved', 'rejected'] |
| approvedAt | Date | To store approval timestamp | DEFAULT: null |
| reviewedBy | ObjectId | To reference admin who reviewed | REF: User, DEFAULT: null |
| reviewNote | String | To store admin review comments | MAX_LENGTH: 500, DEFAULT: '' |
| preferences.tenantType | String | To specify preferred tenant type | DEFAULT: 'Any', ENUM: ['Family', 'Bachelor', 'Any'] |
| preferences.petAllowed | Boolean | To specify if pets are allowed | DEFAULT: false |
| views | Number | To track property view count | DEFAULT: 0 |
| favoriteCount | Number | To track how many users favorited | DEFAULT: 0, MIN: 0 |
| isActive | Boolean | To soft delete/hide property | DEFAULT: true |
| createdAt | Date | To store listing creation date | AUTO_GENERATED |
| updatedAt | Date | To store last update timestamp | AUTO_GENERATED |

---

## 3) Message Table

| FIELD NAME | DATA TYPE | USES | CONSTRAINTS |
|------------|-----------|------|-------------|
| _id | ObjectId | Unique identifier for message | PRIMARY KEY, AUTO_GENERATED |
| sender | ObjectId | To reference message sender | NOT NULL, REF: User |
| receiver | ObjectId | To reference message recipient | NOT NULL, REF: User |
| house | ObjectId | To reference related property | NOT NULL, REF: House |
| content | String | To store message text content | NOT NULL, TRIMMED |
| isRead | Boolean | To track if message has been read | DEFAULT: false |
| readAt | Date | To store when message was read | DEFAULT: null |
| createdAt | Date | To store message sent timestamp | AUTO_GENERATED |
| updatedAt | Date | To store last update timestamp | AUTO_GENERATED |

---

## 4) Review Table

| FIELD NAME | DATA TYPE | USES | CONSTRAINTS |
|------------|-----------|------|-------------|
| _id | ObjectId | Unique identifier for review | PRIMARY KEY, AUTO_GENERATED |
| reviewer | ObjectId | To reference user who wrote review | NOT NULL, REF: User |
| house | ObjectId | To reference reviewed property | NOT NULL, REF: House |
| rating | Number | To store star rating (1-5) | NOT NULL, MIN: 1, MAX: 5 |
| comment | String | To store review text | NOT NULL, MAX_LENGTH: 1000 |
| isApproved | Boolean | To track admin approval of review | DEFAULT: false |
| createdAt | Date | To store review submission date | AUTO_GENERATED |
| updatedAt | Date | To store last update timestamp | AUTO_GENERATED |

---

## Database Relationships

### One-to-Many (1:N)
- **User → House**: One user (owner) can have multiple properties
- **User → Message**: One user can send/receive multiple messages
- **User → Review**: One user can write multiple reviews
- **House → Review**: One house can have multiple reviews
- **House → Message**: One house can have multiple messages

### Many-to-Many (M:N)
- **User ↔ House (Favorites)**: Users can favorite multiple houses, houses can be favorited by multiple users (stored as array in User document)

---

## Indexes

| Collection | Index Field | Type | Purpose |
|------------|-------------|------|---------|
| users | email | UNIQUE | Fast login lookup |
| houses | location.coordinates | 2dsphere | Geospatial queries for nearby search |
| houses | approvalStatus | SINGLE | Filter approved listings |
| houses | owner | SINGLE | Find properties by owner |
| messages | sender + receiver | COMPOUND | Chat history queries |
| messages | house | SINGLE | Property-related messages |
| reviews | house + reviewer | COMPOUND | Prevent duplicate reviews |

---

## Data Validation Rules

### User Registration
- Email must be valid format
- Password minimum 6 characters
- Phone must be exactly 10 digits
- User type must be specified

### Property Listing
- Rent and area must be positive numbers
- BHK must match predefined categories
- Property type must be from enum list
- At least one image required
- Location coordinates validated as GeoJSON

### Reviews
- Rating must be between 1-5
- Comment maximum 1000 characters
- One review per user per property

---

**Last Updated:** March 23, 2026  
**Database:** MongoDB v6.0+  
**ODM:** Mongoose v8.0+
