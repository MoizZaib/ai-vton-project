import { useState, useEffect } from 'react'
import { getProducts } from '../api/api'

function Dashboard() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalAnalyses: 0,
        avgConfidence: 0,
        popularProducts: []
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const productsData = await getProducts()
            setProducts(productsData)

            // Get stats from localStorage (simulated analytics)
            const analysisHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]')
            const confidenceSum = analysisHistory.reduce((sum, a) => sum + (a.confidence || 0), 0)

            // Count product popularity
            const productCounts = {}
            analysisHistory.forEach((a) => {
                if (a.productId) {
                    productCounts[a.productId] = (productCounts[a.productId] || 0) + 1
                }
            })

            const popular = Object.entries(productCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([id, count]) => ({
                    product: productsData.find((p) => p.id === parseInt(id)),
                    count
                }))
                .filter((p) => p.product)

            setStats({
                totalProducts: productsData.length,
                totalAnalyses: analysisHistory.length,
                avgConfidence: analysisHistory.length > 0 ? Math.round(confidenceSum / analysisHistory.length) : 0,
                popularProducts: popular
            })
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    const StatCard = ({ icon, label, value, color, gradient }) => (
        <div className={`rounded-2xl p-6 text-white relative overflow-hidden ${gradient}`}>
            <div className='absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8'>
                <div className='w-full h-full rounded-full bg-white opacity-10'></div>
            </div>
            <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                    <div className={`w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
                <p className='text-3xl font-bold mb-1'>{value}</p>
                <p className='text-sm opacity-80'>{label}</p>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>Analytics Dashboard</h1>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='h-40 skeleton rounded-2xl'></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900'>Analytics Dashboard</h1>
                <p className='text-gray-500 mt-1'>Overview of your SizeFit AI performance</p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <StatCard
                    gradient='bg-gradient-to-br from-blue-500 to-blue-700'
                    icon={
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                        </svg>
                    }
                    label='Total Products'
                    value={stats.totalProducts}
                />
                <StatCard
                    gradient='bg-gradient-to-br from-purple-500 to-purple-700'
                    icon={
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
                        </svg>
                    }
                    label='Size Analyses'
                    value={stats.totalAnalyses}
                />
                <StatCard
                    gradient='bg-gradient-to-br from-green-500 to-green-700'
                    icon={
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    }
                    label='Avg. Confidence'
                    value={`${stats.avgConfidence}%`}
                />
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Popular Products */}
                <div className='bg-white rounded-xl shadow-md p-6 fade-in'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Most Checked Products</h2>
                    {stats.popularProducts.length > 0 ? (
                        <div className='space-y-4'>
                            {stats.popularProducts.map((item, index) => (
                                <div key={item.product.id} className='flex items-center'>
                                    <div className='w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3'>
                                        {index + 1}
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-medium text-gray-900'>{item.product.name}</p>
                                        <div className='mt-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                            <div
                                                className='h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000'
                                                style={{ width: `${(item.count / stats.totalAnalyses) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className='ml-4 text-sm font-medium text-gray-500'>
                                        {item.count} checks
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8 text-gray-500'>
                            <svg className='w-12 h-12 mx-auto mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                            </svg>
                            <p>No data yet. Try analyzing some products!</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className='bg-white rounded-xl shadow-md p-6 fade-in'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Quick Actions</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <a
                            href='/size-checker'
                            className='p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors group'
                        >
                            <div className='w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
                                </svg>
                            </div>
                            <p className='font-medium text-gray-800'>Check Size</p>
                            <p className='text-sm text-gray-500'>Analyze your fit</p>
                        </a>
                        <a
                            href='/products'
                            className='p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-colors group'
                        >
                            <div className='w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                                </svg>
                            </div>
                            <p className='font-medium text-gray-800'>Browse Products</p>
                            <p className='text-sm text-gray-500'>View catalog</p>
                        </a>
                        <a
                            href='/favorites'
                            className='p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-colors group'
                        >
                            <div className='w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                                </svg>
                            </div>
                            <p className='font-medium text-gray-800'>Favorites</p>
                            <p className='text-sm text-gray-500'>Your saved items</p>
                        </a>
                        <a
                            href='/admin?key=fyp2025'
                            className='p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors group'
                        >
                            <div className='w-10 h-10 rounded-lg bg-gray-700 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                            </div>
                            <p className='font-medium text-gray-800'>Admin Panel</p>
                            <p className='text-sm text-gray-500'>Manage products</p>
                        </a>
                    </div>
                </div>
            </div>

            {/* AI Technology Section */}
            <div className='mt-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white fade-in'>
                <div className='flex flex-col md:flex-row items-center justify-between'>
                    <div className='mb-6 md:mb-0'>
                        <h2 className='text-2xl font-bold mb-2'>Powered by AI</h2>
                        <p className='text-white text-opacity-80 max-w-lg'>
                            SizeFit AI uses Google's MediaPipe for real-time body pose detection and machine learning models trained on body measurement data to provide accurate size recommendations.
                        </p>
                    </div>
                    <div className='flex space-x-4'>
                        <div className='text-center'>
                            <div className='w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center mb-2'>
                                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <p className='text-sm font-medium'>MediaPipe</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center mb-2'>
                                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                                </svg>
                            </div>
                            <p className='text-sm font-medium'>ML Models</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center mb-2'>
                                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                                </svg>
                            </div>
                            <p className='text-sm font-medium'>Real-time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
