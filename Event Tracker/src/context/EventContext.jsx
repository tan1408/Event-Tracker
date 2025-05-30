import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { eventService } from '../services/events'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [userEvents, setUserEvents] = useState([])
  const [userRsvps, setUserRsvps] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await eventService.getAllEvents()
      setEvents(data)
    } catch (error) {
      toast.error('Error fetching events')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserEvents = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const data = await eventService.getUserEvents(user.id)
      setUserEvents(data)
    } catch (error) {
      toast.error('Error fetching your events')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchUserRsvps = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const data = await eventService.getUserRsvps(user.id)
      setUserRsvps(data)
    } catch (error) {
      toast.error('Error fetching your RSVPs')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const getEventById = useCallback(async (id) => {
    try {
      setLoading(true)
      return await eventService.getEventById(id)
    } catch (error) {
      toast.error('Error fetching event details')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true)
      const newEvent = await eventService.createEvent(eventData)
      setEvents((prev) => [...prev, newEvent])
      setUserEvents((prev) => [...prev, newEvent])
      toast.success('Event created successfully!')
      return { success: true, eventId: newEvent.id }
    } catch (error) {
      toast.error(error.message || 'Error creating event')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEvent = useCallback(async (id, eventData) => {
    try {
      setLoading(true)
      const updatedEvent = await eventService.updateEvent(id, eventData)
      
      setEvents((prev) => 
        prev.map((event) => (event.id === id ? updatedEvent : event))
      )
      
      setUserEvents((prev) => 
        prev.map((event) => (event.id === id ? updatedEvent : event))
      )
      
      toast.success('Event updated successfully!')
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Error updating event')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true)
      await eventService.deleteEvent(id)
      
      setEvents((prev) => prev.filter((event) => event.id !== id))
      setUserEvents((prev) => prev.filter((event) => event.id !== id))
      
      toast.success('Event deleted successfully!')
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Error deleting event')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const rsvpToEvent = useCallback(async (eventId, userId, rsvpData) => {
    try {
      setLoading(true)
      const { event, rsvp } = await eventService.rsvpToEvent(eventId, userId, rsvpData)
      
      setEvents((prev) => 
        prev.map((e) => (e.id === eventId ? event : e))
      )
      
      // Update user RSVPs
      setUserRsvps((prev) => [...prev, rsvp])
      
      toast.success('RSVP successful!')
      return { success: true, ticketId: rsvp.id }
    } catch (error) {
      toast.error(error.message || 'Error submitting RSVP')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelRsvp = useCallback(async (rsvpId, eventId) => {
    try {
      setLoading(true)
      const { event } = await eventService.cancelRsvp(rsvpId, eventId)
      
      setEvents((prev) => 
        prev.map((e) => (e.id === eventId ? event : e))
      )
      
      setUserRsvps((prev) => prev.filter((rsvp) => rsvp.id !== rsvpId))
      
      toast.success('RSVP cancelled successfully')
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Error cancelling RSVP')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserEvents()
      fetchUserRsvps()
    }
  }, [isAuthenticated, fetchUserEvents, fetchUserRsvps])

  const value = {
    events,
    userEvents,
    userRsvps,
    loading,
    fetchEvents,
    fetchUserEvents,
    fetchUserRsvps,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    cancelRsvp
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}