import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Home,
  Eye,
  Edit,
  Trash2,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { CardLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    availableProperties: 0,
    rentedProperties: 0
  });

  // Debug: Log authentication state
  console.log('Dashboard - Auth State:', { user, isAuthenticated, authLoading });

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access your dashboard.</p>
          <Link to="/auth" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user?.userType === 'owner') {
      fetchOwnerProperties();
    } else {
      fetchTenantData();
    }
  }, [user]);

  const fetchOwnerProperties = async () => {
    try {
      const response = await axios.get('/api/houses/owner/my-listings');
      setProperties(response.data.houses);
      
      // Calculate stats
      const totalProperties = response.data.houses.length;
      const totalViews = response.data.houses.reduce((sum, house) => sum + (house.views || 0), 0);
      const availableProperties = response.data.houses.filter(house => house.availability === 'Available').length;
      const rentedProperties = response.data.houses.filter(house => house.availability === 'Rented').length;
      
      setStats({
        totalProperties,
        totalViews,
        availableProperties,
        rentedProperties
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch your properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantData = async () => {
    // For tenants, we'll show favorite properties (mock for now)
    setLoading(false);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`/api/houses/${propertyId}`);
      setProperties(properties.filter(p => p._id !== propertyId));
      toast.success('Property deleted successfully');
      
      // Refresh stats
      fetchOwnerProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'text-primary-600' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-luxury p-6 border border-slate-200/50 hover:shadow-luxury-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <p className="text-3xl font-display font-black text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-luxury-100 ${color} shadow-md`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </motion.div>
  );

  if (user?.userType === 'owner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">Owner Dashboard</h1>
              <p className="text-slate-600 mt-2 text-lg font-medium">Manage your property listings</p>
            </div>
            <Link
              to="/add-property"
              className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
            >
              <Plus className="h-5 w-5" />
              <span>Add Property</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Home}
              title="Total Properties"
              value={stats.totalProperties}
              color="text-blue-600"
            />
            <StatCard
              icon={Eye}
              title="Total Views"
              value={stats.totalViews}
              color="text-green-600"
            />
            <StatCard
              icon={TrendingUp}
              title="Available"
              value={stats.availableProperties}
              color="text-yellow-600"
            />
            <StatCard
              icon={Users}
              title="Rented"
              value={stats.rentedProperties}
              color="text-purple-600"
            />
          </div>

          {/* Properties Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
            </div>

            {loading ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <CardLoader key={index} />
                  ))}
                </div>
              </div>
            ) : properties.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <PropertyCard house={property} />
                      
                      {/* Action Buttons Overlay */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/edit-property/${property._id}`}
                          className="p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 rounded-full shadow-md transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full shadow-md transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                          property.availability === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : property.availability === 'Rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.availability}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties listed yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first property to attract potential tenants.
                </p>
                <Link to="/add-property" className="btn-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tenant Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your rental journey</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
              <span className="text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              to="/browse"
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Browse Properties</h3>
                  <p className="text-gray-600 text-sm">Find your perfect home</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Saved Properties</h3>
                <p className="text-gray-600 text-sm">0 properties saved</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-gray-600 text-sm">No recent activity</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
          </div>
          <div className="p-12 text-center">
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No searches yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start searching for properties to see your search history here.
            </p>
            <Link to="/browse" className="btn-primary">
              Start Searching
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
