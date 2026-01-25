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
  X,
  Star
} from 'lucide-react';
import axios from 'axios';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property?._id) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?._id]);

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

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`/api/reviews/property/${id}`);
      const {
        reviews: fetchedReviews = [],
        averageRating: avg,
        totalReviews: total,
      } = response.data || {};

      setReviews(fetchedReviews);
      setAverageRating(typeof avg === 'number' ? avg : null);
      setTotalReviews(total || 0);

      if (user && fetchedReviews.length) {
        const mine = fetchedReviews.find(
          (r) => r.user?._id === user.id || r.user === user.id
        );
        if (mine) {
          setUserRating(mine.rating || 0);
          setUserComment(mine.comment || '');
        } else {
          setUserRating(0);
          setUserComment('');
        }
      } else {
        setUserRating(0);
        setUserComment('');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleMessageOwner = async () => {
    if (!property?.owner) return;

    // Prevent owners from messaging themselves on their own listing
    if (user && (user.id === property.owner._id || user.id === property.owner.id)) {
      toast.error('You cannot message your own listing');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to send a message');
      navigate(`/auth?redirect=${encodeURIComponent(`/property/${id}`)}`);
      return;
    }

    try {
      const response = await axios.post('/api/messages/start', {
        propertyId: property._id,
      });
      const conversationId = response.data.conversation?._id;
      if (conversationId) {
        navigate(`/messages?conversationId=${conversationId}`);
      } else {
        toast.error('Could not open conversation');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start conversation';
      toast.error(message);
    }
  };

  const handleContact = (type) => {
    if (!property?.owner) return;

    const { owner } = property;

    const trackContact = (eventType) => {
      axios
        .post(`/api/houses/${property._id}/contact-event`, { type: eventType })
        .catch(() => {
          // Analytics errors should not affect user experience
        });
    };

    switch (type) {
      case 'phone':
        window.open(`tel:${owner.phone}`, '_self');
        trackContact('phone');
        break;
      case 'email':
        const subject = `Inquiry about ${property.title}`;
        const body = `Hi ${owner.name},\n\nI'm interested in your property "${property.title}" listed on RentEase.\n\nProperty Details:\n- Location: ${property.location.address}, ${property.location.city}\n- Rent: ₹${property.rent}/month\n- Type: ${property.bhk} ${property.propertyType}\n\nCould you please provide more information?\n\nThank you!`;
        window.open(`mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
        trackContact('email');
        break;
      case 'whatsapp':
        const message = `Hi ${owner.name}, I'm interested in your property "${property.title}" listed on RentEase. Could you please provide more details?`;
        window.open(`https://wa.me/91${owner.phone}?text=${encodeURIComponent(message)}`, '_blank');
        trackContact('whatsapp');
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

  const isOwnerViewing =
    !!(
      property &&
      property.owner &&
      user &&
      (user.id === property.owner._id || user.id === property.owner.id)
    );

  const canReview =
    !!(property && property.owner && user && isAuthenticated && !isOwnerViewing);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      navigate(`/auth?redirect=${encodeURIComponent(`/property/${id}`)}`);
      return;
    }

    if (!property) return;

    if (isOwnerViewing) {
      toast.error('Owners cannot review their own property');
      return;
    }

    if (!userRating || userRating < 1 || userRating > 5) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await axios.post(`/api/reviews/property/${id}`, {
        rating: userRating,
        comment: userComment,
      });

      const { averageRating: avg, totalReviews: total } = response.data || {};
      setAverageRating(typeof avg === 'number' ? avg : null);
      setTotalReviews(total || 0);

      await fetchReviews();
      toast.success('Review saved');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save review';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
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
                  <div className="flex flex-col space-y-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{property.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {averageRating !== null && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({totalReviews} review{totalReviews === 1 ? '' : 's'})
                        </span>
                      </div>
                    )}
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
              <div className="mb-6">
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

              {/* Reviews */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Reviews</h3>
                {reviewsLoading ? (
                  <div className="text-sm text-gray-500">Loading reviews...</div>
                ) : (
                  <>
                    {totalReviews === 0 ? (
                      <div className="text-sm text-gray-500 mb-3">
                        No reviews yet. Be the first to review this property.
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {averageRating?.toFixed(1)} / 5
                          </span>
                          <span className="text-xs text-gray-500">
                            ({totalReviews} review{totalReviews === 1 ? '' : 's'})
                          </span>
                        </div>
                        <div className="space-y-3 mb-4">
                          {reviews.map((review) => (
                            <div
                              key={review._id}
                              className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                                    {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                      {review.user?.name || 'User'}
                                    </div>
                                    <div className="text-[11px] text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3.5 w-3.5 ${
                                        review.rating >= star
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {canReview && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="mt-4 border-t border-gray-200 pt-4 space-y-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Rate this property
                      </p>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="focus:outline-none"
                            onClick={() => setUserRating(star)}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        rows={3}
                        placeholder="Share your experience about this property (optional)"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? 'Saving...' : 'Submit review'}
                      </button>
                    </div>
                  </form>
                )}

                {!canReview && !isAuthenticated && (
                  <p className="mt-3 text-xs text-gray-500">
                    Please log in to leave a review.
                  </p>
                )}

                {isOwnerViewing && (
                  <p className="mt-3 text-xs text-gray-500">
                    Owners cannot review their own property.
                  </p>
                )}
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
                  onClick={handleMessageOwner}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Message in app</span>
                </button>
                <button
                  onClick={() => handleContact('whatsapp')}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
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
