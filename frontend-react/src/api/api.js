/**
 * AI-VTON API Client
 * Centralized API communication with the backend
 */

import axios from 'axios'

// Configuration from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for image uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging (development only)
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log(`🌐 API ${config.method?.toUpperCase()} ${config.url}`)
    return config
  })
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ==================== Product APIs ====================

export const getProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`)
  return response.data
}

export const filterProducts = async (search = '', size = 'all') => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (size && size !== 'all') params.append('size', size)
  const response = await api.get(`/products/filter/search?${params.toString()}`)
  return response.data
}

// ==================== Size Chart API ====================

export const getSizeChart = async () => {
  const response = await api.get('/size-chart')
  return response.data
}

// ==================== Admin APIs ====================

export const addProduct = async (formData, adminKey) => {
  const response = await api.post(
    `/admin/add-product?key=${adminKey}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

export const deleteProduct = async (productId, adminKey) => {
  const response = await api.delete(
    `/admin/delete-product/${productId}?key=${adminKey}`
  )
  return response.data
}

// ==================== Measurement APIs ====================

export const measureBody = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await api.post('/measure', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const compareSizes = async (productId, userMeasurements) => {
  const response = await api.post('/compare', {
    product_id: productId,
    user_measurements: userMeasurements,
  })
  return response.data
}

export const analyzeAndCompare = async (
  productId,
  imageFile,
  userHeight = null
) => {
  const formData = new FormData()
  formData.append('image', imageFile)

  let url = `/analyze?product_id=${productId}`
  if (userHeight) {
    url += `&user_height=${userHeight}`
  }

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// ==================== Utilities ====================

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${API_BASE_URL}/${imagePath}`
}

export const getAdminKey = () => {
  return import.meta.env.VITE_ADMIN_KEY || 'fyp2024'
}

export default api
