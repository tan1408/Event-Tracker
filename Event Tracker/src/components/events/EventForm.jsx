import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { FiCalendar, FiMapPin, FiTag, FiDollarSign, FiUsers } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import Button from '../common/Button'
import Input from '../common/Input'

const categories = [
  'Technology', 'Business', 'Music', 'Arts', 'Sports',
  'Health', 'Education', 'Social', 'Food', 'Other'
]

const EventForm = ({ event = null, isEditing = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createEvent, updateEvent, loading } = useEvents()
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date) : new Date(),
    endDate: event?.endDate ? new Date(event.endDate) : new Date(),
    location: event?.location || '',
    imageUrl: event?.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    capacity: event?.capacity || 100,
    category: event?.category || 'Technology',
    price: event?.price || 0,
    tags: event?.tags?.join(', ') || '',
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
  
  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    } else if (!/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL'
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0'
    }
    
    if (formData.endDate <= formData.date) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Process tags
    const processedTags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    
    const eventData = {
      ...formData,
      tags: processedTags,
      organizer: {
        id: user.id,
        name: user.name,
      },
    }
    
    try {
      if (isEditing) {
        const result = await updateEvent(event.id, eventData)
        if (result.success) {
          navigate(`/events/${event.id}`)
        }
      } else {
        const result = await createEvent(eventData)
        if (result.success) {
          navigate(`/events/${result.eventId}`)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        
        <div className="space-y-4">
          <Input
            label="Event Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            error={errors.title}
            required
          />
          
          <div>
            <label htmlFor="description" className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`
                w-full rounded-md shadow-sm transition-colors duration-200
                ${errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }
              `}
              placeholder="Describe your event in detail"
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => handleDateChange(date, 'date')}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  minDate={new Date()}
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="form-label">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  minDate={formData.date}
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
              {errors.endDate && <p className="error-text">{errors.endDate}</p>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Location & Category</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter venue or address"
              error={errors.location}
              required
              icon={<FiMapPin />}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FiTag className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <Input
              label="Tags (comma separated)"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. music, workshop, networking"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Capacity & Image</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Capacity"
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Maximum number of attendees"
                error={errors.capacity}
                required
                icon={<FiUsers />}
              />
            </div>
            
            <div className="relative">
              <Input
                label="Price ($)"
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0 for free events"
                error={errors.price}
                icon={<FiDollarSign />}
              />
            </div>
          </div>
          
          <div>
            <Input
              label="Event Image URL"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              error={errors.imageUrl}
              required
            />
            
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <div className="relative rounded-md overflow-hidden h-36 bg-gray-100">
                  <img
                    src={formData.imageUrl}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          isLoading={loading}
          disabled={loading}
        >
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}

export default EventForm