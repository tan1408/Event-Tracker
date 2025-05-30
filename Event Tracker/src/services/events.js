import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

// Mock events data
let events = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year, featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
    date: '2025-03-15T09:00:00',
    endDate: '2025-03-17T18:00:00',
    location: 'San Francisco Convention Center',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: '1',
      name: 'John Doe'
    },
    capacity: 500,
    attendeeCount: 320,
    category: 'Technology',
    price: 199.99,
    tags: ['tech', 'conference', 'networking'],
    rsvps: []
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'Experience three days of amazing music across five stages with over 40 artists. Camping options available.',
    date: '2025-07-10T12:00:00',
    endDate: '2025-07-12T23:00:00',
    location: 'Riverfront Park',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: '2',
      name: 'Jane Smith'
    },
    capacity: 5000,
    attendeeCount: 2100,
    category: 'Music',
    price: 149.50,
    tags: ['music', 'festival', 'summer'],
    rsvps: []
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    description: 'Watch 10 promising startups pitch their ideas to a panel of venture capitalists. Networking reception to follow.',
    date: '2025-04-25T18:00:00',
    endDate: '2025-04-25T21:30:00',
    location: 'Innovation Hub',
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop',
    organizer: {
      id: '1',
      name: 'John Doe'
    },
    capacity: 200,
    attendeeCount: 143,
    category: 'Business',
    price: 0,
    tags: ['startup', 'pitch', 'networking'],
    rsvps: []
  },
  {
    id: '4',
    title: 'Wellness Retreat',
    description: 'A weekend of yoga, meditation, and mindfulness workshops led by certified instructors. All levels welcome.',
    date: '2025-05-20T08:00:00',
    endDate: '2025-05-22T17:00:00',
    location: 'Mountain View Resort',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: '2',
      name: 'Jane Smith'
    },
    capacity: 50,
    attendeeCount: 42,
    category: 'Health',
    price: 299.99,
    tags: ['wellness', 'yoga', 'retreat'],
    rsvps: []
  }
]

// Mock RSVPs data
let rsvps = []

export const eventService = {
  // Get all events
  async getAllEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...events])
      }, 600)
    })
  },
  
  // Get event by ID
  async getEventById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = events.find((e) => e.id === id)
        if (event) {
          resolve({ ...event })
        } else {
          reject(new Error('Event not found'))
        }
      }, 500)
    })
  },
  
  // Get events created by user
  async getUserEvents(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userEvents = events.filter((e) => e.organizer.id === userId)
        resolve([...userEvents])
      }, 600)
    })
  },
  
  // Get user RSVPs
  async getUserRsvps(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRsvps = rsvps.filter((r) => r.userId === userId)
        resolve([...userRsvps])
      }, 600)
    })
  },
  
  // Create new event
  async createEvent(eventData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          id: uuidv4(),
          ...eventData,
          attendeeCount: 0,
          rsvps: []
        }
        
        events.push(newEvent)
        resolve({ ...newEvent })
      }, 800)
    })
  },
  
  // Update event
  async updateEvent(id, eventData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = events.findIndex((e) => e.id === id)
        
        if (index === -1) {
          reject(new Error('Event not found'))
          return
        }
        
        // Preserve some fields that shouldn't be directly updated
        const { attendeeCount, rsvps } = events[index]
        
        const updatedEvent = {
          ...events[index],
          ...eventData,
          attendeeCount,
          rsvps
        }
        
        events[index] = updatedEvent
        resolve({ ...updatedEvent })
      }, 800)
    })
  },
  
  // Delete event
  async deleteEvent(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = events.findIndex((e) => e.id === id)
        
        if (index === -1) {
          reject(new Error('Event not found'))
          return
        }
        
        // Remove event
        events.splice(index, 1)
        
        // Also remove associated RSVPs
        rsvps = rsvps.filter((r) => r.eventId !== id)
        
        resolve({ success: true })
      }, 800)
    })
  },
  
  // RSVP to event
  async rsvpToEvent(eventId, userId, rsvpData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const eventIndex = events.findIndex((e) => e.id === eventId)
        
        if (eventIndex === -1) {
          reject(new Error('Event not found'))
          return
        }
        
        const event = events[eventIndex]
        
        // Check if user already RSVP'd
        const existingRsvp = rsvps.find((r) => r.eventId === eventId && r.userId === userId)
        
        if (existingRsvp) {
          reject(new Error('You have already RSVP\'d to this event'))
          return
        }
        
        // Check capacity
        if (event.attendeeCount >= event.capacity) {
          reject(new Error('This event has reached its capacity'))
          return
        }
        
        // Create RSVP
        const newRsvp = {
          id: uuidv4(),
          eventId,
          userId,
          status: 'confirmed',
          ticketNumber: `TCKT-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          ...rsvpData
        }
        
        // Update event attendee count
        events[eventIndex] = {
          ...event,
          attendeeCount: event.attendeeCount + 1,
        }
        
        // Add RSVP to collection
        rsvps.push(newRsvp)
        
        resolve({
          rsvp: newRsvp,
          event: events[eventIndex]
        })
      }, 800)
    })
  },
  
  // Cancel RSVP
  async cancelRsvp(rsvpId, eventId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rsvpIndex = rsvps.findIndex((r) => r.id === rsvpId)
        
        if (rsvpIndex === -1) {
          reject(new Error('RSVP not found'))
          return
        }
        
        const eventIndex = events.findIndex((e) => e.id === eventId)
        
        if (eventIndex === -1) {
          reject(new Error('Event not found'))
          return
        }
        
        // Update event attendee count
        const event = events[eventIndex]
        events[eventIndex] = {
          ...event,
          attendeeCount: Math.max(0, event.attendeeCount - 1),
        }
        
        // Remove RSVP
        rsvps.splice(rsvpIndex, 1)
        
        resolve({
          success: true,
          event: events[eventIndex]
        })
      }, 800)
    })
  },
  
  // Get ticket by ID
  async getTicketById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ticket = rsvps.find((r) => r.id === id)
        
        if (!ticket) {
          reject(new Error('Ticket not found'))
          return
        }
        
        const event = events.find((e) => e.id === ticket.eventId)
        
        if (!event) {
          reject(new Error('Associated event not found'))
          return
        }
        
        resolve({
          ticket,
          event
        })
      }, 500)
    })
  }
}