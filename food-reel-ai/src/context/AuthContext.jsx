import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [dashboardData, setDashboardData] = useState(() => {
    try {
      const savedDashboardData = localStorage.getItem('dashboardData')
      return savedDashboardData ? JSON.parse(savedDashboardData) : null
    } catch {
      return null
    }
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')))

  const login = (userData, data = null) => {
    const normalizedUser = userData?.user ? userData.user : userData
    const normalizedDashboardData = data ?? userData?.dashboardData ?? null

    setUser(normalizedUser)
    setDashboardData(normalizedDashboardData)
    setIsAuthenticated(true)

    if (normalizedUser) localStorage.setItem('user', JSON.stringify(normalizedUser))
    if (normalizedDashboardData) localStorage.setItem('dashboardData', JSON.stringify(normalizedDashboardData))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('dashboardData')
    setUser(null)
    setDashboardData(null)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || user) return

    const restoreUser = async () => {
      try {
        const response = await getCurrentUser()
        const currentUser = response?.data?.user
        const currentDashboardData = response?.data?.dashboardData
        if (currentUser) {
          login(currentUser, currentDashboardData)
        }
      } catch (err) {
        console.error('Failed to restore user session', err)
        logout()
      }
    }

    restoreUser()
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser, dashboardData, setDashboardData, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
