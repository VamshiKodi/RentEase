import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield
} from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { CardLoader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import NearbyMap from '../components/NearbyMap';

const GUEST_FAVORITES_KEY = 'RentEase_favorites';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({});
  const [usingNearby, setUsingNearby] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const cardRefs = useRef({});
  const [searchParams, setSearchParams] = useSearchParams();
  const promptLocation = searchParams.get('promptLocation') === '1';
  const { user, isAuthenticated, setFavorites } = useAuth();

  const currentFilters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bhk: searchParams.get('bhk') || '',
    furnishing: searchParams.get('furnishing') || '',
    propertyType: searchParams.get('propertyType') || '',
  };

  const currentPage = parseInt(searchParams.get('page')) || 1;

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getHouseLatLng = (house) => {
    if (!house || !house.location) return null;
    const raw = house.location.coordinates;
    if (!raw) return null;
    const arr = Array.isArray(raw) ? raw : raw.coordinates;
    if (arr && Array.isArray(arr) && arr.length === 2) {
      const [lng, lat] = arr;
      return { lat, lng };
    }
    return null;
  };

  useEffect(() => {
    const hasLatLng = searchParams.get('lat') && searchParams.get('lng');
    if (usingNearby || hasLatLng) return;
    fetchProperties();
  }, [searchParams, sortBy, sortOrder, usingNearby]);

  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    if (latParam && lngParam) {
      fetchNearbyByCoordinates(parseFloat(latParam), parseFloat(lngParam), true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user && Array.isArray(user.favorites)) {
      setFavoriteIds(user.favorites.map((id) => id.toString()));
    }
  }, [isAuthenticated, user]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', currentPage.toString());
      params.set('limit', '12');
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      const response = await axios.get(`/api/houses?${params.toString()}`);
      setProperties(response.data.houses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyByCoordinates = async (latitude, longitude, clearLocationParams = false, distanceKmOverride) => {
    setGeoError('');
    setUsingNearby(true);
    setSortBy('distanceKm');
    setSortOrder('asc');
    setLoading(true);
    setUserLocation({ latitude, longitude });

    try {
      const distanceToUse = distanceKmOverride ?? maxDistanceKm;
      const response = await axios.get('/api/houses/nearby', {
        params: { lat: latitude, lng: longitude, maxDistanceKm: distanceToUse },
      });

      const nearbyHouses = response.data.houses || [];
      const housesWithDistance = nearbyHouses.map((house) => {
        const coords = getHouseLatLng(house);
        if (coords) {
          const distanceKm = calculateDistanceKm(latitude, longitude, coords.lat, coords.lng);
          return { ...house, distanceKm };
        }
        return house;
      });

      const sortedNearby = [...housesWithDistance].sort((a, b) => {
        const da = typeof a.distanceKm === 'number' ? a.distanceKm : Infinity;
        const db = typeof b.distanceKm === 'number' ? b.distanceKm : Infinity;
        return da - db;
      });

      setProperties(sortedNearby);
      setPagination({ current: 1, pages: 1, total: nearbyHouses.length, hasNext: false, hasPrev: false });

      if (clearLocationParams) {
        const params = new URLSearchParams(searchParams);
        params.delete('lat');
        params.delete('lng');
        params.delete('promptLocation');
        setSearchParams(params);
      }
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
      setGeoError('Could not fetch nearby properties.');
      setUsingNearby(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Location is not supported in this browser.');
      return;
    }
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyByCoordinates(latitude, longitude, true);
      },
      (error) => {
        setGeoError(error.message || 'Unable to get your location.');
        setUsingNearby(false);
        setLoading(false);
      },
      { timeout: 30000 }
    );
  };

  const handleClearLocation = () => {
    setUsingNearby(false);
    setGeoError('');
    const params = new URLSearchParams(searchParams);
    params.delete('promptLocation');
    setSearchParams(params);
  };

  const handleRadiusChange = (distance) => {
    setMaxDistanceKm(distance);
    if (userLocation) {
      fetchNearbyByCoordinates(userLocation.latitude, userLocation.longitude, false, distance);
    }
  };

  const handleMarkerClick = (houseId) => {
    setSelectedPropertyId(houseId);
    const el = cardRefs.current[houseId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleToggleFavorite = async (houseId) => {
    if (isAuthenticated) {
      try {
        const isFav = favoriteIds.includes(houseId);
        const url = `/api/favorites/${houseId}`;
        const response = isFav ? await axios.delete(url) : await axios.post(url);
        const serverFavorites = (response.data.favorites || []).map((id) => id.toString());
        setFavoriteIds(serverFavorites);
        if (setFavorites) setFavorites(serverFavorites);
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
      return;
    }
    // Guest favorites
    setFavoriteIds((prev) => {
      const exists = prev.includes(houseId);
      const next = exists ? prev.filter((id) => id !== houseId) : [...prev, houseId];
      try { window.localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(next)); } catch { }
      return next;
    });
  };

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');
    params.delete('page');
    setSearchParams(params);
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Latest' },
    { value: 'rent', label: 'Price' },
    { value: 'views', label: 'Popular' },
    { value: 'area', label: 'Area' },
    { value: 'distanceKm', label: 'Distance' },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3d3226] mb-3 tracking-tight">
              Browse Rentals
            </h1>
            <p className="text-[#5c4d3c] font-medium max-w-2xl">
              Discover broker-free listings and connect directly with verified property owners.
            </p>
          </motion.div>
        </div>

        {/* Location & Prompt Messages */}
        <AnimatePresence>
          {(promptLocation && !usingNearby && !loading) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white px-6 py-4 rounded-2xl border border-[#e8dfd3] shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[#5c4d3c]">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-bold">Show properties near your current location?</span>
                </div>
                <button
                  onClick={handleUseMyLocation}
                  className="btn-primary !py-2 !px-4 text-xs"
                >
                  Enable Location
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {geoError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold text-red-600 mb-6 bg-red-50 px-4 py-2 rounded-xl border border-red-100 inline-block"
          >
            {geoError}
          </motion.p>
        )}

        {/* Search Bar Container */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-3">
            <div className="bg-white rounded-xl">
              <SearchBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={currentFilters}
              />
            </div>
          </div>
        </div>

        {/* Results Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="btn-secondary !py-2 !px-4 text-xs flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>Nearby Me</span>
              </button>
              {usingNearby && (
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="text-xs font-bold text-[#a89b8c] hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  Reset
                </button>
              )}
            </div>

            {usingNearby && (
              <div className="flex items-center gap-2 bg-[#faf6f1] p-1 rounded-xl border border-[#e8dfd3]">
                {[2, 5, 10, 20].map((distance) => (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => handleRadiusChange(distance)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${maxDistanceKm === distance
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-[#5c4d3c] hover:text-[#3d3226]'
                      }`}
                  >
                    {distance} km
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <span className="h-1 w-1 rounded-full bg-[#e8dfd3]" />
              <p className="text-xs font-bold text-[#a89b8c] uppercase tracking-widest">
                {loading
                  ? 'Searching...'
                  : usingNearby
                    ? `${pagination.total || 0} listings near you`
                    : `${pagination.total || 0} listings found`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {/* Sort Options */}
            <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-[#e8dfd3] shadow-sm flex-1 sm:flex-none">
              <div className="pl-2">
                <SlidersHorizontal className="h-4 w-4 text-[#a89b8c]" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-xs font-bold text-[#5c4d3c] bg-transparent border-none focus:ring-0 cursor-pointer pr-8 py-1.5"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white">
                    Sort by: {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-1.5 bg-[#faf6f1] rounded-lg text-[#a89b8c] hover:text-primary-500 transition-colors"
                title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1.5 rounded-2xl border border-[#e8dfd3] shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'grid'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-[#a89b8c] hover:text-[#5c4d3c]'
                  }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-[#a89b8c] hover:text-[#5c4d3c]'
                  }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Map View Integration */}
        {usingNearby && userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-[2.5rem] overflow-hidden shadow-sm border border-[#e8dfd3] h-[400px]"
          >
            <NearbyMap
              center={userLocation}
              housesWithCoords={properties.map((h, i) => {
                const coords = getHouseLatLng(h);
                if (!coords) return null;
                return { house: h, lat: coords.lat + (0.0001 * i), lng: coords.lng + (0.0001 * i) };
              }).filter(Boolean)}
              onSelect={handleMarkerClick}
            />
          </motion.div>
        )}

        {/* Properties Grid/List */}
        {loading ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(9)].map((_, index) => <CardLoader key={index} />)}
          </div>
        ) : properties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                ref={(el) => { if (el) cardRefs.current[property._id] = el; }}
              >
                <PropertyCard
                  house={property}
                  onFavorite={handleToggleFavorite}
                  isFavorite={favoriteIds.includes(property._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : usingNearby ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-[2.5rem] border border-[#e8dfd3] shadow-sm"
          >
            <div className="bg-primary-50 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center ring-1 ring-primary-100">
              <MapPin className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#3d3226] mb-3 tracking-tight">No nearby homes found</h3>
            <p className="text-[#5c4d3c] mb-10 max-w-sm mx-auto font-medium">
              We couldn't find any homes within <span className="text-primary-500 font-bold">{maxDistanceKm} km</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {maxDistanceKm < 20 && (
                <button onClick={() => handleRadiusChange(20)} className="btn-primary !py-3 !px-8">Search 20 km Radius</button>
              )}
              <button onClick={handleClearLocation} className="btn-secondary !py-3 !px-8">Browse All Areas</button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-[2.5rem] border border-[#e8dfd3] shadow-sm"
          >
            <div className="bg-[#faf6f1] rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center ring-1 ring-[#e8dfd3]">
              <Search className="h-12 w-12 text-[#a89b8c]" />
            </div>
            <h3 className="text-2xl font-bold text-[#3d3226] mb-3 tracking-tight">No matches found</h3>
            <p className="text-[#5c4d3c] mb-10 max-w-sm mx-auto font-medium">Try adjusting your filters to find more homes.</p>
            <button onClick={() => handleFilterChange({})} className="btn-primary !py-3 !px-8">Clear All Filters</button>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-20"
          >
            <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-[#e8dfd3] shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#a89b8c] hover:text-primary-500 disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <div className="flex items-center space-x-1 px-4 border-x border-[#e8dfd3]">
                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${isCurrentPage ? 'bg-primary-500 text-white shadow-sm' : 'text-[#a89b8c] hover:bg-[#faf6f1]'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-[#e8dfd3] select-none">•</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#a89b8c] hover:text-primary-500 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Browse;
