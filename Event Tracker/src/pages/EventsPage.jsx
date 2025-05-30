import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiFilter, FiX, FiSearch, FiCalendar } from 'react-icons/fi'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import DatePicker from 'react-datepicker'

const EventsPage = () => {
  const location = useLocation()
  const { events, loading } = useEvents()
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 12
  
  // Get URL search params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [location.search])
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedDate, priceRange])
  
  // Filter events
  const filteredEvents = events.filter((event) => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category filter
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory
    
    // Date filter
    const matchesDate = !selectedDate || 
      new Date(event.date).toDateString() === selectedDate.toDateString()
    
    // Price filter
    const matchesPrice = 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesDate && matchesPrice
  })
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )
  
  // Get categories from events
  const categories = ['All', ...new Set(events.map(event => event.category))]
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage)
  
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDate(null)
    setPriceRange([0, 500])
  }
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
  }
  
  return (
    <div className="mt-16 min-h-screen">
      <div className="bg-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Explore Events</h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
            <form onSubmit={handleSearchSubmit} className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-primary-300 text-gray-800"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </form>
            
            <Button
              variant="transparent"
              className="ml-0 md:ml-4 text-white border border-white/30 hover:bg-white/10"
              icon={showFilters ? <FiX /> : <FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm py-4 animate-slide-up">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    category !== 'All' && (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Select a date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    isClearable
                  />
                  <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-600">${priceRange[1]}</span>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleClearFilters}
                  className="w-full md:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Events list */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="mb-8 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, sortedEvents.length)} of {sortedEvents.length} events
              </p>
              
              <div>
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  onChange={(e) => {
                    // Logic for sorting (could be implemented)
                  }}
                >
                  <option value="date-asc">Date: Upcoming first</option>
                  <option value="date-desc">Date: Latest first</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-l-md rounded-r-none"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border ${
                        currentPage === page
                          ? 'bg-primary-50 border-primary-500 text-primary-600 z-10'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-r-md rounded-l-none"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="primary" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage