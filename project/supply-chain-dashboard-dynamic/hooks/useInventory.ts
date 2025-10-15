import { useState, useEffect } from 'react'

interface InventoryItem {
  _id: string
  product: string
  store: string
  current: number
  optimal: number
  predicted: number
  trend: number
  category: string
  sku: string
  lastUpdated: string
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory')
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data')
      }
      const data = await response.json()
      setInventory(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateInventory = async (item: Partial<InventoryItem> & { _id: string }) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update inventory item')
      }
      
      const updatedItem = await response.json()
      setInventory(prev => 
        prev.map(inv => inv._id === updatedItem._id ? updatedItem : inv)
      )
      
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const addInventory = async (item: Omit<InventoryItem, '_id' | 'lastUpdated'>) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add inventory item')
      }
      
      const newItem = await response.json()
      setInventory(prev => [...prev, newItem])
      
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  return {
    inventory,
    loading,
    error,
    refetch: fetchInventory,
    updateInventory,
    addInventory,
  }
}