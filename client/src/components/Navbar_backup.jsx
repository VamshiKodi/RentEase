import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/browse', label: 'Browse', icon: Search },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-luxury border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary-600 to-luxury-600 text-white p-3 rounded-2xl shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-2xl font-display font-black bg-gradient-to-r from-slate-900 to-primary-700 bg-clip-text text-transparent">RentEase</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(path)
                    ? 'text-white bg-gradient-to-r from-primary-600 to-luxury-600 shadow-lg'
                    : 'text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-luxury-500 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.userType === 'owner' && (
                  <Link
                    to="/add-property"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Property</span>
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-gradient-to-br from-primary-500 to-luxury-600 text-white p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury border border-slate-200/50 z-50">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-luxury-50 hover:text-primary-700 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => {
                            console.log('Dashboard clicked');
                            setShowDropdown(false);
                          }}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl mx-2"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth" className="btn-secondary">
                  Login
                </Link>
                <Link to="/auth?mode=register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  
                  {user?.userType === 'owner' && (
                    <Link
                      to="/add-property"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Property</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
