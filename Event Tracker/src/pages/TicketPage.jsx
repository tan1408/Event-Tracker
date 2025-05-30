import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventService } from '../services/events'
import Loader from '../components/common/Loader'
import TicketCard from '../components/tickets/TicketCard'
import Button from '../components/common/Button'

const TicketPage = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const data = await eventService.getTicketById(id)
        setTicket(data.ticket)
        setEvent(data.event)
      } catch (error) {
        setError('Ticket not found')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTicket()
  }, [id])
  
  if (loading) {
    return (
      <div className="mt-16 min-h-screen flex items-center justify-center">
        <Loader size="xl" />
      </div>
    )
  }
  
  if (error || !ticket || !event) {
    return (
      <div className="mt-16 min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Not Found</h2>
        <p className="text-gray-600 mb-8">The ticket you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="mt-16 min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Ticket</h1>
            <p className="text-gray-600">
              Please present this ticket at the event. You can download it or share it with others.
            </p>
          </div>
          
          <TicketCard ticket={ticket} event={event} />
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link to={`/events/${event.id}`}>
              <Button variant="outline">
                View Event Details
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button variant="primary">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketPage