import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
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
  Star,
  Info,
  Shield,
  Zap
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
  const reviewsSectionRef = useRef(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property?._id) fetchReviews();
  }, [property?._id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/houses/${id}`);
      setProperty(response.data);
    } catch (error) {
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
      const { reviews: fetchedReviews = [], averageRating: avg, totalReviews: total } = response.data || {};
      setReviews(fetchedReviews);
      setAverageRating(typeof avg === 'number' ? avg : null);
      setTotalReviews(total || 0);

      if (user && fetchedReviews.length) {
        const mine = fetchedReviews.find((r) => r.user?._id === user.id || r.user === user.id);
        if (mine) {
          setUserRating(mine.rating || 0);
          setUserComment(mine.comment || '');
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleMessageOwner = async () => {
    if (!property?.owner) return;
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
      const response = await axios.post('/api/messages/start', { propertyId: property._id });
      const conversationId = response.data.conversation?._id;
      if (conversationId) navigate(`/messages?conversationId=${conversationId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start conversation');
    }
  };

  const handleContact = (type) => {
    if (!property?.owner) return;
    const { owner } = property;
    const trackContact = (eventType) => axios.post(`/api/houses/${property._id}/contact-event`, { type: eventType });

    switch (type) {
      case 'phone':
        window.open(`tel:${owner.phone}`, '_self');
        trackContact('phone');
        break;
      case 'email':
        const subject = `Inquiry about ${property.title}`;
        const body = `Hi ${owner.name},\n\nI'm interested in your property "${property.title}" listed on RentEase.`;
        window.open(`mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
        trackContact('email');
        break;
      case 'whatsapp':
        const message = `Hi ${owner.name}, I'm interested in your property "${property.title}" on RentEase.`;
        window.open(`https://wa.me/91${owner.phone}?text=${encodeURIComponent(message)}`, '_blank');
        trackContact('whatsapp');
        break;
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

  const isOwnerViewing = !!(property && property.owner && user && (user.id === property.owner._id || user.id === property.owner.id));
  const canReview = !!(property && property.owner && user && isAuthenticated && !isOwnerViewing);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate(`/auth?redirect=${encodeURIComponent(`/property/${id}`)}`);
    if (!userRating) return toast.error('Please select a rating');

    try {
      setSubmittingReview(true);
      await axios.post(`/api/reviews/property/${id}`, { rating: userRating, comment: userComment });
      await fetchReviews();
      toast.success('Review saved');
    } catch (error) {
      toast.error('Failed to save review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <PageLoader text="Curating details..." />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/20 dark:bg-primary-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Breadcrumb & Quick Actions Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Listings Inventory</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied');
              }}
              className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-600 rounded-xl transition-all"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-xl transition-all ${isFavorite
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-red-500'
                }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">

            {/* Premium Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-luxury border border-white/20 dark:border-slate-800/50"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 6000 }}
                className="h-[500px] md:h-[600px] group"
              >
                {property.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-sm border border-white/20">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{property.propertyType}</span>
                </div>
              </div>
            </motion.div>

            {/* Property Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                    <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                    <span className="text-lg">{property.location.address}, {property.location.city}</span>
                  </div>
                </div>
              </div>

              {/* Key Amenities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="glass-card !p-6 flex flex-col items-center text-center border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                  <Bed className="h-6 w-6 text-primary-600 mb-3" />
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{property.bhk}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuration</span>
                </div>
                <div className="glass-card !p-6 flex flex-col items-center text-center border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                  <Square className="h-6 w-6 text-primary-600 mb-3" />
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{property.area} <span className="text-sm font-medium">sqft</span></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Built Area</span>
                </div>
                <div className="glass-card !p-6 flex flex-col items-center text-center border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                  <Zap className="h-6 w-6 text-primary-600 mb-3" />
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{property.furnishing}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Setup</span>
                </div>
                <div className="glass-card !p-6 flex flex-col items-center text-center border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                  <Shield className="h-6 w-6 text-primary-600 mb-3" />
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Verified</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight flex items-center">
                    <Info className="h-5 w-5 mr-3 text-primary-500" />
                    Property Description
                  </h3>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {property.description}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight flex items-center">
                    <Zap className="h-5 w-5 mr-3 text-primary-500" />
                    Modern Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-12 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Community Feedback</h3>
                {averageRating && (
                  <div className="flex items-center bg-accent-50 dark:bg-accent-900/20 px-4 py-2 rounded-2xl border border-accent-100 dark:border-accent-800/30">
                    <Star className="h-4 w-4 text-accent-500 fill-current mr-2" />
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{averageRating.toFixed(1)}</span>
                    <span className="text-slate-400 mx-2">/</span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{totalReviews} Reviews</span>
                  </div>
                )}
              </div>

              {reviewsLoading ? (
                <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass-card !p-6 border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-lg">
                            {review.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{review.user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-accent-500 fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}

              {canReview && (
                <form onSubmit={handleSubmitReview} className="bg-slate-100 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-widest text-xs">Share Your Experience</p>
                  <div className="flex items-center space-x-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setUserRating(star)} className="focus:outline-none group">
                        <Star className={`h-8 w-8 transition-all ${userRating >= star ? 'text-accent-500 fill-current' : 'text-slate-300 group-hover:text-accent-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    className="w-full bg-white dark:bg-slate-950 border-none rounded-2xl p-6 text-sm focus:ring-2 focus:ring-primary-500 mb-6 shadow-sm dark:text-white"
                    placeholder="Tell us about the property and your experience..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                  />
                  <button type="submit" disabled={submittingReview || !userRating} className="btn-primary w-full !py-4 shadow-primary-500/20">
                    {submittingReview ? 'Posting...' : 'Post Verification Review'}
                  </button>
                </form>
              )}
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-6"
            >
              {/* Pricing Card */}
              <div className="glass-panel !p-1 shadow-luxury rounded-[2rem] border-white/20">
                <div className="bg-slate-950 rounded-[1.8rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px] rounded-full" />

                  <div className="mb-8">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2">Monthly Rent</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold">{formatRent(property.rent)}</span>
                      <span className="text-slate-500 text-sm font-medium">/mo</span>
                    </div>
                    {property.deposit > 0 && (
                      <p className="text-sm text-slate-400 mt-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-primary-500" />
                        Deposit: {formatRent(property.deposit)}
                      </p>
                    )}
                  </div>

                  {/* Owner Brief */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-xl shadow-lg border border-white/20">
                        {property.owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold flex items-center">
                          {property.owner.name}
                          {property.owner.isVerified && <Verified className="h-4 w-4 ml-1.5 text-blue-400" />}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Owner</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button onClick={handleMessageOwner} className="btn-primary w-full !py-4 flex items-center justify-center space-x-3 shadow-primary-500/30">
                      <MessageCircle className="h-5 w-5" />
                      <span>Start Chat in App</span>
                    </button>
                    <button onClick={() => handleContact('whatsapp')} className="btn-secondary w-full !bg-white/10 !text-white !border-white/10 !py-4 flex items-center justify-center space-x-3 hover:!bg-white hover:!text-slate-950">
                      <MessageCircle className="h-5 w-5" />
                      <span>Connect on WhatsApp</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleContact('phone')} className="py-3 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 flex items-center justify-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </button>
                      <button onClick={() => handleContact('email')} className="py-3 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 flex items-center justify-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-slate-500 font-bold mt-6 uppercase tracking-widest">Direct Connect â€¢ No Brokerage</p>
                </div>
              </div>

              {/* Quick Specs Sidebar */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-widest text-[10px]">Property Registry</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-slate-500 font-medium text-sm">Status</span>
                    <span className="text-green-500 font-bold text-sm">Active Inventory</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-slate-500 font-medium text-sm">Registry ID</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">#{property._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-500 font-medium text-sm">Listing Date</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
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
