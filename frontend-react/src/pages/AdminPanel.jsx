/**
 * Admin Panel - Product Management
 * Protected by RequireAdmin - accessible only with valid admin key
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProducts, addProduct, deleteProduct, getImageUrl, getAdminKey } from '../api/api'

function AdminPanel() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    shoulder: '',
    chest: '',
    sleeve: '',
    length: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required')
      return
    }
    if (!formData.shoulder || parseFloat(formData.shoulder) <= 0) {
      setError('Valid shoulder measurement is required')
      return
    }
    if (!formData.chest || parseFloat(formData.chest) <= 0) {
      setError('Valid chest measurement is required')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const form = new FormData()
      if (imageFile) {
        form.append('image', imageFile)
      }

      await addProduct(form, getAdminKey(), {
        name: formData.name.trim(),
        shoulder: parseFloat(formData.shoulder),
        chest: parseFloat(formData.chest),
        sleeve: formData.sleeve ? parseFloat(formData.sleeve) : null,
        length: formData.length ? parseFloat(formData.length) : null
      })

      // Reset form
      setFormData({ name: '', shoulder: '', chest: '', sleeve: '', length: '' })
      setImageFile(null)
      setImagePreview(null)
      setSuccess('Product added successfully!')

      // Refresh products
      fetchProducts()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add product')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await deleteProduct(productId, getAdminKey())
      setSuccess('Product deleted successfully!')
      fetchProducts()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete product')
      console.error(err)
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Product Management</h1>
            <p className='text-gray-500'>Add and manage your product catalog</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center'>
          <svg className='w-5 h-5 text-red-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
          </svg>
          <span className='text-red-700'>{error}</span>
          <button onClick={() => setError(null)} className='ml-auto text-red-500 hover:text-red-700'>
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center'>
          <svg className='w-5 h-5 text-green-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
          </svg>
          <span className='text-green-700'>{success}</span>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Add Product Form */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <span className='w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-2'>
              +
            </span>
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name *
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='e.g., Cotton T-Shirt'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Shoulder (inches) *
                </label>
                <input
                  type='number'
                  step='0.1'
                  name='shoulder'
                  value={formData.shoulder}
                  onChange={handleInputChange}
                  placeholder='e.g., 17.5'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Chest (inches) *
                </label>
                <input
                  type='number'
                  step='0.1'
                  name='chest'
                  value={formData.chest}
                  onChange={handleInputChange}
                  placeholder='e.g., 40'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Sleeve (inches)
                </label>
                <input
                  type='number'
                  step='0.1'
                  name='sleeve'
                  value={formData.sleeve}
                  onChange={handleInputChange}
                  placeholder='Optional'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Length (inches)
                </label>
                <input
                  type='number'
                  step='0.1'
                  name='length'
                  value={formData.length}
                  onChange={handleInputChange}
                  placeholder='Optional'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Image
              </label>
              <div className='flex items-center space-x-4'>
                <label className='flex-1 cursor-pointer'>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors'>
                    {imagePreview ? (
                      <img src={imagePreview} alt='Preview' className='max-h-32 mx-auto rounded' />
                    ) : (
                      <div className='text-gray-500'>
                        <svg className='w-8 h-8 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <span className='text-sm'>Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
                {imagePreview && (
                  <button
                    type='button'
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className='text-red-500 hover:text-red-700'
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {submitting ? (
                <>
                  <svg className='animate-spin w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center justify-between'>
            <span className='flex items-center'>
              <span className='w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-2'>
                📦
              </span>
              Products ({products.length})
            </span>
            <button
              onClick={fetchProducts}
              className='text-sm text-primary-600 hover:text-primary-700'
            >
              Refresh
            </button>
          </h2>

          {loading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-20 skeleton rounded-lg'></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              <svg className='w-12 h-12 mx-auto mb-3 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
              <p>No products yet</p>
            </div>
          ) : (
            <div className='space-y-3 max-h-[500px] overflow-y-auto'>
              {products.map(product => (
                <div
                  key={product.id}
                  className='flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0'>
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className='ml-3 flex-1 min-w-0'>
                    <p className='font-medium text-gray-900 truncate'>{product.name}</p>
                    <p className='text-xs text-gray-500'>
                      S: {product.shoulder}" | C: {product.chest}"
                      {product.sleeve && ` | Sl: ${product.sleeve}"`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='ml-2 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors'
                    title='Delete product'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
