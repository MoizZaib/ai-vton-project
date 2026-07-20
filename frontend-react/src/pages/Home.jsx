import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 text-white'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl'></div>
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl'></div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10'>
          <div className='text-center'>
            <span className='inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm'>
              🎓 Final Year Project • AI-Powered Solution
            </span>
            <h1 className='text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl'>
              <span className='block'>AI-Powered</span>
              <span className='block mt-2 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent'>
                Virtual Try-On
              </span>
            </h1>
            <p className='mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white text-opacity-90'>
              Upload your photo and let our AI analyze your body measurements to
              recommend the perfect clothing size. No more guessing!
            </p>
            <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
              <Link
                to='/size-checker'
                className='px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                </svg>
                Try Virtual Try-On
              </Link>
              <Link
                to='/products'
                className='px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all flex items-center justify-center'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                </svg>
                Browse Products
              </Link>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className='absolute bottom-0 left-0 right-0'>
          <svg viewBox='0 0 1440 120' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z' fill='#f9fafb' />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
            Why Use <span className='gradient-text'>AI-VTON</span>?
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Our AI-powered virtual try-on system takes the guesswork out of online shopping
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='bg-white p-8 rounded-2xl shadow-lg card-hover'>
            <div className='w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>
              📸 Just Upload a Photo
            </h3>
            <p className='text-gray-600'>
              No measuring tape needed. Our AI extracts your measurements from a single upper-body photo.
            </p>
          </div>

          <div className='bg-white p-8 rounded-2xl shadow-lg card-hover'>
            <div className='w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>
              🧠 AI-Powered Analysis
            </h3>
            <p className='text-gray-600'>
              Google's MediaPipe technology detects 33 body landmarks to calculate accurate measurements.
            </p>
          </div>

          <div className='bg-white p-8 rounded-2xl shadow-lg card-hover'>
            <div className='w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>
              ✅ Instant Size Recommendation
            </h3>
            <p className='text-gray-600'>
              Get your size (S/M/L/XL) and detailed fit report showing if clothes will be tight, normal, or loose.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className='bg-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              How It Works
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Get your perfect size in 3 simple steps
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            <div className='text-center group'>
              <div className='relative'>
                <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform'>
                  1
                </div>
                <div className='hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent'></div>
              </div>
              <h3 className='mt-6 text-xl font-bold text-gray-900'>Select Product</h3>
              <p className='mt-2 text-gray-600'>
                Browse our catalog and choose the clothing item you're interested in
              </p>
            </div>

            <div className='text-center group'>
              <div className='relative'>
                <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform'>
                  2
                </div>
                <div className='hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent'></div>
              </div>
              <h3 className='mt-6 text-xl font-bold text-gray-900'>Upload Photo</h3>
              <p className='mt-2 text-gray-600'>
                Take or upload a clear upper-body photo facing the camera
              </p>
            </div>

            <div className='text-center group'>
              <div className='w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform'>
                ✓
              </div>
              <h3 className='mt-6 text-xl font-bold text-gray-900'>Get Your Size</h3>
              <p className='mt-2 text-gray-600'>
                Receive instant size recommendations and detailed fit analysis
              </p>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <Link
              to='/size-checker'
              className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg'
            >
              Try It Now - It's Free!
              <svg className='w-5 h-5 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='bg-gradient-to-r from-gray-900 to-gray-800 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <p className='text-4xl font-bold text-white'>95%</p>
              <p className='text-gray-400 mt-2'>Accuracy Rate</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-white'>5</p>
              <p className='text-gray-400 mt-2'>Measurements</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-white'>&lt;3s</p>
              <p className='text-gray-400 mt-2'>Analysis Time</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-white'>Free</p>
              <p className='text-gray-400 mt-2'>To Use</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='bg-gray-50 py-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl mb-6'>
            Ready to Find Your Perfect Fit?
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            Stop returning ill-fitting clothes. Let AI help you find your size today.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/size-checker'
              className='px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg'
            >
              Start Now
            </Link>
            <Link
              to='/products'
              className='px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors'
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      {/* FYP Badge */}
      <div className='bg-gradient-to-r from-primary-600 to-purple-600 py-6'>
        <div className='max-w-7xl mx-auto px-4 text-center text-white'>
          <p className='text-sm opacity-90'>
            🎓 <span className='font-bold'>Final Year Project</span> • AI-Powered Virtual Try-On System
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
