import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiLock, FiEdit2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const ProfilePage = () => {
  const { user, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (activeTab === 'profile') {
      if (!validateForm()) {
        return
      }
      
      // Update profile logic would go here
      // This is just a mock implementation
      setTimeout(() => {
        setIsEditing(false)
        // Show success message
      }, 1000)
    } else {
      if (!validatePasswordForm()) {
        return
      }
      
      // Update password logic would go here
      // This is just a mock implementation
      setTimeout(() => {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        // Show success message
      }, 1000)
    }
  }
  
  return (
    <div className="mt-16 min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="md:w-1/4 bg-gray-50 p-6 border-r border-gray-200">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                    <img
                      src={user?.avatarUrl || 'https://i.pravatar.cc/150?img=1'}
                      alt={user?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
                
                <nav className="mt-6 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="mr-3" />
                    <span>Profile Information</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                      activeTab === 'security'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiLock className="mr-3" />
                    <span>Password & Security</span>
                  </button>
                </nav>
              </div>
              
              {/* Main content */}
              <div className="md:w-3/4 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {activeTab === 'profile' ? 'Profile Information' : 'Password & Security'}
                  </h3>
                  
                  {activeTab === 'profile' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FiEdit2 />}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit}>
                  {activeTab === 'profile' ? (
                    <div className="space-y-6">
                      <Input
                        label="Full Name"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors.name}
                        required
                        icon={<FiUser />}
                      />
                      
                      <Input
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors.email}
                        required
                        icon={<FiMail />}
                      />
                      
                      <Input
                        label="Phone Number (optional)"
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors.phone}
                        icon={<FiPhone />}
                      />
                      
                      {isEditing && (
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Input
                        label="Current Password"
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        error={errors.currentPassword}
                        required
                        icon={<FiLock />}
                      />
                      
                      <Input
                        label="New Password"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        helperText="Must be at least 6 characters"
                        required
                        icon={<FiLock />}
                      />
                      
                      <Input
                        label="Confirm New Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                        icon={<FiLock />}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={loading}
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage