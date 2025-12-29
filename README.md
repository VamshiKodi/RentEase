# 🏠 RentEase - House Rental Platform

**Find Your Dream Home Without Paying Commission**

RentEase is a full-stack MERN application that connects house owners and tenants directly, eliminating broker commissions and simplifying the rental process.

## 🌟 Features

### 🔑 Core Features
- **Zero Commission**: Direct connection between owners and tenants
- **User Authentication**: JWT-based secure authentication for owners and renters
- **Property Listings**: Complete CRUD operations for property management
- **Advanced Search**: Filter by location, rent, BHK, furnishing, and more
- **Image Upload**: Multiple image support with file validation
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Communication**: Direct contact via phone, email, and WhatsApp

### 👥 User Roles
- **Property Owners**: List properties, manage listings, track views
- **Tenants**: Browse properties, save favorites, contact owners directly

### 🎨 UI/UX Features
- Modern, professional design with Tailwind CSS
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Image carousels and galleries
- Toast notifications
- Loading states and skeletons
- Responsive grid layouts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Swiper** - Image carousels
- **Lucide React** - Icons

## 📁 Project Structure

```
RentEase/
├── server/                 # Backend application
│   ├── models/            # MongoDB schemas
│   │   ├── User.js        # User model
│   │   └── House.js       # House model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── houses.js      # House CRUD routes
│   │   └── upload.js      # File upload routes
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   ├── uploads/           # Uploaded images storage
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AddProperty.jsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
│
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RentEase
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/rentease
# JWT_SECRET=your_jwt_secret_key_here

# Start MongoDB service (if not running)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

## 📋 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile

### House Routes (`/api/houses`)
- `GET /` - Get all houses (with filters)
- `GET /:id` - Get single house by ID
- `POST /` - Create new house (Owner only)
- `PUT /:id` - Update house (Owner only)
- `DELETE /:id` - Delete house (Owner only)
- `GET /owner/my-listings` - Get owner's listings

### Upload Routes (`/api/upload`)
- `POST /images` - Upload multiple images
- `POST /single` - Upload single image

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentease
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## 📱 Key Features Walkthrough

### 🏠 Home Page
- Hero section with compelling tagline
- Search functionality with filters
- Featured properties showcase
- Statistics and testimonials
- Call-to-action sections

### 🔍 Browse Properties
- Advanced search and filtering
- Grid/List view toggle
- Sorting options (price, date, popularity)
- Pagination
- Property cards with quick actions

### 🏡 Property Details
- Image carousel with navigation
- Comprehensive property information
- Owner contact details
- Direct communication options (WhatsApp, Phone, Email)
- Interactive amenities display

### 👤 User Authentication
- Dual registration (Owner/Tenant)
- Form validation and error handling
- JWT token management
- Protected routes

### 📊 Dashboard
- **Owner Dashboard**: Property management, statistics, analytics
- **Tenant Dashboard**: Saved properties, search history, profile

### ➕ Add Property
- Multi-step form with validation
- Image upload with preview
- Amenities selection
- Location and preferences setup

## 🎨 Design System

### Colors
- **Primary**: `#3B82F6` (Blue)
- **Background**: `#F9FAFB` (Light Gray)
- **Text**: `#1E293B` (Dark Gray)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

### Components
- Rounded corners (8px, 12px)
- Subtle shadows and borders
- Hover effects and transitions
- Consistent spacing (Tailwind scale)

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **File Upload Security**: File type and size restrictions
- **CORS Configuration**: Controlled cross-origin requests
- **Error Handling**: Comprehensive error management

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Hamburger menu for mobile
- **Grid Layouts**: Responsive property grids
- **Touch Friendly**: Large tap targets and gestures

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Update CORS settings for production domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or similar platforms
3. Configure environment variables for API endpoints
4. Set up redirects for client-side routing

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Property creation and management
- [ ] Search and filtering functionality
- [ ] Image upload and display
- [ ] Responsive design on different devices
- [ ] Contact functionality (WhatsApp, Email, Phone)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**RentEase Team**
- Email: support@rentease.com
- Website: [rentease.com](https://rentease.com)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- UI Framework by [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ for the rental community**

*Connecting homes and hearts, one rental at a time.*
