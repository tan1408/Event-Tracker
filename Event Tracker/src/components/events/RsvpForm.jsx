import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import Button from '../common/Button'
import Input from '../common/Input'

const RsvpForm = ({ event }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { rsvpToEvent, loading } = useEvents()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    additionalGuests: 0,
    specialRequests: '',
  })
  
  const [errors, setErrors] = useState({})
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (formData.phone && !/^\+?[\d\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    const totalGuests = 1 + Number(formData.additionalGuests)
    const availableSpots = event.capacity - event.attendeeCount
    
    if (totalGuests > availableSpots) {
      newErrors.additionalGuests = `Only ${availableSpots} ${availableSpots === 1 ? 'spot' : 'spots'} available`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      const result = await rsvpToEvent(event.id, user.id, formData)
      
      if (result.success) {
        navigate(`/tickets/${result.ticketId}`)
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">RSVP for this Event</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="Full Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            error={errors.name}
            required
            icon={<FiUser />}
          />
        </div>
        
        <div className="relative">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            error={errors.email}
            required
            icon={<FiMail />}
          />
        </div>
        
        <div className="relative">
          <Input
            label="Phone Number (optional)"
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            error={errors.phone}
            icon={<FiPhone />}
          />
        </div>
        
        <div>
          <label htmlFor="additionalGuests" className="form-label">
            Additional Guests
          </label>
          <select
            id="additionalGuests"
            name="additionalGuests"
            value={formData.additionalGuests}
            onChange={handleChange}
            className={`
              w-full rounded-md shadow-sm transition-colors duration-200
              ${errors.additionalGuests
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i} value={i}>
                {i === 0 ? 'No additional guests' : i === 1 ? '1 guest' : `${i} guests`}
              </option>
            ))}
          </select>
          {errors.additionalGuests && (
            <p className="error-text">{errors.additionalGuests}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="specialRequests" className="form-label">
            Special Requests (optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Any special accommodations, dietary restrictions, etc."
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={loading || event.attendeeCount >= event.capacity}
        >
          {event.attendeeCount >= event.capacity
            ? 'Event is Full'
            : loading
            ? 'Processing...'
            : 'Confirm RSVP'}
        </Button>
      </form>
    </div>
  )
}

export default RsvpForm