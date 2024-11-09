'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// تعريف نوع البيانات للمستخدم
interface User {
  id: string
  username: string
  email: string
}

// تعريف نوع بيانات السياق
interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// مزود السياق
export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // التحقق من وجود جلسة مستخدم عند تحميل التطبيق
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('فشل التحقق من المصادقة:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook مخصص لاستخدام السياق
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider')
  }
  return context
}