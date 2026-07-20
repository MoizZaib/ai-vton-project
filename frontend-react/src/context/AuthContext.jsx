/**
 * Admin Authentication Context
 * Provides centralized admin authentication state and management
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'

// Admin key from environment (server-side should validate too)
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'fyp2025'
const STORAGE_KEY = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const location = useLocation()

    // Check session validity
    const checkSession = useCallback(() => {
        try {
            const session = localStorage.getItem(STORAGE_KEY)
            if (!session) return false

            const { key, timestamp } = JSON.parse(session)
            const isExpired = Date.now() - timestamp > SESSION_DURATION

            if (isExpired) {
                localStorage.removeItem(STORAGE_KEY)
                return false
            }

            return key === ADMIN_KEY
        } catch {
            localStorage.removeItem(STORAGE_KEY)
            return false
        }
    }, [])

    // Authenticate with key
    const authenticate = useCallback((key) => {
        if (key === ADMIN_KEY) {
            const session = {
                key: ADMIN_KEY,
                timestamp: Date.now()
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
            setIsAdmin(true)
            return true
        }
        return false
    }, [])

    // Logout
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setIsAdmin(false)
    }, [])

    // Check URL param on mount and route change
    useEffect(() => {
        setIsLoading(true)

        // Check URL param first
        const urlKey = searchParams.get('key')
        if (urlKey) {
            if (authenticate(urlKey)) {
                setIsLoading(false)
                return
            }
        }

        // Check existing session
        if (checkSession()) {
            setIsAdmin(true)
        }

        setIsLoading(false)
    }, [location.pathname, searchParams, authenticate, checkSession])

    // Refresh session periodically
    useEffect(() => {
        if (!isAdmin) return

        const interval = setInterval(() => {
            if (!checkSession()) {
                setIsAdmin(false)
            }
        }, 60000) // Check every minute

        return () => clearInterval(interval)
    }, [isAdmin, checkSession])

    const value = {
        isAdmin,
        isLoading,
        authenticate,
        logout,
        ADMIN_KEY // For display purposes only (masked)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Protected Route Component
export function RequireAdmin({ children, fallback }) {
    const { isAdmin, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[50vh]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
            </div>
        )
    }

    if (!isAdmin) {
        return fallback || <AdminAccessDenied />
    }

    return children
}

// Access Denied Component
function AdminAccessDenied() {
    const [key, setKey] = useState('')
    const [error, setError] = useState('')
    const { authenticate } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (authenticate(key)) {
            setError('')
            window.location.reload()
        } else {
            setError('Invalid admin key')
            setKey('')
        }
    }

    return (
        <div className='max-w-md mx-auto px-4 py-16'>
            <div className='bg-white rounded-2xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <div className='w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4'>
                        <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900'>Admin Access Required</h2>
                    <p className='text-gray-600 mt-2'>Enter your admin key to continue</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='adminKey' className='block text-sm font-medium text-gray-700 mb-1'>
                            Admin Key
                        </label>
                        <input
                            id='adminKey'
                            type='password'
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder='Enter admin key'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className='text-red-600 text-sm flex items-center'>
                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                            </svg>
                            {error}
                        </p>
                    )}

                    <button
                        type='submit'
                        className='w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all'
                    >
                        Authenticate
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-xs text-gray-500'>
                        Or add <code className='bg-gray-100 px-2 py-1 rounded'>?key=YOUR_KEY</code> to the URL
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthContext
