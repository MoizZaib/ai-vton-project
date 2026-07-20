import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getImageUrl } from '../api/api'
import { useFavorites } from '../context/FavoritesContext'
import BuyModal from '../components/BuyModal'

function Favorites() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { favorites, toggleFavorite } = useFavorites()
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const data = await getProducts()
            setProducts(data)
        } catch (err) {
            console.error('Failed to fetch products:', err)
        } finally {
            setLoading(false)
        }
    }

    const favoriteProducts = products.filter((p) => favorites.includes(p.id))

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>My Favorites</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <div className='h-48 skeleton'></div>
                            <div className='p-4 space-y-3'>
                                <div className='h-6 w-3/4 skeleton'></div>
                                <div className='h-4 w-1/2 skeleton'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>My Favorites</h1>
                    <p className='text-gray-500 mt-1'>
                        {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                <Link
                    to='/products'
                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
                >
                    Browse Products
                </Link>
            </div>

            {favoriteProducts.length === 0 ? (
                <div className='text-center py-16 fade-in'>
                    <div className='w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center'>
                        <svg
                            className='w-12 h-12 text-red-300'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                            />
                        </svg>
                    </div>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>No favorites yet</h2>
                    <p className='text-gray-500 mb-6'>
                        Start adding products you love by clicking the heart icon!
                    </p>
                    <Link
                        to='/products'
                        className='inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors'
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
                                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                            />
                        </svg>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {favoriteProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className='bg-white rounded-lg shadow-md overflow-hidden card-hover fade-in'
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className='relative h-48 bg-gray-100'>
                                {product.image ? (
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className='h-full w-full object-cover'
                                    />
                                ) : (
                                    <div className='h-full w-full flex items-center justify-center text-gray-400'>
                                        No Image
                                    </div>
                                )}
                                <button
                                    onClick={() => toggleFavorite(product.id)}
                                    className='absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform heart-pulse'
                                >
                                    <svg
                                        className='w-5 h-5 text-red-500'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                                    </svg>
                                </button>
                            </div>
                            <div className='p-4'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                                    {product.name}
                                </h3>
                                <div className='grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4'>
                                    <div>
                                        <span className='font-medium'>Shoulder:</span> {product.shoulder}"
                                    </div>
                                    <div>
                                        <span className='font-medium'>Chest:</span> {product.chest}"
                                    </div>
                                </div>
                                <div className='flex space-x-2'>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product)
                                            setBuyModalOpen(true)
                                        }}
                                        className='flex-1 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors'
                                    >
                                        Buy Now
                                    </button>
                                    <Link
                                        to={`/size-checker?product=${product.id}`}
                                        className='flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center'
                                    >
                                        Check Fit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <BuyModal
                isOpen={buyModalOpen}
                onClose={() => setBuyModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    )
}

export default Favorites
