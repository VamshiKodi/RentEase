import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home as HomeIcon,
  MapPin
} from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { CardLoader } from '../components/Loader';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('/api/houses?limit=6&sortBy=views&sortOrder=desc');
      setFeaturedProperties(response.data.houses);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/browse?${params.toString()}`);
  };

  const features = [
    {
      icon: Shield,
      title: 'No Commission',
      description: 'Connect directly with owners. Zero brokerage fees.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Users,
      title: 'Verified Owners',
      description: 'All property owners are verified for your safety.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Get the best rental prices without middlemen.',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const stats = [
    { label: 'Properties Listed', value: '10,000+' },
    { label: 'Happy Tenants', value: '25,000+' },
    { label: 'Verified Owners', value: '5,000+' },
    { label: 'Cities Covered', value: '50+' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      content: 'Found my dream apartment in Mumbai without paying any brokerage. RentEase made it so simple!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Property Owner',
      content: 'As an owner, I love how I can directly connect with genuine tenants. No more broker hassles!',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Marketing Manager',
      content: 'The platform is user-friendly and the verification process gives me confidence in the listings.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-primary-900 to-luxury-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-500/30 to-luxury-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-500/20 to-gold-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block mb-6"
            >
              <span className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ✨ Zero Commission Platform
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight"
            >
              Find Your Dream Home
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-accent-400 bg-clip-text text-transparent">
                Without Paying Commission
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Connect directly with house owners and tenants. No brokers, no middlemen, no extra costs.
              <br />
              <span className="text-gold-300">Discover luxury living made simple.</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Link to="/browse" className="group relative bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-900 font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-glow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center">
                <span className="relative z-10 flex items-center">
                  Browse Properties
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              <Link to="/auth?mode=register" className="group relative border-3 border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                List Your Property
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 hover:scale-105 transform transition-all duration-300 shadow-xl">
                    <div className="text-3xl md:text-4xl font-display font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-200 text-sm md:text-base font-semibold">
                      {stat.label}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-primary-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-32 left-20 opacity-10">
          <HomeIcon className="h-48 w-48 text-gold-300 animate-float" />
        </div>
        <div className="absolute bottom-32 right-20 opacity-10">
          <MapPin className="h-40 w-40 text-luxury-300 animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-luxury-500 to-accent-500"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-center mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">
                Start Your Search
              </span>
            </h2>
            <p className="text-center text-slate-600 text-lg mb-8 font-medium">Find your perfect home in seconds</p>
            <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">
                Why Choose RentEase?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              We're revolutionizing the rental market by eliminating unnecessary costs and complications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-primary-300 shadow-luxury hover:shadow-luxury-lg transform hover:-translate-y-2 transition-all duration-500">
                  <div className={`inline-flex p-5 rounded-2xl ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary-500 to-luxury-500 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">
                Featured Properties
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              Discover the most popular rental properties in your area
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CardLoader key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard house={property} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/browse" className="group relative bg-gradient-to-r from-primary-600 to-luxury-600 hover:from-primary-700 hover:to-luxury-700 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-luxury hover:shadow-luxury-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden inline-flex items-center">
              <span className="relative z-10 flex items-center">
                View All Properties
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              Real experiences from real people
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border-2 border-slate-100 hover:border-gold-300 shadow-luxury hover:shadow-luxury-lg transform hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-gold-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed font-medium italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary-500 to-luxury-600 p-3 rounded-2xl">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{testimonial.name}</p>
                      <p className="text-slate-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-primary-900 to-luxury-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-primary-500 to-luxury-500"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Join thousands of users who have found their perfect home without paying commission
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth?mode=register&type=renter" className="group relative bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-900 font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-glow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Find a Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              <Link to="/auth?mode=register&type=owner" className="group relative border-3 border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                List Your Property
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
