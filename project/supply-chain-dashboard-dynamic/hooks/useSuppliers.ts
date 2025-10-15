import { useState, useEffect } from 'react'

interface Supplier {
  _id: string
  name: string
  category: string
  onTimeDelivery: number
  avgDelay: number
  qualityScore: number
  costEfficiency: number
  sustainabilityScore: number
  totalOrders: number
  rating: number
  contact: {
    email: string
    phone: string
    address: string
  }
  performance: {
    lastMonth: number
    trend: 'up' | 'down' | 'stable'
  }
  createdAt: string
  updatedAt: string
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/suppliers')
      if (!response.ok) {
        throw new Error('Failed to fetch supplier data')
      }
      const data = await response.json()
      setSuppliers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateSupplier = async (supplier: Partial<Supplier> & { _id: string }) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update supplier')
      }
      
      const updatedSupplier = await response.json()
      setSuppliers(prev => 
        prev.map(sup => sup._id === updatedSupplier._id ? updatedSupplier : sup)
      )
      
      return updatedSupplier
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const addSupplier = async (supplier: Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add supplier')
      }
      
      const newSupplier = await response.json()
      setSuppliers(prev => [...prev, newSupplier])
      
      return newSupplier
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    updateSupplier,
    addSupplier,
  }
}