import { useState, useEffect } from 'react'
import { getSizeChart } from '../api/api'

/**
 * Size Chart Component
 * Displays complete body measurement guide with all sizes
 */
function SizeChart({ isOpen, onClose }) {
    const [sizeData, setSizeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('chart')

    useEffect(() => {
        if (isOpen) {
            fetchSizeChart()
        }
    }, [isOpen])

    const fetchSizeChart = async () => {
        try {
            setLoading(true)
            const data = await getSizeChart()
            setSizeData(data)
        } catch (err) {
            console.error('Failed to fetch size chart:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const bodyPartIcons = {
        shoulder: '👔',
        chest: '👕',
        sleeve: '💪',
        length: '📏',
        waist: '🎯',
        hip: '🦵',
        inseam: '👖',
        neck: '👤'
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
                {/* Header */}
                <div className='bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h2 className='text-2xl font-bold'>Size Guide</h2>
                            <p className='text-white text-opacity-80 text-sm mt-1'>
                                Complete measurement chart for all body parts
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors'
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className='flex space-x-4 mt-4'>
                        <button
                            onClick={() => setActiveTab('chart')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chart'
                                    ? 'bg-white text-primary-600'
                                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                }`}
                        >
                            📊 Size Chart
                        </button>
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'guide'
                                    ? 'bg-white text-primary-600'
                                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                }`}
                        >
                            📐 How to Measure
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='p-6 overflow-y-auto max-h-[60vh]'>
                    {loading ? (
                        <div className='space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='h-12 skeleton rounded-lg'></div>
                            ))}
                        </div>
                    ) : activeTab === 'chart' ? (
                        <div>
                            {/* Size Chart Table */}
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm'>
                                    <thead>
                                        <tr className='bg-gray-50'>
                                            <th className='px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg'>
                                                Size
                                            </th>
                                            <th className='px-4 py-3 text-center font-semibold text-gray-700'>
                                                👔 Shoulder
                                            </th>
                                            <th className='px-4 py-3 text-center font-semibold text-gray-700'>
                                                👕 Chest
                                            </th>
                                            <th className='px-4 py-3 text-center font-semibold text-gray-700'>
                                                💪 Sleeve
                                            </th>
                                            <th className='px-4 py-3 text-center font-semibold text-gray-700'>
                                                📏 Length
                                            </th>
                                            <th className='px-4 py-3 text-center font-semibold text-gray-700 rounded-tr-lg'>
                                                🎯 Waist
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData?.sizes?.map((size, index) => {
                                            const measurements = sizeData.size_chart[size]
                                            const colors = ['bg-gray-100', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-orange-50', 'bg-red-50']
                                            return (
                                                <tr key={size} className={`${colors[index]} border-b`}>
                                                    <td className='px-4 py-3'>
                                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${size === 'XS' ? 'bg-gray-500' :
                                                                size === 'S' ? 'bg-blue-500' :
                                                                    size === 'M' ? 'bg-green-500' :
                                                                        size === 'L' ? 'bg-yellow-500' :
                                                                            size === 'XL' ? 'bg-orange-500' : 'bg-red-500'
                                                            }`}>
                                                            {size}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-center'>
                                                        {measurements.shoulder[0]}"-{measurements.shoulder[1]}"
                                                    </td>
                                                    <td className='px-4 py-3 text-center'>
                                                        {measurements.chest[0]}"-{measurements.chest[1]}"
                                                    </td>
                                                    <td className='px-4 py-3 text-center'>
                                                        {measurements.sleeve[0]}"-{measurements.sleeve[1]}"
                                                    </td>
                                                    <td className='px-4 py-3 text-center'>
                                                        {measurements.length[0]}"-{measurements.length[1]}"
                                                    </td>
                                                    <td className='px-4 py-3 text-center'>
                                                        {measurements.waist[0]}"-{measurements.waist[1]}"
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <p className='text-xs text-gray-500 mt-4 text-center'>
                                * All measurements in inches. Ranges indicate min-max for each size.
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                How to Measure Each Body Part
                            </h3>
                            {sizeData?.body_parts && Object.entries(sizeData.body_parts).map(([key, info]) => (
                                <div key={key} className='flex items-start p-4 bg-gray-50 rounded-lg'>
                                    <span className='text-2xl mr-4'>{bodyPartIcons[key] || '📐'}</span>
                                    <div>
                                        <h4 className='font-semibold text-gray-900'>{info.name}</h4>
                                        <p className='text-sm text-gray-600 mt-1'>{info.description}</p>
                                        <span className='text-xs text-primary-600 mt-2 inline-block'>
                                            Unit: {info.unit}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='p-4 bg-gray-50 border-t'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-500'>
                            💡 Tip: Use a soft measuring tape for accurate results
                        </p>
                        <button
                            onClick={onClose}
                            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
                        >
                            Got It
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SizeChart
