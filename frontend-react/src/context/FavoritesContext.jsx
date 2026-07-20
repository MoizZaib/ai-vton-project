import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addFavorite = (productId) => {
        setFavorites((prev) => [...new Set([...prev, productId])])
    }

    const removeFavorite = (productId) => {
        setFavorites((prev) => prev.filter((id) => id !== productId))
    }

    const isFavorite = (productId) => favorites.includes(productId)

    const toggleFavorite = (productId) => {
        if (isFavorite(productId)) {
            removeFavorite(productId)
        } else {
            addFavorite(productId)
        }
    }

    return (
        <FavoritesContext.Provider
            value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}
