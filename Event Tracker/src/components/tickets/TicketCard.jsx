import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import QRCode from 'react-qr-code'
import { FiCalendar, FiMapPin, FiClock, FiUser, FiUsers } from 'react-icons/fi'
import Button from '../common/Button'

const TicketCard = ({ ticket, event, showButtons = true }) => {
  const [ticketNumber, setTicketNumber] = useState('')
  
  useEffect(() => {
    if (ticket?.ticketNumber) {
      // Add dashes to ticket number for better readability
      const formatted = ticket.ticketNumber.replace(/(\w{4})(?=\w)/g, '$1-')
      setTicketNumber(formatted)
    }
  }, [ticket])
  
  if (!ticket || !event) {
    return null
  }
  
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy')
  const formattedTime = format(new Date(event.date), 'h:mm a')
  const qrValue = JSON.stringify({
    ticketId: ticket.id,
    eventId: event.id,
    ticketNumber: ticket.ticketNumber,
    attendee: ticket.name,
  })
  
  const handleDownload = () => {
    // Logic to handle ticket download or print
    window.print()
  }
  
  const handleShare = () => {
    // Logic to share ticket
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${event.title}`,
        text: `I'm attending ${event.title} on ${formattedDate}!`,
        url: window.location.href,
      })
    } else {
      alert('Sharing is not supported in this browser')
    }
  }
  
  return (
    <div className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary-100 rounded-full blur-3xl opacity-20"></div>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 relative z-10 overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm opacity-90">
            <div className="flex items-center mr-4 mb-1 sm:mb-0">
              <FiCalendar className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Ticket stub decoration */}
        <div className="relative">
          <div className="absolute left-0 right-0 flex justify-between px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full bg-gray-100 -mt-3 border-b border-dashed border-gray-300"
              ></div>
            ))}
          </div>
          <div className="border-b border-dashed border-gray-300 pt-3"></div>
        </div>
        
        {/* Ticket body */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row">
            {/* Left column - Details */}
            <div className="flex-1 pr-0 lg:pr-8 mb-6 lg:mb-0">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendee Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <div className="flex items-center mt-1">
                      <FiUser className="text-primary-500 mr-2" />
                      <p className="font-medium">{ticket.name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium mt-1">{ticket.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Ticket Number</p>
                    <p className="font-mono text-primary-700 font-medium mt-1">{ticketNumber}</p>
                  </div>
                  
                  {ticket.additionalGuests > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Additional Guests</p>
                      <div className="flex items-center mt-1">
                        <FiUsers className="text-primary-500 mr-2" />
                        <p className="font-medium">{ticket.additionalGuests}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Event Location</h3>
                <div className="flex items-start">
                  <FiMapPin className="text-primary-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                
                {event.price > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Admission Fee</p>
                    <p className="font-bold text-lg">${event.price.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - QR Code */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                <QRCode
                  value={qrValue}
                  size={150}
                  level="H"
                  fgColor="#4f46e5"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Scan for check-in</p>
            </div>
          </div>
        </div>
        
        {/* Ticket footer */}
        {showButtons && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-3 sm:mb-0">
              Please present this ticket when you arrive at the event.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                icon={
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                }
              >
                Share
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                icon={
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketCard