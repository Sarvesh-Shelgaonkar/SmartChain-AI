import { useState, useEffect } from 'react'

interface ReorderRecommendation {
  _id: string
  sku: string
  product: string
  store: string
  currentStock: number
  dailyConsumption: number
  daysLeft: number
  recommendedOrder: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  supplier: string
  estimatedCost: number
  leadTime: number
  category: string
  reason: string
  isProcessed: boolean
  createdAt: string
  updatedAt: string
}

export function useReorderRecommendations() {
  const [recommendations, setRecommendations] = useState<ReorderRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reorder-recommendations')
      if (!response.ok) {
        throw new Error('Failed to fetch reorder recommendations')
      }
      const data = await response.json()
      setRecommendations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateRecommendation = async (recommendation: Partial<ReorderRecommendation> & { _id: string }) => {
    try {
      const response = await fetch('/api/reorder-recommendations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendation),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update reorder recommendation')
      }
      
      const updatedRecommendation = await response.json()
      setRecommendations(prev => 
        prev.map(rec => rec._id === updatedRecommendation._id ? updatedRecommendation : rec)
      )
      
      return updatedRecommendation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const addRecommendation = async (recommendation: Omit<ReorderRecommendation, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/reorder-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendation),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add reorder recommendation')
      }
      
      const newRecommendation = await response.json()
      setRecommendations(prev => [...prev, newRecommendation])
      
      return newRecommendation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
    updateRecommendation,
    addRecommendation,
  }
}