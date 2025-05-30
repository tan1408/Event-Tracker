import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiPlus, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [location])

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-primary-900/90 to-primary-700/90 text-white py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">
            Event<span className={`${isScrolled ? 'text-primary-600' : 'text-secondary-300'}`}>Tracker</span>
          </span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/events" 
            className={({ isActive }) => 
              `text-sm font-medium transition-colors ${
                isScrolled
                  ? isActive ? 'text-primary-600' : 'text-gray-800 hover:text-primary-600'
                  : isActive ? 'text-secondary-300' : 'text-white hover:text-secondary-300'
              }`
            }
          >
            Explore Events
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${
                    isScrolled
                      ? isActive ? 'text-primary-600' : 'text-gray-800 hover:text-primary-600'
                      : isActive ? 'text-secondary-300' : 'text-white hover:text-secondary-300'
                  }`
                }
              >
                Dashboard
              </NavLink>
              
              <Link 
                to="/create-event" 
                className={`btn ${isScrolled ? 'btn-primary' : 'btn-secondary'} flex items-center space-x-1`}
              >
                <FiPlus size={16} />
                <span>Create Event</span>
              </Link>
              
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src={user?.avatarUrl || 'https://i.pravatar.cc/150?img=1'}
                      alt={user?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 animate-fade-in">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="mr-2" size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiCalendar className="mr-2" size={16} />
                      <span>My Events</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-sm font-medium transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-secondary-300'
                }`}
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className={`btn ${isScrolled ? 'btn-primary' : 'btn-secondary'}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? (
            <FiX className={isScrolled ? 'text-gray-800' : 'text-white'} />
          ) : (
            <FiMenu className={isScrolled ? 'text-gray-800' : 'text-white'} />
          )}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-up z-40">
            <nav className="flex flex-col py-4">
              <Link
                to="/events"
                className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium"
              >
                Explore Events
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-event"
                    className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-3 text-left text-red-600 hover:bg-gray-100 font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 bg-primary-600 text-white font-medium m-4 rounded-md text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header