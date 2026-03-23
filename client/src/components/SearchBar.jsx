import React, { useState } from 'react';
import { Search, MapPin, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (onSearch) onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { city: '', minRent: '', maxRent: '', bhk: '', furnishing: '', propertyType: '' };
    setLocalFilters(emptyFilters);
    if (onFilterChange) onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#a89b8c] group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by neighborhood or complex name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#e8dfd3] rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary-300 transition-all text-[#3d3226] placeholder:text-[#a89b8c]"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${showFilters || hasActiveFilters
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'bg-white border-[#e8dfd3] text-[#5c4d3c] hover:text-[#3d3226]'
              }`}
          >
            <Filter className="h-4 w-4" />
            <span>Refine</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <button type="submit" className="btn-primary !py-4 !px-8">
            Search
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 z-[100]"
          >
            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-lg !p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#3d3226] tracking-tight">Advanced Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest transition-colors">
                    Reset All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-[#a89b8c] uppercase tracking-widest mb-3">Location City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89b8c]" />
                    <input
                      type="text"
                      placeholder="City name..."
                      value={localFilters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#a89b8c] uppercase tracking-widest mb-3">Budget Range (₹)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minRent}
                      onChange={(e) => handleFilterChange('minRent', e.target.value)}
                      className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226]"
                    />
                    <span className="text-[#a89b8c]">/</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxRent}
                      onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                      className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#a89b8c] uppercase tracking-widest mb-3">BHK Configuration</label>
                  <select
                    value={localFilters.bhk}
                    onChange={(e) => handleFilterChange('bhk', e.target.value)}
                    className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226] cursor-pointer"
                  >
                    <option value="">Any Layout</option>
                    {bhkOptions.map((bhk) => <option key={bhk} value={bhk}>{bhk}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#a89b8c] uppercase tracking-widest mb-3">Furnishing Status</label>
                  <select
                    value={localFilters.furnishing}
                    onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                    className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226] cursor-pointer"
                  >
                    <option value="">Any Status</option>
                    {furnishingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#a89b8c] uppercase tracking-widest mb-3">Property Type</label>
                  <select
                    value={localFilters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full bg-white border border-[#e8dfd3] rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary-300 transition-all text-[#3d3226] cursor-pointer"
                  >
                    <option value="">Any Type</option>
                    {propertyTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#e8dfd3] flex justify-end">
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-secondary !px-8 !py-3"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
