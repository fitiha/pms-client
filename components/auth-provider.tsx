"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, fetchUserDetails, User } from '@/lib/auth'

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: () => {} })

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const userDetails = await fetchUserDetails(currentUser.id)
          setUser({ ...currentUser, ...userDetails })
        } catch (error) {
          console.error('Failed to fetch user details:', error)
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

