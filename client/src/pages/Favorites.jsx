import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Grid } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const FAVORITES_KEY = 'RentEase_favorites';
const LEGACY_FAVORITES_KEY = 'rentease_favorites';

const Favorites = () => {
  const { isAuthenticated, user, setFavorites } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedNew = window.localStorage.getItem(FAVORITES_KEY);
      if (storedNew) {
        return JSON.parse(storedNew);
      }

      const legacy = window.localStorage.getItem(LEGACY_FAVORITES_KEY);
      if (legacy) {
        window.localStorage.setItem(FAVORITES_KEY, legacy);
        window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
        return JSON.parse(legacy);
      }

      return [];
    } catch {
      return [];
    }
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user && Array.isArray(user.favorites)) {
      setFavoriteIds(user.favorites.map((id) => id.toString()));
    } else if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        try {
          let stored = window.localStorage.getItem(FAVORITES_KEY);
          if (!stored) {
            const legacy = window.localStorage.getItem(LEGACY_FAVORITES_KEY);
            if (legacy) {
              stored = legacy;
              window.localStorage.setItem(FAVORITES_KEY, legacy);
              window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
            }
          }

          setFavoriteIds(stored ? JSON.parse(stored) : []);
        } catch {
          setFavoriteIds([]);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await axios.get('/api/favorites');
          setProperties(response.data.houses || []);
        } catch (error) {
          console.error('Error fetching favorite properties:', error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!favoriteIds || favoriteIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          favoriteIds.map((id) =>
            axios
              .get(`/api/houses/${id}`)
              .then((res) => res.data)
              .catch(() => null)
          )
        );
        setProperties(results.filter(Boolean));
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds, isAuthenticated]);

  const handleToggleFavorite = async (houseId) => {
    if (isAuthenticated) {
      try {
        const isFav = favoriteIds.includes(houseId);
        const url = `/api/favorites/${houseId}`;
        const response = isFav
          ? await axios.delete(url)
          : await axios.post(url);

        const serverFavorites = (response.data.favorites || []).map((id) => id.toString());
        setFavoriteIds(serverFavorites);
        if (setFavorites) {
          setFavorites(serverFavorites);
        }

        setProperties((prevProps) => prevProps.filter((p) => serverFavorites.includes(p._id)));
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
      return;
    }

    // Guest behavior: fall back to localStorage
    setFavoriteIds((prev) => {
      const exists = prev.includes(houseId);
      const next = exists ? prev.filter((id) => id !== houseId) : [...prev, houseId];

      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }

      setProperties((prevProps) => prevProps.filter((p) => next.includes(p._id)));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#3d3226] mb-1 flex items-center">
              <Heart className="h-7 w-7 text-primary-500 mr-2" />
              My Favorites
            </h1>
            <p className="text-[#5c4d3c]">
              Homes you have saved from Browse.
              {isAuthenticated
                ? ' Favorites are linked to your account.'
                : ' Favorites are stored on this device.'}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-[#5c4d3c]">Loading your favorite homes...</p>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 bg-white rounded-3xl border border-[#e8dfd3] shadow-sm"
          >
            <div className="bg-primary-50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center ring-1 ring-primary-100">
              <Heart className="h-16 w-16 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-[#3d3226] mb-2">
              No favorites yet
            </h3>
            <p className="text-[#5c4d3c] mb-6">
              Browse properties and tap the heart icon to save homes you like.
            </p>
            <a href="/browse" className="btn-primary inline-flex items-center">
              <Grid className="h-4 w-4 mr-2" />
              Browse properties
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <PropertyCard
                  house={property}
                  onFavorite={handleToggleFavorite}
                  isFavorite={favoriteIds.includes(property._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
