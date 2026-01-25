import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Heart, PhoneCall } from 'lucide-react';
import { PageLoader } from '../components/Loader';

const OwnerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/houses/owner/analytics');
        setSummary(response.data.summary || null);
        setHouses(response.data.houses || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <PageLoader text="Loading analytics..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent mb-2">
              Owner Analytics
            </h1>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              See how your listings are performing across views, favorites, and contact actions.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-luxury p-6 border border-slate-200/50 flex items-center space-x-4"
            >
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-md">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Views</div>
                <div className="text-2xl md:text-3xl font-display font-black text-slate-900 mt-1">{summary.totalViews}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-luxury p-6 border border-slate-200/50 flex items-center space-x-4"
            >
              <div className="p-3 rounded-2xl bg-pink-50 text-pink-600 shadow-md">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Favorites</div>
                <div className="text-2xl md:text-3xl font-display font-black text-slate-900 mt-1">{summary.totalFavorites}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-luxury p-6 border border-slate-200/50 flex items-center space-x-4"
            >
              <div className="p-3 rounded-2xl bg-green-50 text-green-600 shadow-md">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Contacts</div>
                <div className="text-2xl md:text-3xl font-display font-black text-slate-900 mt-1">{summary.totalContacts}</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Per-property table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury overflow-hidden border border-slate-200/60">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-display font-semibold text-slate-900">Your Listings Performance</h2>
            <span className="text-xs md:text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {houses.length} properties
            </span>
          </div>
          {houses.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500 text-sm md:text-base">
              You have no listings yet. Add a property to start seeing analytics.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Favorites
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacts
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {houses.map((house) => (
                    <tr key={house._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 line-clamp-1">{house.title}</span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {house.location?.address}, {house.location?.city}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{house.views || 0}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{house.favoriteCount || 0}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {house.contactStats?.total || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {house.createdAt ? new Date(house.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
