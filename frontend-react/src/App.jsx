import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { useFavorites } from './context/FavoritesContext'
import { useAuth, RequireAdmin } from './context/AuthContext'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import SizeChecker from './pages/SizeChecker'
import AdminPanel from './pages/AdminPanel'
import Favorites from './pages/Favorites'
import Dashboard from './pages/Dashboard'
import SizeChart from './components/SizeChart'

// App name from env
const APP_NAME = import.meta.env.VITE_APP_NAME || 'AI-VTON'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  const { darkMode, toggleDarkMode } = useTheme()
  const { favorites } = useFavorites()
  const { isAdmin, logout } = useAuth()
  const [sizeChartOpen, setSizeChartOpen] = useState(false)

  return (
    <div className='min-h-screen bg-gray-50 transition-colors duration-300'>
      {/* Navigation */}
      <nav className='bg-white shadow-md transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <Link to='/' className='flex items-center space-x-2'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='text-lg font-bold gradient-text leading-tight'>
                    {APP_NAME}
                  </span>
                  <span className='text-[10px] text-gray-400 leading-tight'>
                    FYP Project
                  </span>
                </div>
              </Link>
            </div>
            <div className='flex items-center space-x-1'>
              <Link
                to='/'
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
              >
                Home
              </Link>
              <Link
                to='/products'
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/products'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
              >
                Products
              </Link>
              <Link
                to='/size-checker'
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/size-checker'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
              >
                Try On
              </Link>
              {/* Size Chart Button */}
              <button
                onClick={() => setSizeChartOpen(true)}
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors'
                title='Size Guide'
              >
                📐
              </button>
              <Link
                to='/favorites'
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/favorites'
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                  }`}
              >
                <svg
                  className='w-5 h-5'
                  fill={location.pathname === '/favorites' ? 'currentColor' : 'none'}
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
                {favorites.length > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Admin-Only Links */}
              {isAdmin && (
                <>
                  <Link
                    to='/dashboard'
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-100'
                      }`}
                    title='Dashboard'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </Link>
                  <Link
                    to='/admin'
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/admin'
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                      }`}
                    title='Add Products'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={logout}
                    className='px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors'
                    title='Logout Admin'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors'
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? (
                  <svg className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5 text-gray-700' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/size-checker' element={<SizeChecker />} />
          <Route path='/favorites' element={<Favorites />} />

          {/* Protected Admin Routes */}
          <Route
            path='/admin'
            element={
              <RequireAdmin>
                <AdminPanel />
              </RequireAdmin>
            }
          />
          <Route
            path='/dashboard'
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      {!isAdminPage && (
        <footer className='bg-white border-t mt-auto transition-colors duration-300'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            <p className='text-center text-gray-500 text-sm'>
              © 2024 <span className='font-semibold'>{APP_NAME}</span> - AI-Powered Virtual Try-On •
              <span className='text-primary-600'> FYP Project</span> •
              Built with FastAPI, React & MediaPipe
            </p>
          </div>
        </footer>
      )}

      {/* Size Chart Modal */}
      <SizeChart isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
    </div>
  )
}

export default App
