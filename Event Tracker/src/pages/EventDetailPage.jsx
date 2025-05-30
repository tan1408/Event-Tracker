import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { FiCalendar, FiClock, FiMapPin, FiUser, FiUsers, FiDollarSign, FiShare2, FiHeart, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import RsvpForm from '../components/events/RsvpForm'

const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getEventById, userRsvps, deleteEvent, loading } = useEvents()
  
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRsvpForm, setShowRsvpForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        const eventData = await getEventById(id)
        setEvent(eventData)
      } catch (error) {
        setError('Event not found')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvent()
  }, [id, getEventById])
  
  // Check if user has already RSVP'd to this event
  const userRsvp = userRsvps.find(rsvp => rsvp.eventId === id)
  const hasRsvpd = Boolean(userRsvp)
  
  // Check if user is the organizer
  const isOrganizer = isAuthenticated && event?.organizer?.id === user?.id
  
  // Format dates
  const formattedDate = event ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : ''
  const formattedTime = event ? format(new Date(event.date), 'h:mm a') : ''
  const formattedEndTime = event ? format(new Date(event.endDate), 'h:mm a') : ''
  
  // Capacity
  const availableSpots = event ? event.capacity - event.attendeeCount : 0
  const isFull = availableSpots <= 0
  
  // Calculate capacity percentage for progress bar
  const capacityPercentage = event
    ? Math.min(Math.round((event.attendeeCount / event.capacity) * 100), 100)
    : 0
  
  // Determine color for capacity bar
  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'bg-red-500'
    if (capacityPercentage >= 70) return 'bg-orange-500'
    return 'bg-green-500'
  }
  
  // Share event
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'))
    }
  }
  
  // Delete event
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id)
      navigate('/dashboard')
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="mt-16 min-h-screen flex items-center justify-center">
        <Loader size="xl" />
      </div>
    )
  }
  
  if (error || !event) {
    return (
      <div className="mt-16 min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events">
          <Button variant="primary">Browse Events</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="mt-16 min-h-screen pb-16">
      {/* Banner */}
      <div className="h-64 sm:h-96 relative overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs rounded-full mb-4">
                {event.category}
              </span>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <div className="flex items-center mr-6">
                  <FiCalendar className="mr-2 text-primary-500" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center">
                  <FiClock className="mr-2 text-primary-500" />
                  <span>{formattedTime} - {formattedEndTime}</span>
                </div>
              </div>
              
              {/* Organizer */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                  <img
                    src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`}
                    alt={event.organizer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organized by</p>
                  <p className="font-medium">{event.organizer.name}</p>
                </div>
              </div>
              
              {/* Actions buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {!isOrganizer && isAuthenticated && (
                  <>
                    {hasRsvpd ? (
                      <Link to={`/tickets/${userRsvp.id}`}>
                        <Button variant="outline" icon={<FiCalendar />}>
                          View Ticket
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="primary"
                        icon={<FiCalendar />}
                        onClick={() => setShowRsvpForm(true)}
                        disabled={isFull}
                      >
                        {isFull ? 'Event Full' : 'RSVP Now'}
                      </Button>
                    )}
                  </>
                )}
                
                {isOrganizer && (
                  <>
                    <Link to={`/dashboard`}>
                      <Button variant="outline" icon={<FiEdit />}>
                        Edit Event
                      </Button>
                    </Link>
                    
                    <Button
                      variant="danger"
                      icon={<FiTrash2 />}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  icon={<FiShare2 />}
                  onClick={handleShare}
                >
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  icon={<FiHeart />}
                >
                  Save
                </Button>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>
              </div>
              
              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                  <FiMapPin className="text-primary-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              {/* Date and time */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Date and Time</h3>
                <div className="flex items-center text-gray-700 mb-2">
                  <FiCalendar className="mr-2 text-primary-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiClock className="mr-2 text-primary-500" />
                  <span>{formattedTime} - {formattedEndTime}</span>
                </div>
              </div>
              
              {/* Location */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="flex items-start text-gray-700">
                  <FiMapPin className="mr-2 text-primary-500 mt-1" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              {/* Price */}
              {event.price > 0 ? (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Price</h3>
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2 text-primary-500" />
                    <span className="text-gray-700 text-lg font-bold">${event.price.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Price</h3>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    Free
                  </span>
                </div>
              )}
              
              {/* Capacity */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Capacity</h3>
                  <div className="flex items-center">
                    <FiUsers className="mr-1 text-primary-500" />
                    <span className="text-gray-700">
                      {event.attendeeCount} / {event.capacity}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`${getCapacityColor()} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
                
                {isFull ? (
                  <p className="text-red-500 text-sm">This event is sold out</p>
                ) : (
                  <p className="text-gray-600 text-sm">{availableSpots} spots remaining</p>
                )}
              </div>
              
              {/* RSVP form toggle or ticket link */}
              {!isOrganizer && isAuthenticated ? (
                hasRsvpd ? (
                  <Link to={`/tickets/${userRsvp.id}`} className="w-full">
                    <Button fullWidth variant="primary" icon={<FiCalendar />}>
                      View Your Ticket
                    </Button>
                  </Link>
                ) : (
                  <Button
                    fullWidth
                    variant={showRsvpForm ? 'outline' : 'primary'}
                    onClick={() => setShowRsvpForm(!showRsvpForm)}
                    disabled={isFull}
                  >
                    {isFull ? 'Event Full' : showRsvpForm ? 'Hide RSVP Form' : 'RSVP Now'}
                  </Button>
                )
              ) : !isAuthenticated ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Sign in to RSVP for this event</p>
                  <Link to="/login" className="w-full">
                    <Button fullWidth variant="primary">
                      Log In
                    </Button>
                  </Link>
                </div>
              ) : null}
            </div>
            
            {/* RSVP Form */}
            {showRsvpForm && !hasRsvpd && !isOrganizer && (
              <div className="mt-6 animate-fade-in">
                <RsvpForm event={event} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Delete Event</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
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
                onClick={handleDeleteEvent}
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

export default EventDetailPage