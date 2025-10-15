"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Truck, MapPin, Navigation, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RoutePoint {
  id: string
  name: string
  type: "hub" | "store" | "checkpoint"
  x: number
  y: number
  status: "completed" | "current" | "upcoming"
}

interface TruckRoute {
  id: string
  truck: string
  driver: string
  route: string
  progress: number
  eta: string
  delay: number
  items: number
  currentLocation: { x: number; y: number }
  routePoints: RoutePoint[]
  status: "on-time" | "delayed" | "early"
}

const truckRoutes: TruckRoute[] = [
  {
    id: "1",
    truck: "MH-12-AB-1234",
    driver: "Rajesh Kumar",
    route: "Mumbai → Jalgaon",
    progress: 75,
    eta: "2h 15m",
    delay: 0,
    items: 45,
    currentLocation: { x: 65, y: 35 },
    status: "on-time",
    routePoints: [
      { id: "mumbai", name: "Mumbai Hub", type: "hub", x: 20, y: 60, status: "completed" },
      { id: "thane", name: "Thane Checkpoint", type: "checkpoint", x: 35, y: 45, status: "completed" },
      { id: "nashik", name: "Nashik Junction", type: "checkpoint", x: 50, y: 35, status: "completed" },
      { id: "current", name: "Current Location", type: "checkpoint", x: 65, y: 35, status: "current" },
      { id: "jalgaon", name: "Jalgaon Central", type: "store", x: 80, y: 25, status: "upcoming" },
    ],
  },
  {
    id: "2",
    truck: "MH-14-CD-5678",
    driver: "Priya Sharma",
    route: "Pune → Nashik",
    progress: 45,
    eta: "3h 45m",
    delay: 30,
    items: 67,
    currentLocation: { x: 40, y: 55 },
    status: "delayed",
    routePoints: [
      { id: "pune", name: "Pune Hub", type: "hub", x: 25, y: 70, status: "completed" },
      { id: "current2", name: "Current Location", type: "checkpoint", x: 40, y: 55, status: "current" },
      { id: "ahmednagar", name: "Ahmednagar", type: "checkpoint", x: 55, y: 45, status: "upcoming" },
      { id: "nashik-mall", name: "Nashik Mall", type: "store", x: 70, y: 35, status: "upcoming" },
    ],
  },
  {
    id: "3",
    truck: "MH-16-EF-9012",
    driver: "Amit Patel",
    route: "Nagpur → Aurangabad",
    progress: 90,
    eta: "45m",
    delay: -15,
    items: 32,
    currentLocation: { x: 75, y: 55 },
    status: "early",
    routePoints: [
      { id: "nagpur", name: "Nagpur Hub", type: "hub", x: 85, y: 30, status: "completed" },
      { id: "akola", name: "Akola", type: "checkpoint", x: 75, y: 40, status: "completed" },
      { id: "current3", name: "Current Location", type: "checkpoint", x: 75, y: 55, status: "current" },
      { id: "aurangabad", name: "Aurangabad Plaza", type: "store", x: 65, y: 65, status: "upcoming" },
    ],
  },
]

export function InteractiveMap() {
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null)
  const [animatedTrucks, setAnimatedTrucks] = useState(truckRoutes)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTrucks((prev) =>
        prev.map((truck) => ({
          ...truck,
          currentLocation: {
            x: truck.currentLocation.x + (Math.random() - 0.5) * 2,
            y: truck.currentLocation.y + (Math.random() - 0.5) * 2,
          },
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "text-green-500"
      case "delayed":
        return "text-red-500"
      case "early":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getPointColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "current":
        return "bg-blue-500 animate-pulse"
      case "upcoming":
        return "bg-gray-400 dark:bg-gray-600"
      default:
        return "bg-gray-400"
    }
  }

  const getPointIcon = (type: string, status: string) => {
    if (status === "current") return <Navigation className="h-3 w-3 text-white" />
    if (type === "hub") return <MapPin className="h-3 w-3 text-white" />
    if (type === "store") return <MapPin className="h-3 w-3 text-white" />
    return <div className="w-2 h-2 bg-white rounded-full" />
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Live Route Tracking Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 h-96 rounded-lg overflow-hidden border border-border">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%239C92AC fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

              {/* State Boundaries */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <path
                  d="M10,20 Q30,15 50,25 Q70,20 90,30 L85,70 Q60,75 40,70 Q20,75 10,65 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-400 dark:text-gray-600"
                  strokeDasharray="2,2"
                />
              </svg>

              {/* Routes */}
              {animatedTrucks.map((truck) => (
                <svg key={`route-${truck.id}`} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {truck.routePoints.map((point, index) => {
                    if (index === truck.routePoints.length - 1) return null
                    const nextPoint = truck.routePoints[index + 1]
                    return (
                      <line
                        key={`line-${point.id}`}
                        x1={point.x}
                        y1={point.y}
                        x2={nextPoint.x}
                        y2={nextPoint.y}
                        stroke={
                          point.status === "completed" ? "#10b981" : point.status === "current" ? "#3b82f6" : "#9ca3af"
                        }
                        strokeWidth="2"
                        strokeDasharray={point.status === "upcoming" ? "4,4" : "none"}
                        className="opacity-70"
                      />
                    )
                  })}
                </svg>
              ))}

              {/* Route Points */}
              {animatedTrucks.map((truck) =>
                truck.routePoints.map((point) => (
                  <motion.div
                    key={point.id}
                    className={`absolute w-6 h-6 rounded-full ${getPointColor(point.status)} flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg`}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedTruck(truck.id)}
                  >
                    {getPointIcon(point.type, point.status)}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                      {point.name}
                    </div>
                  </motion.div>
                )),
              )}

              {/* Animated Trucks */}
              {animatedTrucks.map((truck) => (
                <motion.div
                  key={`truck-${truck.id}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
                  style={{ left: `${truck.currentLocation.x}%`, top: `${truck.currentLocation.y}%` }}
                  animate={{
                    x: [0, 2, -2, 0],
                    y: [0, -1, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedTruck(selectedTruck === truck.id ? null : truck.id)}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${getStatusColor(truck.status)} bg-background border-2 border-current flex items-center justify-center shadow-lg`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  {selectedTruck === truck.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg p-3 shadow-xl min-w-48 z-10"
                    >
                      <div className="text-sm">
                        <p className="font-semibold">{truck.truck}</p>
                        <p className="text-muted-foreground">{truck.driver}</p>
                        <p className="text-xs mt-1">{truck.route}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs">Progress: {truck.progress}%</span>
                          <Badge variant={truck.status === "delayed" ? "destructive" : "secondary"} className="text-xs">
                            {truck.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur border border-border rounded-lg p-3 text-xs">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Current Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Live Status */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur border border-border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Tracking</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{animatedTrucks.length} vehicles active</p>
              </div>
            </div>
          </div>

          {/* Truck Details Panel */}
          <div className="space-y-4">
            <h3 className="font-semibold">Active Deliveries</h3>
            {animatedTrucks.map((truck) => (
              <motion.div
                key={truck.id}
                className={`p-4 border border-border rounded-lg cursor-pointer transition-all ${
                  selectedTruck === truck.id ? "ring-2 ring-primary" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTruck(selectedTruck === truck.id ? null : truck.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Truck className={`h-4 w-4 ${getStatusColor(truck.status)}`} />
                    <span className="font-semibold text-sm">{truck.truck}</span>
                  </div>
                  <Badge
                    variant={
                      truck.status === "delayed" ? "destructive" : truck.status === "early" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {truck.status === "on-time" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {truck.status === "delayed" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {truck.status === "early" && <Clock className="h-3 w-3 mr-1" />}
                    {truck.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{truck.driver}</p>
                <p className="text-sm mb-2">{truck.route}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{truck.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${truck.progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>ETA: {truck.eta}</span>
                    <span>{truck.items} items</span>
                  </div>
                  {truck.delay !== 0 && (
                    <div className="text-xs">
                      {truck.delay > 0 ? (
                        <span className="text-red-500">+{truck.delay}m delay</span>
                      ) : (
                        <span className="text-green-500">{Math.abs(truck.delay)}m early</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Route Analytics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">On Schedule</p>
                  <p className="text-lg font-bold text-green-600">
                    {animatedTrucks.filter((t) => t.status === "on-time").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Delayed</p>
                  <p className="text-lg font-bold text-red-600">
                    {animatedTrucks.filter((t) => t.status === "delayed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Early</p>
                  <p className="text-lg font-bold text-blue-600">
                    {animatedTrucks.filter((t) => t.status === "early").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
