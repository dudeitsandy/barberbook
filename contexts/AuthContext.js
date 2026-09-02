import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      if (status === 'authenticated' && session?.user) {
        setUser(session.user)
        
        if (session.user.role === 'BUSINESS' && session.user.businessId) {
          try {
            await fetchBusinessDetails(session.user.businessId)
          } catch (error) {
            console.error('Failed to fetch business details:', error)
          }
        }
      } else if (status === 'unauthenticated') {
        setUser(null)
        setBusiness(null)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [session, status])

  const fetchBusinessDetails = async (businessId) => {
    try {
      const response = await fetch(`/api/business/${businessId}`)
      if (response.ok) {
        const data = await response.json()
        setBusiness(data)
      }
    } catch (error) {
      console.error('Error fetching business details:', error)
    }
  }

  const value = {
    user,
    business,
    isLoading: loading,
    isBusiness: user?.role === 'BUSINESS',
    isCustomer: user?.role === 'CUSTOMER',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 