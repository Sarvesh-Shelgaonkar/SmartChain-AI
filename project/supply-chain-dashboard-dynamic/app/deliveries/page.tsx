"use client"

import { useState } from "react"
import { Truck, ArrowLeft, Search, Filter, MapPin, X, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDeliveries } from "@/hooks/useDeliveries"
import { EnhancedMap } from "@/components/enhanced-map"
import { GoogleMapsIntegration } from "@/components/google-maps-integration"
import Link from "next/link"

export default function DeliveriesPage() {
  const { deliveries, loading, error, updateDelivery } = useDeliveries()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleCancelDelivery = async (deliveryId: string) => {
    try {
      // Update delivery status
      const updatedDelivery = await updateDelivery({
        _id: deliveryId,
        status: 'cancelled',
        progress: 0,
        eta: 'Cancelled'
      })
      
      // Show success message
      alert(`Delivery ${updatedDelivery.truck} has been cancelled successfully.`)
      
      // Close the dialog automatically
      const dialogElement = document.querySelector('[role="dialog"]')
      if (dialogElement) {
        const closeButton = dialogElement.querySelector('button[aria-label="Close"]')
        if (closeButton) {
          (closeButton as HTMLButtonElement).click()
        }
      }
    } catch (error) {
      console.error('Failed to cancel delivery:', error)
      alert('Failed to cancel delivery. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit': return 'bg-blue-500'
      case 'delivered': return 'bg-green-500'
      case 'delayed': return 'bg-red-500'
      case 'cancelled': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in-transit': return 'default'
      case 'delivered': return 'secondary'
      case 'delayed': return 'destructive'
      case 'cancelled': return 'outline'
      default: return 'outline'
    }
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.route.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delivery data...</p>
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
              <Truck className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search trucks, drivers, or routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                <p className="text-sm text-gray-500">Total Deliveries</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {deliveries.filter(d => d.status === 'in-transit').length}
                </p>
                <p className="text-sm text-gray-500">In Transit</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {deliveries.filter(d => d.status === 'delayed').length}
                </p>
                <p className="text-sm text-gray-500">Delayed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-500">Delivered</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Active Deliveries ({filteredDeliveries.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredDeliveries.map((delivery) => (
                <div key={delivery._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)}`}></div>
                      <div>
                        <h4 className="font-semibold">{delivery.truck}</h4>
                        <p className="text-sm text-gray-500">{delivery.driver}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(delivery.status)}>
                      {delivery.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium">{delivery.route}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{delivery.startLocation} → {delivery.endLocation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Progress: {delivery.progress}%</span>
                    <span className="text-sm">ETA: {delivery.eta}</span>
                  </div>
                  
                  <Progress value={delivery.progress} className="h-2 mb-2" />
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>{delivery.items} items</span>
                    <span className={delivery.delay > 0 ? 'text-red-500' : delivery.delay < 0 ? 'text-green-500' : ''}>
                      {delivery.delay > 0 ? `+${delivery.delay}m delay` : 
                       delivery.delay < 0 ? `${Math.abs(delivery.delay)}m early` : 'On time'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-3">
                    {delivery.status === 'in-transit' || delivery.status === 'delayed' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span>Cancel Delivery</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                Are you sure you want to cancel this delivery? This action cannot be undone.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="font-semibold">{delivery.truck}</p>
                              <p className="text-sm text-gray-600">{delivery.route}</p>
                              <p className="text-sm text-gray-600">Driver: {delivery.driver}</p>
                              <p className="text-sm text-gray-600">{delivery.items} items</p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="destructive" 
                                onClick={() => handleCancelDelivery(delivery._id)}
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Yes, Cancel Delivery
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Keep Delivery
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : delivery.status === 'delivered' ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : delivery.status === 'cancelled' ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        <X className="h-3 w-3 mr-1" />
                        Cancelled
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
              {filteredDeliveries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No deliveries match your current filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Interactive Map */}
        <GoogleMapsIntegration />
      </div>
    </div>
  )
}