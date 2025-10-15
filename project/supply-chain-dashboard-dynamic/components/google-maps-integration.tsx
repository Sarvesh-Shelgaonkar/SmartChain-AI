"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Truck, Navigation, RefreshCw, Loader2 } from "lucide-react"
import { useDeliveries } from "@/hooks/useDeliveries"

interface DeliveryLocation {
  id: string
  truck: string
  driver: string
  route: string
  progress: number
  status: string
  coordinates: {
    lat: number
    lng: number
  }
  eta: string
  items: number
}

export function GoogleMapsIntegration() {
  const { deliveries, loading, error } = useDeliveries()
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 }) // Mumbai center
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [googleMap, setGoogleMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  // Since we can't use actual Google Maps API without a key, let's create a simulated map experience
  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
      
      // Create a simulated map object for our component to use
      const simulatedMap = {
        panTo: (position: any) => {
          setMapCenter(position)
        },
        setZoom: (zoom: number) => {
          console.log(`Map zoom set to ${zoom}`)
        }
      }
      
      setGoogleMap(simulatedMap)
      
      // Create simulated markers for our deliveries
      if (deliveries && deliveries.length > 0) {
        const newMarkers = deliveries.map(delivery => ({
          setMap: () => {},
          getTitle: () => delivery.truck,
          position: delivery.coordinates || { lat: 19.0760, lng: 72.8777 }
        }))
        setMarkers(newMarkers)
      }
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [deliveries])

  // Initialize simulated map
  const initializeMap = () => {
    // We're using a simulated map, so we don't need to initialize a real Google Map
    // Just set the map as loaded
    setIsMapLoaded(true)
  }

  // Update simulated markers when deliveries change
  useEffect(() => {
    if (!isMapLoaded || !deliveries || deliveries.length === 0) return
    
    // Create simulated markers for our deliveries
    const newMarkers = deliveries.map(delivery => ({
      id: delivery._id,
      truck: delivery.truck,
      driver: delivery.driver,
      route: delivery.route,
      status: delivery.status,
      eta: delivery.eta,
      progress: delivery.progress,
      position: delivery.coordinates || { lat: 19.0760, lng: 72.8777 }
    }))
    
    setMarkers(newMarkers)
  }, [deliveries, isMapLoaded])

  const refreshMap = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const focusOnTruck = (truckId: string) => {
    setSelectedTruck(truckId)
    
    const delivery = deliveries.find(d => d._id === truckId)
    if (delivery) {
      const position = { 
        lat: delivery.coordinates?.lat || 19.0760, 
        lng: delivery.coordinates?.lng || 72.8777 
      }
      setMapCenter(position)
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span>Live Route Tracking</span>
              <Badge className="bg-green-100 text-green-800">Google Maps</Badge>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={refreshMap} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Google Maps Container */}
          <div className="relative h-96 rounded-lg border overflow-hidden">
            {!isMapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-blue-50 relative">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-gray-300"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Major Cities */}
                  <div className="absolute top-4 left-8 flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-xs font-semibold">Mumbai</span>
                  </div>
                  <div className="absolute top-12 right-16 flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-xs font-semibold">Pune</span>
                  </div>
                  <div className="absolute bottom-16 left-12 flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-xs font-semibold">Nashik</span>
                  </div>
                  <div className="absolute bottom-8 right-8 flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-xs font-semibold">Nagpur</span>
                  </div>
                  
                  {/* Delivery Markers */}
                  {deliveries.map((delivery, index) => (
                    <div
                      key={delivery._id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                        selectedTruck === delivery._id ? 'scale-125 z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 10)}%`
                      }}
                      onClick={() => focusOnTruck(delivery._id)}
                    >
                      {/* Truck Icon */}
                      <div className={`relative p-2 rounded-full shadow-lg ${
                        delivery.status === 'in-transit' ? 'bg-green-500' : 
                        delivery.status === 'delayed' ? 'bg-red-500' : 
                        delivery.status === 'cancelled' ? 'bg-gray-500' : 'bg-blue-500'
                      }`}>
                        <Truck className="h-4 w-4 text-white" />
                        
                        {/* Pulse Animation for Active Trucks */}
                        {delivery.status === 'in-transit' && (
                          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                        )}
                      </div>
                      
                      {/* Info Window */}
                      {selectedTruck === delivery._id && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border min-w-48 z-30">
                          <div className="text-xs space-y-1">
                            <p className="font-semibold">{delivery.truck}</p>
                            <p className="text-gray-600">{delivery.driver}</p>
                            <p className="text-gray-600">{delivery.route}</p>
                            <div className="flex items-center justify-between">
                              <span>Status:</span>
                              <Badge variant={
                                delivery.status === 'in-transit' ? 'default' :
                                delivery.status === 'delayed' ? 'destructive' :
                                delivery.status === 'cancelled' ? 'outline' : 'secondary'
                              }>
                                {delivery.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>ETA:</span>
                              <span className="font-semibold">{delivery.eta}</span>
                            </div>
                          </div>
                          {/* Arrow pointing down */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button variant="outline" size="sm" className="bg-white">
                      <Navigation className="h-4 w-4" />
                    </Button>
                    <div className="bg-white rounded p-2 text-xs">
                      <div>Zoom: 8x</div>
                      <div>Scale: 1:500k</div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <h4 className="text-xs font-semibold mb-2">Legend</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>In Transit</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Delayed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span>Cancelled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={mapRef} className="h-full w-full absolute inset-0 pointer-events-none opacity-0" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="text-lg font-bold text-green-600">
                {deliveries.filter(d => d.status === 'in-transit').length}
              </p>
              <p className="text-xs text-green-700">In Transit</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <p className="text-lg font-bold text-red-600">
                {deliveries.filter(d => d.status === 'delayed').length}
              </p>
              <p className="text-xs text-red-700">Delayed</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-lg font-bold text-gray-600">
                {deliveries.filter(d => d.status === 'cancelled').length}
              </p>
              <p className="text-xs text-gray-700">Cancelled</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-lg font-bold text-blue-600">
                {deliveries.filter(d => d.status === 'delivered').length}
              </p>
              <p className="text-xs text-blue-700">Delivered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Truck List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                Error loading deliveries
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                No active deliveries found
              </div>
            ) : (
              deliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTruck === delivery._id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => focusOnTruck(delivery._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        delivery.status === 'in-transit' ? 'bg-green-500' : 
                        delivery.status === 'delayed' ? 'bg-red-500' :
                        delivery.status === 'cancelled' ? 'bg-gray-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-sm">{delivery.truck}</p>
                        <p className="text-xs text-gray-600">{delivery.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{delivery.progress}%</p>
                      <p className="text-xs text-gray-600">{delivery.eta}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}