import { useState, useEffect } from 'react'

interface Delivery {
  _id: string
  truck: string
  driver: string
  route: string
  progress: number
  eta: string
  delay: number
  items: number
  status: 'in-transit' | 'delivered' | 'delayed' | 'cancelled'
  startLocation: string
  endLocation: string
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: string
  updatedAt: string
}

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/deliveries')
      if (!response.ok) {
        throw new Error('Failed to fetch delivery data')
      }
      const data = await response.json()
      setDeliveries(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateDelivery = async (delivery: Partial<Delivery> & { _id: string }) => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(delivery),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update delivery')
      }
      
      const updatedDelivery = await response.json()
      setDeliveries(prev => 
        prev.map(del => del._id === updatedDelivery._id ? updatedDelivery : del)
      )
      
      return updatedDelivery
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const addDelivery = async (delivery: Omit<Delivery, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(delivery),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add delivery')
      }
      
      const newDelivery = await response.json()
      setDeliveries(prev => [...prev, newDelivery])
      
      return newDelivery
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [])

  return {
    deliveries,
    loading,
    error,
    refetch: fetchDeliveries,
    updateDelivery,
    addDelivery,
  }
}