import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Upload,
  X,
  MapPin,
  Home,
  IndianRupee,
  Square,
  Bed,
  Plus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { ButtonLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [geoCoords, setGeoCoords] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      amenities: [],
      preferences: {
        tenantType: 'Any',
        petAllowed: false
      }
    }
  });

  const watchAmenities = watch('amenities') || [];

  const steps = [
    { id: 1, title: 'Basic Details', icon: Home },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Images & Amenities', icon: Upload },
  ];

  const bhkOptions = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];
  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
  const propertyTypeOptions = ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse'];
  const tenantTypeOptions = ['Family', 'Bachelor', 'Any'];

  const amenitiesOptions = [
    'WiFi', 'Parking', 'AC', 'Gym', 'Swimming Pool', 'Garden',
    'Security', 'Elevator', 'Power Backup', 'Water Supply',
    'Balcony', 'Terrace', 'Furnished Kitchen', 'Washing Machine'
  ];

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSelectedImages(prev => [...prev, ...response.data.images]);
      setImageFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    const currentAmenities = getValues('amenities') || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    setValue('amenities', newAmenities);
  };

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const propertyData = {
        ...data,
        images: selectedImages,
        rent: parseInt(data.rent),
        deposit: parseInt(data.deposit) || 0,
        area: parseInt(data.area),
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          ...(geoCoords && typeof geoCoords.longitude === 'number' && typeof geoCoords.latitude === 'number' && {
            coordinates: {
              type: 'Point',
              coordinates: [geoCoords.longitude, geoCoords.latitude],
            }
          })
        }
      };

      const response = await axios.post('/api/houses', propertyData);
      toast.success('Property submitted for admin approval!');
      navigate(`/property/${response.data.house._id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      const apiData = error.response?.data;
      const validationErrors = Array.isArray(apiData?.errors) ? apiData.errors : null;

      const message =
        (validationErrors && validationErrors.length
          ? validationErrors
              .map((e) => `${e.path || e.param || 'field'}: ${e.msg || e.message || 'Invalid'}`)
              .join('\n')
          : apiData?.error || apiData?.message) || 'Failed to create property';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDetectPropertyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Location is not supported in this browser.');
      return;
    }

    setGeoError('');
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoCoords({ latitude, longitude });

        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
              lat: latitude,
              lon: longitude,
              format: 'json',
              addressdetails: 1,
            },
          });

          const addressData = response.data?.address || {};

          const lineParts = [
            addressData.road,
            addressData.neighbourhood,
            addressData.suburb,
            addressData.city_district,
            addressData.city || addressData.town || addressData.village,
          ].filter(Boolean);

          const autoAddress = lineParts.join(', ');
          const autoCity = addressData.city || addressData.town || addressData.village || '';
          const autoState = addressData.state || '';
          const autoPincode = addressData.postcode || '';

          if (autoAddress) setValue('address', autoAddress);
          if (autoCity) setValue('city', autoCity);
          if (autoState) setValue('state', autoState);
          if (autoPincode) setValue('pincode', autoPincode);

          toast.success('Location detected and address auto-filled.');
        } catch (error) {
          console.error('Reverse geocoding error for property:', error);
          toast.error('Location detected, but address could not be auto-filled.');
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error for property:', error);
        setGeoError(error.message || 'Unable to get your location.');
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      }
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' }
                })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="e.g., Spacious 2BHK Apartment in Bandra"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Describe your property, its features, nearby amenities..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Property Type & BHK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Property Type *
                </label>
                <select
                  {...register('propertyType', { required: 'Property type is required' })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                >
                  <option value="">Select property type</option>
                  {propertyTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  BHK Type *
                </label>
                <select
                  {...register('bhk', { required: 'BHK type is required' })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                >
                  <option value="">Select BHK</option>
                  {bhkOptions.map(bhk => (
                    <option key={bhk} value={bhk}>{bhk}</option>
                  ))}
                </select>
                {errors.bhk && (
                  <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
                )}
              </div>
            </div>

            {/* Rent & Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Monthly Rent (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    {...register('rent', {
                      required: 'Rent is required',
                      min: { value: 1, message: 'Rent must be greater than 0' }
                    })}
                    className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="25000"
                  />
                </div>
                {errors.rent && (
                  <p className="mt-1 text-sm text-red-600">{errors.rent.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Security Deposit (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    {...register('deposit', {
                      min: { value: 0, message: 'Deposit cannot be negative' }
                    })}
                    className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="50000"
                  />
                </div>
                {errors.deposit && (
                  <p className="mt-1 text-sm text-red-600">{errors.deposit.message}</p>
                )}
              </div>
            </div>

            {/* Area & Furnishing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Area (sq ft) *
                </label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    {...register('area', {
                      required: 'Area is required',
                      min: { value: 1, message: 'Area must be greater than 0' }
                    })}
                    className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="1200"
                  />
                </div>
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Furnishing *
                </label>
                <select
                  {...register('furnishing', { required: 'Furnishing status is required' })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                >
                  <option value="">Select furnishing</option>
                  {furnishingOptions.map(furnishing => (
                    <option key={furnishing} value={furnishing}>{furnishing}</option>
                  ))}
                </select>
                {errors.furnishing && (
                  <p className="mt-1 text-sm text-red-600">{errors.furnishing.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary-50 border border-primary-100 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-700">
                  Use your current location to help renters find this property in nearby searches.
                </p>
                {geoCoords && (
                  <p className="text-xs text-primary-700 mt-1">
                    Location detected (approx): {geoCoords.latitude.toFixed(4)}, {geoCoords.longitude.toFixed(4)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleDetectPropertyLocation}
                disabled={geoLoading}
                className="mt-3 sm:mt-0 btn-primary text-sm px-4 py-2 flex items-center justify-center space-x-2"
              >
                {geoLoading ? (
                  <>
                    <ButtonLoader />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Use My Location</span>
                  </>
                )}
              </button>
            </div>
            {geoError && (
              <p className="text-sm text-red-600">{geoError}</p>
            )}
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address *
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={3}
                className="input-field"
                placeholder="Building name, street, area..."
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="input-field"
                  placeholder="Mumbai"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="input-field"
                  placeholder="Maharashtra"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Please enter a valid 6-digit pincode'
                    }
                  })}
                  className="input-field"
                  placeholder="400001"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Tenant Type
                  </label>
                  <select
                    {...register('preferences.tenantType')}
                    className="input-field"
                  >
                    {tenantTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('preferences.petAllowed')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Pets Allowed
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images * (Max 10 images)
              </label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImages || selectedImages.length >= 10}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${uploadingImages ? 'cursor-not-allowed' : ''}`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {uploadingImages ? 'Uploading...' : 'Click to upload images or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 text-sm border rounded-lg transition-colors ${
                      watchAmenities.includes(amenity)
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {watchAmenities.includes(amenity) && (
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                    )}
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-1">List your property and connect with potential tenants</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    Step {step.id}
                  </p>
                  <p className={`text-sm ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || selectedImages.length === 0}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <ButtonLoader />
                      <span>Creating Listing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Create Listing</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProperty;
