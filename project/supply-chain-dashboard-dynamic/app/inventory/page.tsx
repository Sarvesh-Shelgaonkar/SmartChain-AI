"use client"

import { useState } from "react"
import { Package, ArrowLeft, Search, Filter, Plus, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useInventory } from "@/hooks/useInventory"
import { ProductSubstitution } from "@/components/product-substitution"
import Link from "next/link"

export default function InventoryPage() {
  const { inventory, loading, error, addInventory } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    product: '',
    store: '',
    current: 0,
    optimal: 0,
    predicted: 0,
    trend: 0,
    category: '',
    sku: ''
  })

  const handleAddItem = async () => {
    try {
      // Validate required fields
      if (!newItem.product || !newItem.store || !newItem.category || !newItem.sku) {
        alert('Please fill in all required fields: Product Name, Store, Category, and SKU')
        return
      }

      // Add lastUpdated field
      const itemToAdd = {
        ...newItem,
        lastUpdated: new Date().toISOString()
      }

      const addedItem = await addInventory(itemToAdd)
      
      // Show success message
      alert(`Successfully added ${addedItem.product} to inventory!`)
      
      // Reset form and close dialog
      setShowAddDialog(false)
      setNewItem({
        product: '',
        store: '',
        current: 0,
        optimal: 0,
        predicted: 0,
        trend: 0,
        category: '',
        sku: ''
      })
    } catch (error) {
      console.error('Failed to add item:', error)
      alert('Failed to add inventory item. Please try again.')
    }
  }

  const getStockStatus = (current: number, optimal: number) => {
    const percentage = (current / optimal) * 100
    if (percentage < 30) return { status: "critical", color: "bg-red-500", text: "Critical" }
    if (percentage < 60) return { status: "low", color: "bg-orange-500", text: "Low Stock" }
    if (percentage > 120) return { status: "excess", color: "bg-blue-500", text: "Excess" }
    return { status: "optimal", color: "bg-green-500", text: "Optimal" }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.store.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const stockStatus = getStockStatus(item.current, item.optimal)
    const matchesStatus = statusFilter === "all" || stockStatus.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(inventory.map(item => item.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product">Product Name</Label>
                  <Input
                    id="product"
                    value={newItem.product}
                    onChange={(e) => setNewItem({...newItem, product: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    placeholder="Enter SKU"
                  />
                </div>
                <div>
                  <Label htmlFor="store">Store</Label>
                  <Select value={newItem.store} onValueChange={(value) => setNewItem({...newItem, store: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mumbai Store">Mumbai Store</SelectItem>
                      <SelectItem value="Pune Central">Pune Central</SelectItem>
                      <SelectItem value="Nashik Mall">Nashik Mall</SelectItem>
                      <SelectItem value="Jalgaon Central">Jalgaon Central</SelectItem>
                      <SelectItem value="Aurangabad Plaza">Aurangabad Plaza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Care">Personal Care</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Household">Household</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="current">Current Stock</Label>
                    <Input
                      id="current"
                      type="number"
                      value={newItem.current}
                      onChange={(e) => setNewItem({...newItem, current: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="optimal">Optimal Stock</Label>
                    <Input
                      id="optimal"
                      type="number"
                      value={newItem.optimal}
                      onChange={(e) => setNewItem({...newItem, optimal: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products or stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="excess">Excess</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(item => getStockStatus(item.current, item.optimal).status === 'critical').length}
                </p>
                <p className="text-sm text-gray-500">Critical Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {inventory.filter(item => getStockStatus(item.current, item.optimal).status === 'low').length}
                </p>
                <p className="text-sm text-gray-500">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {inventory.filter(item => {
                    const status = getStockStatus(item.current, item.optimal).status;
                    return status === 'optimal' || status === 'excess';
                  }).length}
                </p>
                <p className="text-sm text-gray-500">Optimal/Excess Stock</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Inventory Items ({filteredInventory.length})</span>
                <Badge variant="outline" className="ml-auto">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.current, item.optimal)
                  const percentage = (item.current / item.optimal) * 100

                  return (
                    <div key={item._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                          <div>
                            <h4 className="font-semibold">{item.product}</h4>
                            <p className="text-sm text-gray-500">{item.store} • {item.category}</p>
                            <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={stockStatus.status === "critical" ? "destructive" : "secondary"}>
                            {stockStatus.text}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.trend > 0 ? "+" : ""}
                            {item.trend}% trend
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Current: {item.current} units</span>
                        <span className="text-sm">Predicted: {item.predicted} units (7 days)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>Optimal: {item.optimal}</span>
                      </div>
                    </div>
                  )
                })}
                {filteredInventory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No items match your current filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ProductSubstitution />
        </div>
      </div>
    </div>
  )
}