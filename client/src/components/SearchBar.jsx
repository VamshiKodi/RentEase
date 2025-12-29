import React, { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';

const SearchBar = ({ onSearch, onFilterChange, filters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    city: filters.city || '',
    minRent: filters.minRent || '',
    maxRent: filters.maxRent || '',
    bhk: filters.bhk || '',
    furnishing: filters.furnishing || '',
    propertyType: filters.propertyType || '',
  });

  const bhkOptions = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];
  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
  const propertyTypeOptions = ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: '',
      minRent: '',
      maxRent: '',
      bhk: '',
      furnishing: '',
      propertyType: '',
    };
    setLocalFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by location, property name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-outline flex items-center space-x-2 px-4 py-3 ${
            hasActiveFilters ? 'bg-primary-50 border-primary-500' : ''
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
              {Object.values(localFilters).filter(v => v !== '').length}
            </span>
          )}
        </button>
        
        <button type="submit" className="btn-primary px-6 py-3">
          Search
        </button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                City
              </label>
              <input
                type="text"
                placeholder="Enter city name"
                value={localFilters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Rent Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 10000"
                value={localFilters.minRent}
                onChange={(e) => handleFilterChange('minRent', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                value={localFilters.maxRent}
                onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                className="input-field"
              />
            </div>

            {/* BHK Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BHK Type
              </label>
              <select
                value={localFilters.bhk}
                onChange={(e) => handleFilterChange('bhk', e.target.value)}
                className="input-field"
              >
                <option value="">Any BHK</option>
                {bhkOptions.map((bhk) => (
                  <option key={bhk} value={bhk}>
                    {bhk}
                  </option>
                ))}
              </select>
            </div>

            {/* Furnishing Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing
              </label>
              <select
                value={localFilters.furnishing}
                onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                className="input-field"
              >
                <option value="">Any Furnishing</option>
                {furnishingOptions.map((furnishing) => (
                  <option key={furnishing} value={furnishing}>
                    {furnishing}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={localFilters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="input-field"
              >
                <option value="">Any Type</option>
                {propertyTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
