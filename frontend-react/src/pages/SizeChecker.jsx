import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, analyzeAndCompare, getImageUrl } from '../api/api'
import BuyModal from '../components/BuyModal'

// Demo images - using placeholder URLs for demo mode
const DEMO_IMAGES = [
  {
    id: 'demo1',
    name: 'Demo Person 1',
    description: 'Male, average build',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
  },
  {
    id: 'demo2',
    name: 'Demo Person 2',
    description: 'Female, slim build',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop'
  }
]

function SizeChecker() {
  const [searchParams] = useSearchParams()
  const preselectedProductId = searchParams.get('product')

  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [showDemoMode, setShowDemoMode] = useState(false)

  // Height input states
  const [heightFeet, setHeightFeet] = useState('')
  const [heightInches, setHeightInches] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (preselectedProductId && products.length > 0) {
      const product = products.find(
        (p) => p.id === parseInt(preselectedProductId)
      )
      if (product) setSelectedProduct(product)
    }
  }, [preselectedProductId, products])

  // Save analysis to localStorage for dashboard stats
  useEffect(() => {
    if (result && result.success) {
      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]')
      history.push({
        productId: selectedProduct?.id,
        confidence: result.confidence,
        timestamp: new Date().toISOString()
      })
      // Keep only last 100 entries
      if (history.length > 100) history.shift()
      localStorage.setItem('analysisHistory', JSON.stringify(history))
    }
  }, [result])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
      setShowDemoMode(false)
    }
  }

  const handleDemoImageSelect = async (demoImage) => {
    try {
      // Fetch the demo image and convert to file
      const response = await fetch(demoImage.url)
      const blob = await response.blob()
      const file = new File([blob], `${demoImage.id}.jpg`, { type: 'image/jpeg' })

      setSelectedFile(file)
      setPreviewUrl(demoImage.url)
      setResult(null)
      setError(null)
      setShowDemoMode(false)
    } catch (err) {
      console.error('Failed to load demo image:', err)
      setError('Failed to load demo image. Please try uploading your own photo.')
    }
  }

  const handleAnalyze = async () => {
    if (!selectedProduct || !selectedFile) {
      setError('Please select a product and upload your photo')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Calculate total height in inches if provided
      let totalHeightInches = null
      if (heightFeet || heightInches) {
        const feet = parseInt(heightFeet) || 0
        const inches = parseInt(heightInches) || 0
        if (feet > 0 || inches > 0) {
          totalHeightInches = feet * 12 + inches
        }
      }

      const data = await analyzeAndCompare(
        selectedProduct.id,
        selectedFile,
        totalHeightInches
      )

      // Check if measurement failed
      if (data.success === false) {
        setError(data.error || 'Failed to analyze image. Please try again.')
        setResult(null)
        return
      }

      setResult(data)
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Analysis failed. Please try again.'
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getFitColor = (status) => {
    switch (status) {
      case 'Tight':
        return 'text-red-600 bg-red-50'
      case 'Loose':
        return 'text-yellow-600 bg-yellow-50'
      case 'Normal':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getOverallColor = (overall) => {
    if (overall.includes('Too Tight')) return 'border-red-500 bg-red-50'
    if (overall.includes('Too Loose')) return 'border-yellow-500 bg-yellow-50'
    if (overall.includes('Good')) return 'border-green-500 bg-green-50'
    return 'border-blue-500 bg-blue-50'
  }

  const isGoodFit = (overall) => {
    return overall && (overall.includes('Good') || overall.includes('Normal'))
  }

  // Get recommended size label based on user measurements
  const getSizeLabel = (shoulder) => {
    if (!shoulder) return null
    if (shoulder <= 15) return { label: 'XS', color: 'from-gray-400 to-gray-600' }
    if (shoulder <= 16) return { label: 'S', color: 'from-blue-400 to-blue-600' }
    if (shoulder <= 17) return { label: 'M', color: 'from-green-400 to-green-600' }
    if (shoulder <= 18) return { label: 'L', color: 'from-yellow-400 to-yellow-600' }
    return { label: 'XL', color: 'from-red-400 to-red-600' }
  }

  // Confidence Circle Component
  const ConfidenceCircle = ({ confidence }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const progress = circumference - (confidence / 100) * circumference

    return (
      <div className='relative w-24 h-24'>
        <svg className='w-24 h-24 transform -rotate-90'>
          <circle
            cx='48'
            cy='48'
            r={radius}
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            className='text-gray-200'
          />
          <circle
            cx='48'
            cy='48'
            r={radius}
            stroke='url(#gradient)'
            strokeWidth='8'
            fill='none'
            strokeLinecap='round'
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: progress,
              transition: 'stroke-dashoffset 1.5s ease-out'
            }}
          />
          <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#667eea' />
              <stop offset='100%' stopColor='#764ba2' />
            </linearGradient>
          </defs>
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-2xl font-bold gradient-text'>{confidence}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Size Checker</h1>
        <button
          onClick={() => setShowDemoMode(!showDemoMode)}
          className='px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center'
        >
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          Demo Mode
        </button>
      </div>

      {/* Demo Mode Panel */}
      {showDemoMode && (
        <div className='mb-8 p-6 bg-purple-50 border border-purple-200 rounded-xl fade-in'>
          <h3 className='text-lg font-semibold text-purple-800 mb-4'>
            🎭 Demo Mode - Quick Test with Sample Images
          </h3>
          <p className='text-purple-600 text-sm mb-4'>
            Select a demo image to quickly test the size checker without uploading your own photo.
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {DEMO_IMAGES.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleDemoImageSelect(demo)}
                className='p-3 bg-white rounded-lg border-2 border-transparent hover:border-purple-400 transition-all group'
              >
                <div className='h-24 bg-gray-100 rounded-md mb-2 overflow-hidden'>
                  <img
                    src={demo.url}
                    alt={demo.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                  />
                </div>
                <p className='font-medium text-gray-800 text-sm'>{demo.name}</p>
                <p className='text-xs text-gray-500'>{demo.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Panel - Input */}
        <div className='space-y-6'>
          {/* Product Selection */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              1. Select a Product
            </h2>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = products.find(
                  (p) => p.id === parseInt(e.target.value)
                )
                setSelectedProduct(product)
                setResult(null)
              }}
              className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value=''>Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Shoulder: {product.shoulder}", Chest:{' '}
                  {product.chest}")
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className='mt-4 flex items-start space-x-4'>
                <div className='w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0'>
                  <img
                    src={getImageUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>'
                    }}
                  />
                </div>
                <div className='text-sm text-gray-600'>
                  <p className='font-medium text-gray-900'>
                    {selectedProduct.name}
                  </p>
                  <p>Shoulder: {selectedProduct.shoulder}"</p>
                  <p>Chest: {selectedProduct.chest}"</p>
                  {selectedProduct.sleeve && (
                    <p>Sleeve: {selectedProduct.sleeve}"</p>
                  )}
                  {selectedProduct.length && (
                    <p>Length: {selectedProduct.length}"</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                2. Upload Your Photo
              </h2>
              <button
                onClick={() => setShowGuidelines(!showGuidelines)}
                className='text-sm text-primary-600 hover:text-primary-700 flex items-center'
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
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Photo Tips
              </button>
            </div>

            {/* Photo Guidelines */}
            {showGuidelines && (
              <div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <h3 className='font-medium text-blue-800 mb-2'>
                  📸 How to Take the Perfect Photo
                </h3>
                <div className='grid grid-cols-2 gap-3 text-sm text-blue-700'>
                  <div className='flex items-start'>
                    <span className='text-green-500 mr-2'>✓</span>
                    <span>Stand 4-6 feet from camera</span>
                  </div>
                  <div className='flex items-start'>
                    <span className='text-green-500 mr-2'>✓</span>
                    <span>Face the camera directly</span>
                  </div>
                  <div className='flex items-start'>
                    <span className='text-green-500 mr-2'>✓</span>
                    <span>Wear fitted clothing</span>
                  </div>
                  <div className='flex items-start'>
                    <span className='text-green-500 mr-2'>✓</span>
                    <span>Good lighting, no shadows</span>
                  </div>
                </div>
              </div>
            )}

            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors'>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
                id='photo-upload'
              />
              <label htmlFor='photo-upload' className='cursor-pointer'>
                {previewUrl ? (
                  <div className='relative'>
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='max-h-64 mx-auto rounded-lg'
                    />
                    <p className='mt-2 text-sm text-primary-600'>
                      Click to change photo
                    </p>
                  </div>
                ) : (
                  <>
                    <svg
                      className='w-12 h-12 mx-auto text-gray-400 mb-3'
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
                    <p className='text-gray-600'>Click to upload your photo</p>
                    <p className='text-sm text-gray-400 mt-1'>
                      JPG, PNG up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Height Input */}
          <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border border-purple-100'>
            <div className='flex items-center mb-3'>
              <svg
                className='w-5 h-5 text-purple-600 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
              <h2 className='text-lg font-semibold text-gray-900'>
                3. Your Height{' '}
                <span className='text-sm font-normal text-purple-600'>
                  (Recommended)
                </span>
              </h2>
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              Adding your height improves accuracy by up to 40%!
            </p>
            <div className='flex items-center space-x-3'>
              <div className='flex-1'>
                <label className='block text-xs text-gray-500 mb-1'>Feet</label>
                <select
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                >
                  <option value=''>--</option>
                  {[4, 5, 6, 7].map((ft) => (
                    <option key={ft} value={ft}>
                      {ft} ft
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex-1'>
                <label className='block text-xs text-gray-500 mb-1'>
                  Inches
                </label>
                <select
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                >
                  <option value=''>--</option>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                    <option key={inch} value={inch}>
                      {inch} in
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedProduct || !selectedFile || loading}
            className='w-full py-4 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg shadow-lg'
          >
            {loading ? (
              <>
                <div className='loading-spinner mr-3'></div>
                Analyzing Your Body Measurements...
              </>
            ) : (
              <>
                <svg
                  className='w-6 h-6 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
                Find My Perfect Size
              </>
            )}
          </button>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <svg
                  className='w-5 h-5 text-red-500 mr-2 mt-0.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <div>
                  <p className='text-red-700'>{error}</p>
                  <button
                    onClick={() => setShowGuidelines(true)}
                    className='text-sm text-red-600 hover:text-red-800 underline mt-1'
                  >
                    View photo tips →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className='space-y-6'>
          {result && result.fit_report ? (
            <div className='fade-in'>
              {/* Confidence & Size Label Card */}
              <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>AI Analysis</h3>
                    <p className='text-sm text-gray-500'>
                      {result.calibration === 'height' ? '📏 Height Calibrated' : '👤 Face Calibrated'}
                    </p>
                  </div>
                  <ConfidenceCircle confidence={result.confidence} />
                </div>

                {/* Size Label Recommendation */}
                {result.user_measurements?.shoulder && (
                  <div className='mt-6 pt-6 border-t'>
                    <p className='text-sm text-gray-600 mb-3'>Your Recommended Size:</p>
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`size-badge bg-gradient-to-br ${getSizeLabel(result.user_measurements.shoulder)?.color
                          }`}
                      >
                        {getSizeLabel(result.user_measurements.shoulder)?.label}
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900'>
                          Size {getSizeLabel(result.user_measurements.shoulder)?.label}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Based on {result.user_measurements.shoulder}" shoulder width
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Overall Recommendation */}
              <div
                className={`rounded-lg border-2 p-6 ${getOverallColor(
                  result.fit_report.overall
                )}`}
              >
                <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                  Fit Recommendation
                </h2>
                <p className='text-2xl font-bold text-gray-900'>
                  {result.fit_report.overall}
                </p>
                <p className='text-gray-700 mt-1'>
                  {result.fit_report.recommendation}
                </p>

                {/* Buy Now for Good Fit */}
                {isGoodFit(result.fit_report.overall) && (
                  <div className='mt-4 pt-4 border-t border-green-200'>
                    <button
                      onClick={() => setBuyModalOpen(true)}
                      className='w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-lg'
                    >
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
                      Buy Now - Perfect Fit!
                    </button>
                  </div>
                )}
              </div>

              {/* Measurements Comparison */}
              <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                  Measurements Comparison
                </h2>
                <div className='space-y-4'>
                  {[
                    { key: 'shoulder', label: 'Shoulder' },
                    { key: 'chest', label: 'Chest' },
                    { key: 'sleeve', label: 'Sleeve' },
                    { key: 'length', label: 'Length' }
                  ].map(({ key, label }) => {
                    const userVal = result.user_measurements?.[key]
                    const prodVal = result.product_measurements?.[key]
                    const fitKey = `${key}_fit`
                    const fit = result.fit_report?.[fitKey]

                    if (!userVal || !prodVal) return null

                    return (
                      <div key={key} className='slide-up'>
                        <div className='flex justify-between items-center mb-1'>
                          <span className='font-medium text-gray-700'>{label}</span>
                          {fit && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getFitColor(fit.status)}`}
                            >
                              {fit.status}
                            </span>
                          )}
                        </div>
                        <div className='flex items-center space-x-2 text-sm'>
                          <span className='text-gray-600'>You: {userVal}"</span>
                          <span className='text-gray-400'>→</span>
                          <span className='text-gray-600'>Product: {prodVal}"</span>
                        </div>
                        {fit && (
                          <div className='mt-2 h-2 bg-gray-100 rounded-full overflow-hidden'>
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${fit.status === 'Normal'
                                  ? 'bg-green-500'
                                  : fit.status === 'Tight'
                                    ? 'bg-red-500'
                                    : 'bg-yellow-500'
                                }`}
                              style={{ width: `${Math.min(100, Math.max(20, 50 + fit.difference * 10))}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-md p-8'>
              <div className='text-center mb-6'>
                <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-10 h-10 text-primary-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  Find Your Perfect Fit
                </h3>
                <p className='text-gray-500'>
                  Follow the steps on the left to get personalized size recommendations
                </p>
              </div>

              {/* Steps Guide */}
              <div className='space-y-4 text-left'>
                <div
                  className={`flex items-center p-3 rounded-lg ${selectedProduct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50'
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${selectedProduct
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                      }`}
                  >
                    {selectedProduct ? '✓' : '1'}
                  </div>
                  <span className={selectedProduct ? 'text-green-700' : 'text-gray-600'}>
                    {selectedProduct ? `Selected: ${selectedProduct.name}` : 'Select a product'}
                  </span>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg ${selectedFile
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50'
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${selectedFile
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                      }`}
                  >
                    {selectedFile ? '✓' : '2'}
                  </div>
                  <span className={selectedFile ? 'text-green-700' : 'text-gray-600'}>
                    {selectedFile ? 'Photo uploaded' : 'Upload your photo'}
                  </span>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg ${heightFeet || heightInches
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-purple-50 border border-purple-100'
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${heightFeet || heightInches
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-200 text-purple-600'
                      }`}
                  >
                    {heightFeet || heightInches ? '✓' : '3'}
                  </div>
                  <span
                    className={
                      heightFeet || heightInches ? 'text-green-700' : 'text-purple-600'
                    }
                  >
                    {heightFeet || heightInches
                      ? `Height: ${heightFeet || 0}'${heightInches || 0}"`
                      : 'Add height for +40% accuracy'}
                  </span>
                </div>
              </div>

              {selectedProduct && selectedFile && (
                <div className='mt-6 pt-6 border-t'>
                  <p className='text-center text-sm text-gray-500'>
                    Ready! Click <strong>"Find My Perfect Size"</strong> to analyze
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      <BuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        product={selectedProduct}
        showSuccess={isGoodFit(result?.fit_report?.overall)}
      />
    </div>
  )
}

export default SizeChecker
