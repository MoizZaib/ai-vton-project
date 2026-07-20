import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, filterProducts, getImageUrl } from '../api/api'
import { useFavorites } from '../context/FavoritesContext'
import BuyModal from '../components/BuyModal'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [totalProducts, setTotalProducts] = useState(0)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchFilteredProducts()
  }, [debouncedSearch, sizeFilter])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setTotalProducts(data.length)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true)
      const data = await filterProducts(debouncedSearch, sizeFilter)
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load products. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSizeLabel = (shoulder) => {
    if (shoulder <= 15) return { label: 'XS', color: 'bg-gray-500' }
    if (shoulder <= 16) return { label: 'S', color: 'bg-blue-500' }
    if (shoulder <= 17) return { label: 'M', color: 'bg-green-500' }
    if (shoulder <= 18) return { label: 'L', color: 'bg-yellow-500' }
    return { label: 'XL', color: 'bg-red-500' }
  }

  if (loading && products.length === 0) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <div className='h-9 w-32 skeleton'></div>
          <div className='h-6 w-20 skeleton'></div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='h-48 skeleton'></div>
              <div className='p-4 space-y-3'>
                <div className='h-6 w-3/4 skeleton'></div>
                <div className='h-4 w-1/2 skeleton'></div>
                <div className='flex space-x-2'>
                  <div className='h-10 flex-1 skeleton'></div>
                  <div className='h-10 flex-1 skeleton'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-700'>{error}</p>
          <button
            onClick={fetchFilteredProducts}
            className='mt-2 text-red-600 hover:text-red-800 underline'
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
          <p className='text-gray-500 mt-1'>
            {products.length} of {totalProducts} items
            {loading && <span className='ml-2 text-primary-600'>Loading...</span>}
          </p>
        </div>

        {/* Search and Filter */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search Bar */}
          <div className='relative'>
            <svg
              className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64'
            />
          </div>

          {/* Size Filter */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          >
            <option value='all'>All Sizes</option>
            <option value='small'>Small (≤16")</option>
            <option value='medium'>Medium (16"-18")</option>
            <option value='large'>Large (>18")</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className='text-center py-12 fade-in'>
          <svg
            className='w-16 h-16 mx-auto text-gray-400 mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
            />
          </svg>
          <p className='text-gray-500'>
            {searchQuery || sizeFilter !== 'all'
              ? 'No products match your filters.'
              : 'No products available yet.'}
          </p>
          {(searchQuery || sizeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSizeFilter('all')
              }}
              className='mt-3 text-primary-600 hover:text-primary-700 font-medium'
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product, index) => {
            const sizeInfo = getSizeLabel(product.shoulder)
            return (
              <div
                key={product.id}
                className='bg-white rounded-lg shadow-md overflow-hidden card-hover fade-in'
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className='relative h-48 bg-gray-100 flex items-center justify-center'>
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://via.placeholder.com/300x200?text=No+Image'
                      }}
                    />
                  ) : (
                    <svg
                      className='w-16 h-16 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  )}

                  {/* Size Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded ${sizeInfo.color}`}
                  >
                    {sizeInfo.label}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${isFavorite(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                  >
                    <svg
                      className={`w-5 h-5 ${isFavorite(product.id) ? 'heart-pulse' : ''}`}
                      fill={isFavorite(product.id) ? 'currentColor' : 'none'}
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
                  </button>
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {product.name}
                  </h3>
                  <div className='grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4'>
                    <div>
                      <span className='font-medium'>Shoulder:</span>{' '}
                      {product.shoulder}"
                    </div>
                    <div>
                      <span className='font-medium'>Chest:</span> {product.chest}"
                    </div>
                    {product.sleeve && (
                      <div>
                        <span className='font-medium'>Sleeve:</span>{' '}
                        {product.sleeve}"
                      </div>
                    )}
                    {product.length && (
                      <div>
                        <span className='font-medium'>Length:</span>{' '}
                        {product.length}"
                      </div>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => {
                        setSelectedProduct(product)
                        setBuyModalOpen(true)
                      }}
                      className='flex-1 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center'
                    >
                      <svg
                        className='w-4 h-4 mr-1'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                        />
                      </svg>
                      Buy Now
                    </button>
                    <Link
                      to={`/size-checker?product=${product.id}`}
                      className='flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center'
                    >
                      <svg
                        className='w-4 h-4 mr-1'
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
                      Try It
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Buy Modal */}
      <BuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}

export default ProductList
