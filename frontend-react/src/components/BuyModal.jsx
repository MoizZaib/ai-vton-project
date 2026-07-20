import { useState } from 'react'

function BuyModal({ isOpen, onClose, product, showSuccess = false }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    size: 'M',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitting(false)
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      size: 'M',
    })
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0'>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className='relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          {submitted ? (
            // Success State
            <div className='text-center py-8'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                Order Placed!
              </h3>
              <p className='text-gray-600 mb-4'>
                Thank you for your order! We'll send you a confirmation email
                shortly.
              </p>
              <p className='text-sm text-gray-500 mb-6'>
                Order ID: #
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <button
                onClick={handleClose}
                className='px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors'
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Form State
            <>
              {showSuccess && (
                <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center'>
                    <svg
                      className='w-5 h-5 text-green-600 mr-2'
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
                    <span className='text-green-700 font-medium'>
                      Great news! This product fits you perfectly!
                    </span>
                  </div>
                </div>
              )}

              <h3 className='text-xl font-bold text-gray-900 mb-1'>
                Complete Your Purchase
              </h3>
              <p className='text-gray-500 text-sm mb-6'>
                {product?.name} - Fill in your details below
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Full Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    placeholder='John Doe'
                  />
                </div>

                {/* Email & Phone */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email *
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='john@example.com'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Phone *
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='+1 234 567 8900'
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Delivery Address *
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    placeholder='123 Main Street, Apt 4B'
                  />
                </div>

                {/* City, State, Zip */}
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      City *
                    </label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='New York'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      State *
                    </label>
                    <input
                      type='text'
                      name='state'
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='NY'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      ZIP Code *
                    </label>
                    <input
                      type='text'
                      name='zipCode'
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='10001'
                    />
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Size *
                  </label>
                  <div className='flex space-x-2'>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type='button'
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, size }))
                        }
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          formData.size === size
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Summary */}
                <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Product:</span>
                    <span className='font-medium'>{product?.name}</span>
                  </div>
                  <div className='flex justify-between items-center mt-2'>
                    <span className='text-gray-600'>Size:</span>
                    <span className='font-medium'>{formData.size}</span>
                  </div>
                  <div className='flex justify-between items-center mt-2 pt-2 border-t'>
                    <span className='text-gray-900 font-medium'>Total:</span>
                    <span className='text-xl font-bold text-primary-600'>
                      $49.99
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={submitting}
                  className='w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
                >
                  {submitting ? (
                    <>
                      <div className='loading-spinner mr-2'></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className='w-5 h-5 mr-2'
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
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyModal
