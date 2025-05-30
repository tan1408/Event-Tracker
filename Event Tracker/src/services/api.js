import axios from 'axios'

// In a real app, this would come from environment variables
const API_URL = 'https://api.mockapi.io/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Unauthorized - likely expired token
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      
      // Return error message from the server if available
      const errorMessage = error.response.data?.message || 'Something went wrong'
      return Promise.reject(new Error(errorMessage))
    }
    
    // Network errors
    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
    
    // Other errors
    return Promise.reject(error)
  }
)

export default api