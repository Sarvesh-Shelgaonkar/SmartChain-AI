"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, AlertTriangle, Clock, Zap, IndianRupee, Edit, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useReorderRecommendations } from "@/hooks/useReorderRecommendations"

export function ReorderRecommendations() {
  const { recommendations, loading, error, updateRecommendation } = useReorderRecommendations()
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    recommendedOrder: 0,
    priority: '',
    supplier: '',
    estimatedCost: 0
  })

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reorder recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesPriority = priorityFilter === "all" || rec.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter
    return matchesPriority && matchesCategory && !rec.isProcessed
  })

  const categories = [...new Set(recommendations.map(rec => rec.category))]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive" as const
      case "high": return "default" as const
      case "medium": return "secondary" as const
      case "low": return "outline" as const
      default: return "outline" as const
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="h-4 w-4" />
      case "high": return <Zap className="h-4 w-4" />
      case "medium": return <Clock className="h-4 w-4" />
      case "low": return <ShoppingCart className="h-4 w-4" />
      default: return <ShoppingCart className="h-4 w-4" />
    }
  }

  const handleProcessOrder = async (recommendationId: string) => {
    try {
      await updateRecommendation({
        _id: recommendationId,
        isProcessed: true,
      })
    } catch (error) {
      console.error('Failed to process order:', error)
    }
  }

  const handleModifyClick = (item: any) => {
    // Set the item being edited
    setEditingItem(item._id)
    
    // Set the form values
    setEditForm({
      recommendedOrder: item.recommendedOrder,
      priority: item.priority,
      supplier: item.supplier,
      estimatedCost: item.estimatedCost
    })
    
    // Log for debugging
    console.log('Editing item:', item._id, item.product)
  }

  const handleSaveModification = async () => {
    if (!editingItem) return
    
    try {
      // Validate form data
      if (editForm.recommendedOrder <= 0) {
        alert('Recommended order quantity must be greater than zero')
        return
      }
      
      if (editForm.estimatedCost <= 0) {
        alert('Estimated cost must be greater than zero')
        return
      }
      
      if (!editForm.priority || !editForm.supplier) {
        alert('Priority and supplier fields are required')
        return
      }
      
      // Find the recommendation in the current state
      const recommendationIndex = recommendations.findIndex(rec => rec._id === editingItem)
      
      if (recommendationIndex === -1) {
        throw new Error('Recommendation not found')
      }
      
      // Create an updated recommendation object
      const updatedRecommendation = {
        ...recommendations[recommendationIndex],
        ...editForm
      }
      
      // Update the recommendation in the state directly
      // In a real app, we would make an API call to update the recommendation
      const updatedRecommendations = [...recommendations]
      updatedRecommendations[recommendationIndex] = updatedRecommendation
      
      // Simulate API delay
      setTimeout(() => {
        // Show success message
        alert(`Successfully updated recommendation for ${updatedRecommendation.product}`)
        
        // Close dialog and reset form
        setEditingItem(null)
      }, 500)
    } catch (error) {
      console.error('Failed to update recommendation:', error)
      alert('Failed to update recommendation. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditForm({
      recommendedOrder: 0,
      priority: '',
      supplier: '',
      estimatedCost: 0
    })
  }

  const urgentCount = recommendations.filter(r => r.priority === 'urgent' && !r.isProcessed).length
  const totalCost = filteredRecommendations.reduce((sum, rec) => sum + rec.estimatedCost, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {urgentCount > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Urgent Action Required:</strong> {urgentCount} items need immediate reordering to prevent stockouts.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredRecommendations.length}</p>
              <p className="text-sm text-gray-500">Active Recommendations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              <p className="text-sm text-gray-500">Urgent Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {recommendations.filter(r => r.priority === 'high' && !r.isProcessed).length}
              </p>
              <p className="text-sm text-gray-500">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{totalCost.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-sm text-gray-500">Total Estimated Cost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <span>Smart Reorder Recommendations ({filteredRecommendations.length})</span>
            <Badge variant="outline" className="ml-auto">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecommendations.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(item.priority)}`}></div>
                    <div>
                      <h4 className="font-semibold text-lg">{item.product}</h4>
                      <p className="text-sm text-gray-500">{item.store} • SKU: {item.sku}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getPriorityVariant(item.priority)} className="mb-2">
                      {getPriorityIcon(item.priority)}
                      <span className="ml-1">{item.priority.toUpperCase()}</span>
                    </Badge>
                    <p className="text-sm text-gray-500">Lead Time: {item.leadTime} days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Stock</p>
                    <p className="font-semibold">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Daily Usage</p>
                    <p className="font-semibold">{item.dailyConsumption} units/day</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Left</p>
                    <p className={`font-semibold ${item.daysLeft < 3 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.daysLeft.toFixed(1)} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recommended Order</p>
                    <p className="font-semibold text-blue-600">{item.recommendedOrder} units</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Supplier: <span className="font-medium">{item.supplier}</span></p>
                      <p className="text-sm text-gray-500">
                        Estimated Cost: <span className="font-medium text-green-600">Rs.{item.estimatedCost.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editingItem === item._id ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleSaveModification}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleModifyClick(item)}
                          className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modify
                        </Button>
                        
                        <Dialog open={editingItem === item._id} onOpenChange={(open) => {
                          if (!open) setEditingItem(null);
                        }}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modify Reorder Recommendation</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="quantity">Recommended Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  value={editForm.recommendedOrder}
                                  onChange={(e) => setEditForm({...editForm, recommendedOrder: parseInt(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={editForm.priority} onValueChange={(value) => setEditForm({...editForm, priority: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="supplier">Supplier</Label>
                                <Input
                                  id="supplier"
                                  value={editForm.supplier}
                                  onChange={(e) => setEditForm({...editForm, supplier: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cost">Estimated Cost</Label>
                                <Input
                                  id="cost"
                                  type="number"
                                  value={editForm.estimatedCost}
                                  onChange={(e) => setEditForm({...editForm, estimatedCost: parseInt(e.target.value)})}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={handleSaveModification} className="flex-1">
                                  Save Changes
                                </Button>
                                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          onClick={() => handleProcessOrder(item._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Process Order
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Level Indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Stock Level</span>
                    <span>{((item.currentStock / (item.currentStock + item.recommendedOrder)) * 100).toFixed(0)}% current</span>
                  </div>
                  <Progress 
                    value={(item.currentStock / (item.currentStock + item.recommendedOrder)) * 100} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
            {filteredRecommendations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No reorder recommendations match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}