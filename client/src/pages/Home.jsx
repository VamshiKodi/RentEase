import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Home as HomeIcon,
  MapPin,
  Building2,
  IndianRupee,
  Star,
  ArrowRight,
  Search
} from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { CardLoader } from '../components/Loader';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    bhk: '',
    budget: ''
  });

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchFilters.location) params.set('city', searchFilters.location);
    if (searchFilters.propertyType) params.set('propertyType', searchFilters.propertyType);
    if (searchFilters.bhk) params.set('bhk', searchFilters.bhk);
    if (searchFilters.budget) params.set('maxRent', searchFilters.budget);

    navigate(`/browse?${params.toString()}`);
  };

  const stats = [
    { label: 'Properties', value: '10,000+', icon: HomeIcon },
    { label: 'Happy Tenants', value: '25,000+', icon: Users },
    { label: 'Verified Owners', value: '5,000+', icon: ShieldCheck },
    { label: 'Cities Covered', value: '50+', icon: MapPin }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer, Bengaluru',
      content: 'Found my apartment without paying brokerage. The listings felt genuine and the process was smooth.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Owner, Hyderabad',
      content: 'I could directly connect with tenants and close quickly. No broker calls, no unnecessary delays.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Working Professional, Mumbai',
      content: 'Clean UI, easy filters, and I liked the trust indicators. It felt safe compared to random classifieds.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 overflow-hidden bg-[#faf6f1]">
        <div className="absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-primary-100 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-primary-100 blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e8dfd3] text-xs font-semibold text-[#5c4d3c] shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                <span>Trusted by 50,000+ renters in India</span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3d3226] leading-tight">
                Find Your Perfect Rental Home <span className="text-primary-500">— Broker Free</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#5c4d3c] leading-relaxed max-w-xl">
                Connect directly with verified property owners. Save on brokerage and find your ideal home in minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/browse" className="btn-primary w-full sm:w-auto">Browse Properties</Link>
                <Link to="/add-property" className="btn-outline w-full sm:w-auto">Post Your Property</Link>
              </div>

              <div className="mt-8">
                <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#a89b8c] mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89b8c]" />
                        <select
                          value={searchFilters.location}
                          onChange={(e) => setSearchFilters((s) => ({ ...s, location: e.target.value }))}
                          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#e8dfd3] focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-[#3d3226]"
                        >
                          <option value="">Select city</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Pune">Pune</option>
                          <option value="Chennai">Chennai</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#a89b8c] mb-1">Property type</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89b8c]" />
                        <select
                          value={searchFilters.propertyType}
                          onChange={(e) => setSearchFilters((s) => ({ ...s, propertyType: e.target.value }))}
                          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#e8dfd3] focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-[#3d3226]"
                        >
                          <option value="">Any</option>
                          <option value="Apartment">Apartment</option>
                          <option value="House">House</option>
                          <option value="Villa">Villa</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#a89b8c] mb-1">Budget (max)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89b8c]" />
                        <select
                          value={searchFilters.budget}
                          onChange={(e) => setSearchFilters((s) => ({ ...s, budget: e.target.value }))}
                          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#e8dfd3] focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-[#3d3226]"
                        >
                          <option value="">Any</option>
                          <option value="10000">₹10,000</option>
                          <option value="20000">₹20,000</option>
                          <option value="30000">₹30,000</option>
                          <option value="50000">₹50,000</option>
                          <option value="100000">₹1,00,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#a89b8c] mb-1">BHK</label>
                      <div className="relative">
                        <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89b8c]" />
                        <select
                          value={searchFilters.bhk}
                          onChange={(e) => setSearchFilters((s) => ({ ...s, bhk: e.target.value }))}
                          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#e8dfd3] focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-[#3d3226]"
                        >
                          <option value="">Any</option>
                          <option value="1RK">1RK</option>
                          <option value="1BHK">1BHK</option>
                          <option value="2BHK">2BHK</option>
                          <option value="3BHK">3BHK</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button type="submit" className="btn-primary !py-3 !px-5 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-white border border-[#e8dfd3] shadow-sm overflow-hidden">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#faf6f1] to-white" />
                <div className="absolute inset-0 p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-4 w-4/5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[#3d3226]">2BHK • Apartment</div>
                        <div className="text-sm font-extrabold text-primary-500">₹25k/mo</div>
                      </div>
                      <div className="mt-1 text-xs text-[#a89b8c]">Koramangala, Bengaluru</div>
                      <div className="mt-3 h-2 w-24 rounded-full bg-primary-100" />
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-4 w-5/6 ml-auto">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[#3d3226]">1BHK • Studio</div>
                        <div className="text-sm font-extrabold text-primary-500">₹18k/mo</div>
                      </div>
                      <div className="mt-1 text-xs text-[#a89b8c]">Andheri East, Mumbai</div>
                      <div className="mt-3 h-2 w-20 rounded-full bg-primary-100" />
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-4 w-4/5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[#3d3226]">3BHK • House</div>
                        <div className="text-sm font-extrabold text-primary-500">₹40k/mo</div>
                      </div>
                      <div className="mt-1 text-xs text-[#a89b8c]">Gachibowli, Hyderabad</div>
                      <div className="mt-3 h-2 w-28 rounded-full bg-[#f5efe6]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.06 }}
                className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <stat.icon className="h-5 w-5 text-primary-500" />
                <div className="mt-3 text-2xl font-extrabold text-primary-600">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-[#a89b8c]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why RentEase Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3d3226]">How it works</h2>
            <p className="mt-3 text-[#5c4d3c] max-w-2xl mx-auto">
              A simple, transparent flow designed for students and working professionals.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#3d3226]">Browse verified properties</h3>
              <p className="mt-2 text-sm text-[#5c4d3c]">Filter by city, budget, BHK, and property type in seconds.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#3d3226]">Connect directly with owner</h3>
              <p className="mt-2 text-sm text-[#5c4d3c]">No broker calls. Ask questions and schedule visits directly.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-[#f5efe6] flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#3d3226]">Move in without brokerage</h3>
              <p className="mt-2 text-sm text-[#5c4d3c]">Save money and time with a trusted, broker-free process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-[#faf6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e8dfd3] text-xs font-semibold text-[#5c4d3c] shadow-sm mb-4">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                <span>Featured listings</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3d3226] tracking-tight">Featured Properties</h2>
              <p className="mt-2 text-[#5c4d3c] max-w-xl">Popular rentals people are viewing right now.</p>
            </div>
            <Link to="/browse" className="btn-secondary group flex items-center space-x-2">
              <span>View All Inventory</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <CardLoader key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3d3226] mb-4 tracking-tight">What people say</h2>
            <p className="text-[#5c4d3c] max-w-2xl mx-auto">Real feedback from renters and owners across Indian cities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#faf6f1] rounded-2xl border border-[#e8dfd3] shadow-sm p-6 h-full flex flex-col">
                  <div className="flex items-center mb-8 space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#5c4d3c] mb-10 leading-relaxed font-medium">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-auto flex items-center space-x-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-primary-500 text-white rounded-2xl shadow-sm">
                      <span className="text-lg font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-[#3d3226] leading-none mb-1">{testimonial.name}</p>
                      <p className="text-xs font-semibold text-[#a89b8c]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#faf6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-[#e8dfd3] shadow-sm p-8 sm:p-10"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Broker-free rentals</span>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#3d3226]">Ready to rent smarter?</h2>
                <p className="mt-2 text-[#5c4d3c] max-w-2xl">Browse listings or post your property and connect directly with people—no middlemen.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Link to="/browse" className="btn-primary w-full sm:w-auto">Browse Properties</Link>
                <Link to="/add-property" className="btn-outline w-full sm:w-auto">Post Your Property</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
