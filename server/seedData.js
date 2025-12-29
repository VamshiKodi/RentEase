const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const House = require('./models/House');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mockUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.owner@example.com',
    password: 'password123',
    phone: '9876543210',
    userType: 'owner',
    isVerified: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya.owner@example.com',
    password: 'password123',
    phone: '9876543211',
    userType: 'owner',
    isVerified: true
  },
  {
    name: 'Amit Patel',
    email: 'amit.owner@example.com',
    password: 'password123',
    phone: '9876543212',
    userType: 'owner',
    isVerified: false
  },
  {
    name: 'Sneha Singh',
    email: 'sneha.renter@example.com',
    password: 'password123',
    phone: '9876543213',
    userType: 'renter',
    isVerified: true
  },
  {
    name: 'Vikram Gupta',
    email: 'vikram.renter@example.com',
    password: 'password123',
    phone: '9876543214',
    userType: 'renter',
    isVerified: true
  }
];

const mockHouses = [
  {
    title: 'Spacious 2BHK Apartment in Bandra West',
    description: 'Beautiful 2BHK apartment with modern amenities, close to Bandra station. Perfect for families with great connectivity to business districts. Features include modular kitchen, ample natural light, and 24/7 security.',
    location: {
      address: '15th Road, Khar West, Near Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400052',
      coordinates: {
        type: 'Point',
        coordinates: [72.835, 19.066]
      }
    },
    rent: 45000,
    deposit: 90000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'AC', 'Security', 'Elevator', 'Power Backup'],
    bhk: '2BHK',
    furnishing: 'Semi Furnished',
    area: 950,
    propertyType: 'Apartment',
    availability: 'Available',
    preferences: {
      tenantType: 'Family',
      petAllowed: false
    },
    views: 156
  },
  {
    title: 'Luxury 3BHK Villa in Koramangala',
    description: 'Premium villa with private garden and parking. Located in the heart of Koramangala with easy access to tech parks, restaurants, and shopping centers. Features include spacious rooms, modern interiors, and a peaceful environment.',
    location: {
      address: '5th Block, Koramangala, Near Forum Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
      coordinates: {
        type: 'Point',
        coordinates: [77.627, 12.935]
      }
    },
    rent: 65000,
    deposit: 130000,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'AC', 'Garden', 'Security', 'Swimming Pool', 'Gym'],
    bhk: '3BHK',
    furnishing: 'Fully Furnished',
    area: 1800,
    propertyType: 'Villa',
    availability: 'Available',
    preferences: {
      tenantType: 'Family',
      petAllowed: true
    },
    views: 234
  },
  {
    title: 'Modern 1BHK Studio in Gurgaon',
    description: 'Contemporary studio apartment perfect for working professionals. Located in Cyber City with excellent connectivity to Delhi and major IT companies. Features modern amenities and a vibrant neighborhood.',
    location: {
      address: 'Sector 29, DLF Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      coordinates: {
        type: 'Point',
        coordinates: [77.088, 28.494]
      }
    },
    rent: 28000,
    deposit: 56000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ],
    amenities: ['WiFi', 'AC', 'Security', 'Elevator', 'Power Backup', 'Gym'],
    bhk: '1BHK',
    furnishing: 'Fully Furnished',
    area: 650,
    propertyType: 'Studio',
    availability: 'Available',
    preferences: {
      tenantType: 'Bachelor',
      petAllowed: false
    },
    views: 89
  },
  {
    title: 'Cozy 2BHK House in Pune',
    description: 'Charming independent house in a quiet residential area. Perfect for small families looking for a peaceful environment with good schools and hospitals nearby. Features include a small garden and dedicated parking.',
    location: {
      address: 'Aundh, Near Elpro City Square',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007',
      coordinates: {
        type: 'Point',
        coordinates: [73.807, 18.56]
      }
    },
    rent: 32000,
    deposit: 64000,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'Water Supply'],
    bhk: '2BHK',
    furnishing: 'Unfurnished',
    area: 1100,
    propertyType: 'House',
    availability: 'Available',
    preferences: {
      tenantType: 'Family',
      petAllowed: true
    },
    views: 67
  },
  {
    title: 'Premium 4BHK Penthouse in Chennai',
    description: 'Luxurious penthouse with panoramic city views. Located in the premium area of Anna Nagar with top-notch amenities and excellent connectivity. Perfect for large families or those seeking luxury living.',
    location: {
      address: '2nd Avenue, Anna Nagar West',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      coordinates: {
        type: 'Point',
        coordinates: [80.209, 13.092]
      }
    },
    rent: 85000,
    deposit: 170000,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'AC', 'Swimming Pool', 'Gym', 'Security', 'Elevator', 'Terrace'],
    bhk: '4BHK',
    furnishing: 'Fully Furnished',
    area: 2500,
    propertyType: 'Penthouse',
    availability: 'Available',
    preferences: {
      tenantType: 'Family',
      petAllowed: false
    },
    views: 312
  },
  {
    title: 'Affordable 1RK in Thane',
    description: 'Budget-friendly 1RK perfect for students and young professionals. Located near Thane station with easy access to Mumbai. Basic amenities included with a friendly neighborhood environment.',
    location: {
      address: 'Naupada, Near Thane Railway Station',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400602',
      coordinates: {
        type: 'Point',
        coordinates: [72.974, 19.195]
      }
    },
    rent: 15000,
    deposit: 30000,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ],
    amenities: ['WiFi', 'Security', 'Water Supply'],
    bhk: '1RK',
    furnishing: 'Semi Furnished',
    area: 300,
    propertyType: 'Apartment',
    availability: 'Available',
    preferences: {
      tenantType: 'Bachelor',
      petAllowed: false
    },
    views: 45
  },
  {
    title: 'Elegant 3BHK Apartment in Hyderabad',
    description: 'Sophisticated apartment in the IT corridor of Hyderabad. Perfect for tech professionals with modern amenities and excellent connectivity to major IT companies. Features spacious rooms and contemporary design.',
    location: {
      address: 'Gachibowli, Near HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      coordinates: {
        type: 'Point',
        coordinates: [78.348, 17.44]
      }
    },
    rent: 55000,
    deposit: 110000,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'AC', 'Gym', 'Security', 'Elevator', 'Power Backup'],
    bhk: '3BHK',
    furnishing: 'Semi Furnished',
    area: 1400,
    propertyType: 'Apartment',
    availability: 'Available',
    preferences: {
      tenantType: 'Any',
      petAllowed: true
    },
    views: 178
  },
  {
    title: 'Spacious 2BHK in Kolkata',
    description: 'Traditional Bengali architecture meets modern comfort. Located in the cultural heart of Kolkata with easy access to metro stations, markets, and cultural centers. Perfect for families who appreciate heritage and convenience.',
    location: {
      address: 'Salt Lake, Sector V, Near City Centre',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      coordinates: {
        type: 'Point',
        coordinates: [88.431, 22.577]
      }
    },
    rent: 25000,
    deposit: 50000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800'
    ],
    amenities: ['WiFi', 'Parking', 'Security', 'Balcony', 'Water Supply'],
    bhk: '2BHK',
    furnishing: 'Unfurnished',
    area: 900,
    propertyType: 'Apartment',
    availability: 'Rented',
    preferences: {
      tenantType: 'Family',
      petAllowed: false
    },
    views: 92
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await House.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of mockUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create houses (assign to owners only)
    const owners = createdUsers.filter(user => user.userType === 'owner');
    const createdHouses = [];
    
    for (let i = 0; i < mockHouses.length; i++) {
      const houseData = mockHouses[i];
      const owner = owners[i % owners.length]; // Distribute houses among owners
      
      const house = new House({
        ...houseData,
        owner: owner._id
      });
      const savedHouse = await house.save();
      createdHouses.push(savedHouse);
    }
    console.log(`🏠 Created ${createdHouses.length} houses`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Accounts Created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 PROPERTY OWNERS:');
    console.log('   📧 rajesh.owner@example.com | 🔑 password123 | ✅ Verified');
    console.log('   📧 priya.owner@example.com  | 🔑 password123 | ✅ Verified');
    console.log('   📧 amit.owner@example.com   | 🔑 password123 | ❌ Not Verified');
    console.log('\n🏠 TENANTS/RENTERS:');
    console.log('   📧 sneha.renter@example.com | 🔑 password123 | ✅ Verified');
    console.log('   📧 vikram.renter@example.com| 🔑 password123 | ✅ Verified');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Visit http://localhost:3000 to test the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
