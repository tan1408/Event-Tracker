import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiCalendar, FiMapPin, FiChevronRight } from 'react-icons/fi'
import { format } from 'date-fns'
import { useEvents } from '../context/EventContext'
import Button from '../components/common/Button'
import EventCard from '../components/events/EventCard'
import Loader from '../components/common/Loader'

const heroImages = [
  'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
]

const categories = [
  { name: 'Technology', icon: '💻', color: 'bg-blue-500' },
  { name: 'Music', icon: '🎵', color: 'bg-purple-500' },
  { name: 'Business', icon: '💼', color: 'bg-orange-500' },
  { name: 'Health', icon: '🧘', color: 'bg-green-500' },
  { name: 'Arts', icon: '🎨', color: 'bg-pink-500' },
  { name: 'Sports', icon: '⚽', color: 'bg-red-500' },
]

const HomePage = () => {
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentHeroImage, setCurrentHeroImage] = useState(0)
  
  useEffect(() => {
    // Rotate hero images
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/events?search=${encodeURIComponent(searchQuery)}`)
  }
  
  // Get upcoming events (first 4)
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)
  
  // Get featured event (event with most attendees)
  const featuredEvent = events
    .sort((a, b) => b.attendeeCount / b.capacity - a.attendeeCount / a.capacity)[0]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Parallax effect */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${
                index === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in">
              Discover and Create Memorable Events
            </h1>
            <p className="text-xl mb-8 text-gray-200 animate-fade-in">
              Find exciting events near you or create your own in minutes. 
              Connect with people and make memories that last a lifetime.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 animate-fade-in">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-primary-500 text-gray-800"
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-500" size={18} />
              </div>
              <Button type="submit" size="lg" variant="primary">
                Search
              </Button>
            </form>
            
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in">
              <Link to="/events" className="text-white hover:text-secondary-300 transition-colors">
                Browse All Events
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/create-event" className="text-white hover:text-secondary-300 transition-colors">
                Create Event
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/events?category=Technology" className="text-white hover:text-secondary-300 transition-colors">
                Tech Events
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Browse Events by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-xl mb-3`}>
                  {category.icon}
                </div>
                <span className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Featured Event
            </h2>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img 
                    src={featuredEvent.imageUrl} 
                    alt={featuredEvent.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs rounded-full mb-3">
                    {featuredEvent.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {featuredEvent.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {featuredEvent.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-primary-500" />
                      <span>{format(new Date(featuredEvent.date), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2 text-primary-500" />
                      <span>{featuredEvent.location}</span>
                    </div>
                  </div>
                  
                  <Link to={`/events/${featuredEvent.id}`}>
                    <Button 
                      variant="primary"
                      icon={<FiChevronRight />}
                      iconPosition="right"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Upcoming Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Upcoming Events
            </h2>
            
            <Link to="/events" className="text-primary-600 hover:text-primary-700 flex items-center">
              <span>View all</span>
              <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-gray-600 mb-6">Stay tuned for new events or create your own!</p>
              <Link to="/create-event">
                <Button variant="primary">Create an Event</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Own Event?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            It's easy to get started. Create an event in minutes and start collecting RSVPs right away.
          </p>
          <Link to="/create-event">
            <Button 
              variant="secondary" 
              size="lg"
              className="text-white shadow-xl hover:shadow-2xl transition-all"
            >
              Create an Event
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage