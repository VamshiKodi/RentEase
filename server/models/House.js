const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    }
  },
  rent: {
    type: Number,
    required: [true, 'Rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  deposit: {
    type: Number,
    default: 0,
    min: [0, 'Deposit cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  approvedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewNote: {
    type: String,
    trim: true,
    maxlength: [500, 'Review note cannot exceed 500 characters'],
    default: ''
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Parking', 'AC', 'Gym', 'Swimming Pool', 'Garden', 
      'Security', 'Elevator', 'Power Backup', 'Water Supply', 
      'Balcony', 'Terrace', 'Furnished Kitchen', 'Washing Machine'
    ]
  }],
  bhk: {
    type: String,
    required: [true, 'BHK is required'],
    enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+']
  },
  furnishing: {
    type: String,
    required: [true, 'Furnishing status is required'],
    enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [1, 'Area must be at least 1 sq ft']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse']
  },
  availability: {
    type: String,
    enum: ['Available', 'Rented', 'Under Maintenance'],
    default: 'Available'
  },
  preferences: {
    tenantType: {
      type: String,
      enum: ['Family', 'Bachelor', 'Any'],
      default: 'Any'
    },
    petAllowed: {
      type: Boolean,
      default: false
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  contactStats: {
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    whatsapp: {
      type: Number,
      default: 0,
      min: 0
    },
    phone: {
      type: Number,
      default: 0,
      min: 0
    },
    email: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
houseSchema.index({ 
  'location.city': 'text', 
  'location.state': 'text', 
  title: 'text', 
  description: 'text' 
});

// Index for location-based queries
houseSchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

module.exports = mongoose.model('House', houseSchema);
