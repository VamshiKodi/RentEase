import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ButtonLoader } from '../components/Loader';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLocationStep, setShowLocationStep] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const watchUserType = watch('userType');

  useEffect(() => {
    if (isAuthenticated && !showLocationStep) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, searchParams, showLocationStep]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const type = searchParams.get('type');
    
    if (mode === 'register') {
      setIsLogin(false);
    }
    
    if (type && (type === 'owner' || type === 'renter')) {
      reset({ userType: type });
    }
  }, [searchParams, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await login(data.email, data.password);
      } else {
        result = await register(data);
      }

      if (result.success) {
        if (!isLogin && data.userType === 'renter') {
          setShowLocationStep(true);
        } else {
          const redirect = searchParams.get('redirect') || '/dashboard';
          navigate(redirect);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowLocationStep(false);
    setGeoError('');
    setGeoLoading(false);
    reset();
  };

  const handleUseLocationAfterSignup = () => {
    if (!navigator.geolocation) {
      setGeoError('Location is not supported in this browser.');
      return;
    }

    setGeoError('');
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLoading(false);
        navigate(`/browse?lat=${latitude}&lng=${longitude}`);
      },
      (error) => {
        console.error('Geolocation error after signup:', error);
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

  const handleSkipLocation = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentEase</span>
            </Link>
            
            <h2 className="text-2xl font-bold text-gray-900">
              {showLocationStep
                ? 'Set Your Location'
                : isLogin
                  ? 'Welcome Back'
                  : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {showLocationStep
                ? 'Use your current location so we can show nearby homes right away.'
                : isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Join RentEase and find your perfect home'
              }
            </p>
          </div>

          {showLocationStep ? (
            <div className="space-y-6">
              {geoError && (
                <p className="text-sm text-red-600">{geoError}</p>
              )}
              <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700">
                  Use your current location so we can instantly show rental homes near you.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUseLocationAfterSignup}
                disabled={geoLoading}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2"
              >
                {geoLoading ? (
                  <>
                    <ButtonLoader />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <span>Use My Location</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleSkipLocation}
                className="w-full text-sm text-gray-600 hover:text-gray-800 mt-2"
              >
                Skip for now
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {!isLogin && (
                  <>
                    {/* User Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        I am a
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          watchUserType === 'renter' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            value="renter"
                            {...registerField('userType', { required: 'Please select user type' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <User className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Tenant</span>
                            <p className="text-xs text-gray-500 mt-1">Looking for a home</p>
                          </div>
                        </label>
                        
                        <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          watchUserType === 'owner' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            value="owner"
                            {...registerField('userType', { required: 'Please select user type' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <Building className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Owner</span>
                            <p className="text-xs text-gray-500 mt-1">Have property to rent</p>
                          </div>
                        </label>
                      </div>
                      {errors.userType && (
                        <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
                      )}
                    </div>

                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...registerField('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...registerField('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Please enter a valid 10-digit phone number'
                          }
                        })}
                        className="input-field"
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...registerField('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerField('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      className="input-field pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <ButtonLoader />
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={toggleMode}
                    className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Terms */}
              {!isLogin && (
                <p className="mt-4 text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
