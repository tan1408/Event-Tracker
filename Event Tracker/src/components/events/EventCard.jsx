import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'

const EventCard = ({ event, isCompact = false }) => {
  const { title, description, date, location, imageUrl, organizer, capacity, attendeeCount, category } = event
  const { isAuthenticated } = useAuth()
  
  const formattedDate = format(new Date(date), 'MMM dd, yyyy')
  const formattedTime = format(new Date(date), 'h:mm a')
  const availableSpots = capacity - attendeeCount
  const isFull = availableSpots <= 0
  
  // Calculate capacity percentage for progress bar
  const capacityPercentage = Math.min(Math.round((attendeeCount / capacity) * 100), 100)
  
  // Determine color for capacity bar
  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'bg-red-500'
    if (capacityPercentage >= 70) return 'bg-orange-500'
    return 'bg-green-500'
  }
  
  if (isCompact) {
    return (
      <Link to={`/events/${event.id}`} className="group">
        <div className="card hover:translate-y-[-4px] transition-all duration-300">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute bottom-2 left-2 bg-primary-600 text-white px-2 py-0.5 text-xs rounded">
              {category}
            </span>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <FiCalendar className="mr-1" size={12} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="flex items-center text-gray-600">
                <FiUsers className="mr-1" size={12} />
                <span>{isFull ? 'Sold out' : `${availableSpots} spots left`}</span>
              </div>
              <span className="text-primary-600 font-medium">View →</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="card hover:translate-y-[-4px] transition-all duration-300">
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span className="absolute bottom-3 left-3 bg-primary-600 text-white px-2 py-0.5 text-xs rounded">
          {category}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-2 text-primary-500" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2 text-primary-500" />
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiMapPin className="mr-2 text-primary-500" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 font-medium">Capacity</span>
            <span className="text-sm text-gray-600">{attendeeCount} / {capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${getCapacityColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {isFull ? (
              <span className="text-red-500 font-medium">Sold out</span>
            ) : (
              <span>{availableSpots} spots remaining</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            By <span className="font-medium text-gray-700">{organizer.name}</span>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/events/${event.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Link to={`/events/${event.id}`}>
                <Button 
                  variant="primary" 
                  size="sm"
                  disabled={isFull}
                >
                  {isFull ? 'Sold Out' : 'RSVP'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard