import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUser, FiRefreshCw, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import EventCard from '../components/events/EventCard'

const DashboardPage = () => {
  const { user } = useAuth()
  const { userEvents, userRsvps, fetchUserEvents, fetchUserRsvps, loading, deleteEvent } = useEvents()
  const [activeTab, setActiveTab] = useState('myEvents')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  
  useEffect(() => {
    fetchUserEvents()
    fetchUserRsvps()
  }, [fetchUserEvents, fetchUserRsvps])
  
  const handleDeleteClick = (event) => {
    setEventToDelete(event)
    setShowDeleteModal(true)
  }
  
  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await deleteEvent(eventToDelete.id)
      setShowDeleteModal(false)
      setEventToDelete(null)
    }
  }
  
  const renderMyEvents = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )
    }
    
    if (userEvents.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-3">You haven't created any events yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first event</p>
          <Link to="/create-event">
            <Button variant="primary" icon={<FiPlus />}>
              Create Event
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="space-y-8">
        {userEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 h-48 md:h-auto">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 md:w-3/4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded mb-2">
                      {event.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/events/${event.id}`}>
                      <Button variant="outline" size="sm" icon={<FiEdit />}>
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={<FiTrash2 />}
                      onClick={() => handleDeleteClick(event)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-primary-500" />
                    <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-2 text-primary-500" />
                    <span>{format(new Date(event.date), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-primary-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between mt-6">
                  <div className="flex items-center text-sm mb-2 md:mb-0">
                    <FiUser className="mr-1 text-gray-500" />
                    <span className="text-gray-700 mr-1">{event.attendeeCount}</span>
                    <span className="text-gray-500">/ {event.capacity} attendees</span>
                  </div>
                  
                  <Link to={`/events/${event.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  const renderMyRsvps = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )
    }
    
    if (userRsvps.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-3">You haven't RSVP'd to any events yet</h3>
          <p className="text-gray-600 mb-6">Browse events and RSVP to attend</p>
          <Link to="/events">
            <Button variant="primary">
              Explore Events
            </Button>
          </Link>
        </div>
      )
    }
    
    // Get the corresponding event for each RSVP
    const rsvpsWithEvents = userRsvps.map(rsvp => {
      const event = userEvents.find(e => e.id === rsvp.eventId) || {
        id: rsvp.eventId,
        title: 'Event details not available',
        date: new Date().toISOString(),
        location: 'Location not available',
        imageUrl: 'https://via.placeholder.com/300x200?text=Event',
        category: 'Unknown',
      }
      
      return { ...rsvp, event }
    })
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rsvpsWithEvents.map((rsvp) => (
          <div key={rsvp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 relative">
              <img 
                src={rsvp.event.imageUrl} 
                alt={rsvp.event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="bg-primary-600 text-white px-2 py-0.5 text-xs rounded">
                  {rsvp.event.category}
                </span>
                <span className="bg-green-600 text-white px-2 py-0.5 text-xs rounded">
                  Confirmed
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{rsvp.event.title}</h3>
              
              <div className="space-y-1 text-sm mb-4">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-1 text-primary-500" size={14} />
                  <span>{format(new Date(rsvp.event.date), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-1 text-primary-500" size={14} />
                  <span className="truncate">{rsvp.event.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Ticket: <span className="font-mono text-primary-700">{rsvp.ticketNumber}</span>
                </div>
                
                <Link to={`/tickets/${rsvp.id}`}>
                  <Button variant="outline" size="sm">
                    View Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="mt-16 min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              icon={<FiRefreshCw />}
              onClick={() => {
                fetchUserEvents()
                fetchUserRsvps()
              }}
              disabled={loading}
            >
              Refresh
            </Button>
            
            <Link to="/create-event">
              <Button variant="primary" icon={<FiPlus />}>
                Create Event
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-primary-100">
                <img 
                  src={user?.avatarUrl || 'https://via.placeholder.com/150'} 
                  alt={user?.name || 'User'} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <h3 className="font-semibold text-primary-800 mb-1">My Events</h3>
              <p className="text-2xl font-bold">{userEvents.length}</p>
              <p className="text-gray-600 text-sm">Events you've organized</p>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
              <h3 className="font-semibold text-secondary-800 mb-1">My RSVPs</h3>
              <p className="text-2xl font-bold">{userRsvps.length}</p>
              <p className="text-gray-600 text-sm">Events you're attending</p>
            </div>
            
            <div className="bg-accent-50 p-4 rounded-lg border border-accent-100">
              <h3 className="font-semibold text-accent-800 mb-1">Upcoming</h3>
              <p className="text-2xl font-bold">
                {userRsvps.filter(rsvp => new Date(rsvp.createdAt) > new Date()).length}
              </p>
              <p className="text-gray-600 text-sm">Events coming soon</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'myEvents'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('myEvents')}
              >
                My Events
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'myRsvps'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('myRsvps')}
              >
                My RSVPs
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            {activeTab === 'myEvents' ? renderMyEvents() : renderMyRsvps()}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Delete Event</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{eventToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={loading}
              >
                Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage