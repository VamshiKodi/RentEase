import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { CardLoader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import NearbyMap from '../components/NearbyMap';

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
  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('rentease_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
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
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getHouseLatLng = (house) => {
    if (!house || !house.location) return null;

    const raw = house.location.coordinates;
    if (!raw) return null;

    // Support both GeoJSON { type, coordinates: [lng, lat] } and legacy [lng, lat]
    const arr = Array.isArray(raw) ? raw : raw.coordinates;
    if (
      arr &&
      Array.isArray(arr) &&
      arr.length === 2 &&
      typeof arr[0] === 'number' &&
      typeof arr[1] === 'number'
    ) {
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
      const latitude = parseFloat(latParam);
      const longitude = parseFloat(lngParam);

      if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
        fetchNearbyByCoordinates(latitude, longitude, true);
      }
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
        params: {
          lat: latitude,
          lng: longitude,
          maxDistanceKm: distanceToUse,
        },
      });

      const nearbyHouses = response.data.houses || [];
      const housesWithDistance = nearbyHouses.map((house) => {
        const coords = getHouseLatLng(house);

        if (coords) {
          const { lat: houseLat, lng: houseLng } = coords;
          const distanceKm = calculateDistanceKm(latitude, longitude, houseLat, houseLng);
          return { ...house, distanceKm };
        }

        return house;
      });

      // When in nearby mode, default sorting is by distance ascending
      const sortedNearby = [...housesWithDistance].sort((a, b) => {
        const da = typeof a.distanceKm === 'number' ? a.distanceKm : Number.POSITIVE_INFINITY;
        const db = typeof b.distanceKm === 'number' ? b.distanceKm : Number.POSITIVE_INFINITY;
        return da - db;
      });

      setProperties(sortedNearby);
      setPagination({
        current: 1,
        pages: 1,
        total: nearbyHouses.length,
        hasNext: false,
        hasPrev: false,
      });

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
        console.error('Geolocation error:', error);
        setGeoError(error.message || 'Unable to get your location.');
        setUsingNearby(false);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      }
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
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
          window.localStorage.setItem('rentease_favorites', JSON.stringify(next));
        }
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
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

  const hasFilters = Object.values(currentFilters).some(value => value !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-gray-600">
            Find your perfect rental home from thousands of verified listings
          </p>
        </div>

        {promptLocation && !usingNearby && !loading && (
          <p className="text-sm text-gray-700 mb-4">
            To see homes near you, click <span className="font-medium">Use My Location</span> below.
          </p>
        )}

        {geoError && (
          <p className="text-sm text-red-600 mb-4">{geoError}</p>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={currentFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="btn-secondary text-sm px-4 py-2"
              >
                Use My Location
              </button>
              {usingNearby && (
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear location
                </button>
              )}
            </div>
            {usingNearby && (
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs text-gray-500">Radius:</span>
                {[2, 5, 10, 20].map((distance) => (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => handleRadiusChange(distance)}
                    className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                      maxDistanceKm === distance
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {distance} km
                  </button>
                ))}
              </div>
            )}
            <p className="text-gray-600">
              {loading
                ? 'Loading...'
                : usingNearby
                  ? `${pagination.total || 0} properties near your location`
                  : `${pagination.total || 0} properties found`}
            </p>
            
            {hasFilters && (
              <button
                onClick={() => handleFilterChange({})}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {usingNearby && userLocation && (
            <div className="w-full mt-4">
              {(() => {
                const housesWithCoords = properties
                  .map((house, index) => {
                    const coords = getHouseLatLng(house);
                    if (coords) {
                      // Apply a tiny jitter based on index so markers at the exact
                      // same coordinates don't overlap visually.
                      const jitter = 0.0003 * index;
                      return {
                        house,
                        lat: coords.lat + jitter,
                        lng: coords.lng + jitter,
                      };
                    }
                    return null;
                  })
                  .filter(Boolean);

                return (
                  <NearbyMap
                    center={userLocation}
                    housesWithCoords={housesWithCoords}
                    onSelect={handleMarkerClick}
                  />
                );
              })()}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-1 text-gray-500 hover:text-gray-700"
                title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {[...Array(12)].map((_, index) => (
              <CardLoader key={index} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={
                  selectedPropertyId === property._id
                    ? 'ring-2 ring-primary-500 rounded-2xl'
                    : ''
                }
                ref={(el) => {
                  if (el) {
                    cardRefs.current[property._id] = el;
                  }
                }}
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
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-primary-50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No homes within {maxDistanceKm} km
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try increasing your search radius or clearing location to browse all available properties.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {maxDistanceKm < 20 && (
                <button
                  onClick={() => handleRadiusChange(20)}
                  className="btn-primary"
                >
                  Search within 20 km
                </button>
              )}
              <button
                onClick={handleClearLocation}
                className="btn-outline"
              >
                Browse all properties
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Grid className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more properties.
            </p>
            <button
              onClick={() => handleFilterChange({})}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isCurrentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
