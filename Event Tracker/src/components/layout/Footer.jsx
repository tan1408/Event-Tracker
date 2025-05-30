import { Link } from 'react-router-dom'
import { FiCalendar, FiMail, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <FiCalendar className="text-secondary-500 mr-2" size={24} />
              <span className="text-xl font-bold">EventTracker</span>
            </div>
            <p className="text-gray-400 mb-4">
              Create, manage, and discover amazing events. Connect with people and make memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                <FiGithub size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Event Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-4">Have questions or feedback? We'd love to hear from you.</p>
            <div className="flex items-center text-gray-400 mb-2">
              <FiMail className="mr-2" />
              <span>support@eventtracker.com</span>
            </div>
            <form className="mt-4">
              <label htmlFor="subscribe" className="block text-sm font-medium text-gray-400 mb-1">
                Subscribe to our newsletter
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="subscribe"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-secondary-600 text-white px-4 py-2 rounded-r-md hover:bg-secondary-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} EventTracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer