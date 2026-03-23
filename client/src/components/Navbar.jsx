import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  Moon,
  Sun,
  Heart,
  MessageCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    const shouldUseDark = stored ? stored === 'dark' : Boolean(prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const isActive = (path) => location.pathname === path;
  const hasUnreadMessages = unreadMessages > 0 && location.pathname !== '/messages';

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('how-it-works');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/browse', label: 'Browse', icon: Search },
    { path: '/#how-it-works', label: 'How It Works', icon: LayoutDashboard, onClick: handleHowItWorksClick },
    { path: '/favorites', label: 'Favorites', icon: Heart },
  ];

  useEffect(() => {
    let intervalId;

    const fetchUnread = async () => {
      if (!isAuthenticated) {
        setUnreadMessages(0);
        return;
      }

      try {
        const res = await axios.get('/api/messages/unread-count');
        setUnreadMessages(res.data.unreadCount || 0);
      } catch (error) {
        // Silently ignore notification errors
      }
    };

    fetchUnread();
    intervalId = setInterval(fetchUnread, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-[2000] bg-[#fdfbf7] border-b border-[#e8dfd3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 group relative shrink-0">
            <div className="bg-primary-500 text-white p-2 rounded-xl shadow-sm transition-all duration-300">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#3d3226]">RentEase</span>
          </Link>

          {/* Middle: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center px-10">
            {navLinks.map(({ path, label, icon: Icon, onClick }) => (
              onClick ? (
                <button
                  key={path}
                  onClick={onClick}
                  className={`flex items-center space-x-2 px-2 py-2 text-sm font-semibold transition-all duration-300 relative group/link ${location.hash === '#how-it-works'
                      ? 'text-[#3d3226]'
                      : 'text-[#5c4d3c] hover:text-[#3d3226]'
                    }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${location.hash === '#how-it-works' ? 'scale-110 text-primary-500' : 'group-hover/link:scale-110'}`} />
                  <span>{label}</span>
                  <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-primary-500 transition-transform duration-300 origin-left ${location.hash === '#how-it-works' ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'}`} />
                </button>
              ) : (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-2 py-2 text-sm font-semibold transition-all duration-300 relative group/link ${isActive(path)
                      ? 'text-[#3d3226]'
                      : 'text-[#5c4d3c] hover:text-[#3d3226]'
                    }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive(path) ? 'scale-110 text-primary-500' : 'group-hover/link:scale-110'}`} />
                  <span>{label}</span>
                  <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-primary-500 transition-transform duration-300 origin-left ${isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'}`} />
                </Link>
              )
            ))}
          </div>

          {/* Right: Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-6 shrink-0">
            {isAuthenticated ? (
              <>
                {user?.userType === 'owner' && (
                  <Link
                    to="/add-property"
                    className="btn-primary flex items-center space-x-2 !py-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Add Property</span>
                  </Link>
                )}

                <div className="relative profile-dropdown-container z-[9999]">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white hover:bg-[#f5efe6] transition-all duration-300 border border-[#e8dfd3]"
                  >
                    <span className="text-sm font-semibold text-[#3d3226] uppercase tracking-tight">{user?.name}</span>
                    <ChevronDown className={`h-4 w-4 text-[#a89b8c] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    <div className="bg-primary-500 text-white p-2 rounded-xl">
                      <User className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-[#e8dfd3] z-[9999] p-2 overflow-hidden shadow-lg"
                      >
                        <div className="space-y-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300 rounded-xl"
                            onClick={() => setShowDropdown(false)}
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/messages"
                            className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300 rounded-xl"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="relative">
                              <MessageCircle className="h-5 w-5" />
                              {hasUnreadMessages && (
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white ring-2 ring-red-500/20" />
                              )}
                            </div>
                            <span>Messages</span>
                          </Link>
                          {user?.userType === 'owner' && (
                            <Link
                              to="/owner/analytics"
                              className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300 rounded-xl"
                              onClick={() => setShowDropdown(false)}
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              <span>Analytics</span>
                            </Link>
                          )}
                          {user?.userType === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300 rounded-xl"
                              onClick={() => setShowDropdown(false)}
                            >
                              <ShieldCheck className="h-5 w-5" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                          <div className="h-px bg-[#e8dfd3] my-1 mx-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-[#fef2f2] transition-all duration-300 rounded-xl"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth" className="btn-secondary !py-2 !px-5 text-sm">
                  Login
                </Link>
                <Link to="/auth?mode=register" className="btn-primary !py-2 !px-5 text-sm">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#5c4d3c] hover:bg-[#f5efe6] transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#e8dfd3] overflow-hidden"
            >
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {navLinks.map(({ path, label, icon: Icon, onClick }) => (
                    onClick ? (
                      <button
                        key={path}
                        onClick={onClick}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${location.hash === '#how-it-works'
                            ? 'text-primary-500 bg-[#fff8f1]'
                            : 'text-[#5c4d3c] hover:text-[#3d3226] hover:bg-[#f5efe6]'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </button>
                    ) : (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive(path)
                            ? 'text-primary-500 bg-[#fff8f1]'
                            : 'text-[#5c4d3c] hover:text-[#3d3226] hover:bg-[#f5efe6]'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </Link>
                    )
                  ))}
                </div>

                <div className="h-px bg-[#e8dfd3] mx-4" />

                {isAuthenticated ? (
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300"
                    >
                      <div className="relative">
                        <MessageCircle className="h-5 w-5" />
                        {hasUnreadMessages && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                        )}
                      </div>
                      <span>Messages</span>
                    </Link>
                    {user?.userType === 'owner' && (
                      <>
                        <Link
                          to="/owner/analytics"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Analytics</span>
                        </Link>
                        <Link
                          to="/add-property"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold bg-primary-500 text-white"
                        >
                          <Plus className="h-5 w-5" />
                          <span>Add Property</span>
                        </Link>
                      </>
                    )}
                    {user?.userType === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-[#5c4d3c] hover:bg-[#f5efe6] hover:text-[#3d3226] transition-all duration-300"
                      >
                        <ShieldCheck className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-[#fef2f2] transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-4">
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary text-center shadow-primary-500/20"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
