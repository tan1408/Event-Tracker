import { v4 as uuidv4 } from 'uuid'

// Simulated users database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
]

// In a real app, this would be replaced with actual API calls
export const authService = {
  // Login user
  async login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = users.find((u) => u.email === email)
        
        if (!user) {
          reject(new Error('User not found'))
          return
        }
        
        if (user.password !== password) {
          reject(new Error('Invalid password'))
          return
        }
        
        // Create a copy without password
        const { password: _, ...userWithoutPassword } = user
        
        resolve({
          user: userWithoutPassword,
          token: `mock-jwt-token-${uuidv4()}`
        })
      }, 800)
    })
  },
  
  // Register user
  async register(userData) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const existingUser = users.find((u) => u.email === userData.email)
        
        if (existingUser) {
          reject(new Error('Email already registered'))
          return
        }
        
        // Create new user
        const newUser = {
          id: uuidv4(),
          ...userData,
          avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        }
        
        // Add to "database"
        users.push(newUser)
        
        // Return without password
        const { password: _, ...userWithoutPassword } = newUser
        
        resolve({
          user: userWithoutPassword,
          token: `mock-jwt-token-${uuidv4()}`
        })
      }, 800)
    })
  },
}