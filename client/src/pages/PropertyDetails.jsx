import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Eye,
  Verified,
  ArrowLeft,
  CheckCircle,
  X
} from 'lucide-react';
import axios from 'axios';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/houses/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      if (error.response?.status === 404) {
        toast.error('Property not found');
        navigate('/browse');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (type) => {
    if (!property?.owner) return;

    const { owner } = property;
    
    switch (type) {
      case 'phone':
        window.open(`tel:${owner.phone}`, '_self');
        break;
      case 'email':
        const subject = `Inquiry about ${property.title}`;
        const body = `Hi ${owner.name},\n\nI'm interested in your property "${property.title}" listed on RentEase.\n\nProperty Details:\n- Location: ${property.location.address}, ${property.location.city}\n- Rent: ₹${property.rent}/month\n- Type: ${property.bhk} ${property.propertyType}\n\nCould you please provide more information?\n\nThank you!`;
        window.open(`mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
        break;
      case 'whatsapp':
        const message = `Hi ${owner.name}, I'm interested in your property "${property.title}" listed on RentEase. Could you please provide more details?`;
        window.open(`https://wa.me/91${owner.phone}?text=${encodeURIComponent(message)}`, '_blank');
        break;
    }
    setShowContactModal(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = property.title;
    const text = `Check out this property: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const formatRent = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <PageLoader text="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <button onClick={() => navigate('/browse')} className="btn-primary">
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to listings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="h-96 md:h-[500px]"
              >
                {property.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{property.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold text-gray-900">{property.bhk}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{property.furnishing}</div>
                  <div className="text-sm text-gray-600">Furnishing</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{property.propertyType}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Tenant Type</span>
                    <span className="font-medium text-gray-900">{property.preferences?.tenantType || 'Any'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Pet Allowed</span>
                    <span className="font-medium text-gray-900">
                      {property.preferences?.petAllowed ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Map integration coming soon</p>
                  <p className="text-sm mt-1">{property.location.address}, {property.location.city}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatRent(property.rent)}
                </div>
                <div className="text-gray-600">per month</div>
                {property.deposit > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Security Deposit: {formatRent(property.deposit)}
                  </div>
                )}
              </div>

              {/* Owner Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Property Owner</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <span className="font-semibold">
                      {property.owner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{property.owner.name}</span>
                      {property.owner.isVerified && (
                        <Verified className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Property Owner</div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleContact('whatsapp')}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleContact('phone')}
                    className="btn-outline flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleContact('email')}
                    className="btn-outline flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By contacting, you agree to our terms of service
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h4 className="font-semibold text-gray-900 mb-4">Quick Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-medium text-gray-900">#{property._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-medium ${
                    property.availability === 'Available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {property.availability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pincode</span>
                  <span className="font-medium text-gray-900">{property.location.pincode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium text-gray-900">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
