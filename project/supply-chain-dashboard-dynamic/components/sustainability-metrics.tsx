"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Leaf, Truck, Package, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SustainabilityMetrics() {
  const [co2Saved, setCo2Saved] = useState(2847.5)
  const [fuelSaved, setFuelSaved] = useState(1234.8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCo2Saved((prev) => prev + Math.random() * 10)
      setFuelSaved((prev) => prev + Math.random() * 5)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const sustainabilityData = [
    {
      title: "CO₂ Emissions Saved",
      value: co2Saved.toFixed(1),
      unit: "kg",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100",
      progress: 78,
      target: "3,650 kg",
      description: "Through optimized delivery routes",
    },
    {
      title: "Fuel Consumption Reduced",
      value: fuelSaved.toFixed(1),
      unit: "liters",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: 65,
      target: "1,900 L",
      description: "Via smart route planning",
    },
    {
      title: "Packaging Waste Reduced",
      value: "456.2",
      unit: "kg",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress: 82,
      target: "550 kg",
      description: "Through inventory optimization",
    },
    {
      title: "Energy Efficiency",
      value: "94.2",
      unit: "%",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      progress: 94,
      target: "95%",
      description: "Warehouse & transport efficiency",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <span>Sustainability Impact Dashboard</span>
            <Badge className="ml-auto bg-green-100 text-green-800">Carbon Neutral Goal</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {sustainabilityData.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {metric.progress}%
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h4>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                        <span className="text-sm text-gray-500">{metric.unit}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>Target: {metric.target}</span>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environmental Impact Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-green-700">Route Optimization Active</p>
                      <p className="text-sm text-green-600">Saving 45.2 kg CO₂ daily</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-blue-700">Smart Inventory Management</p>
                      <p className="text-sm text-blue-600">Reduced waste by 23.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-purple-700">Packaging Optimization</p>
                      <p className="text-sm text-purple-600">15.6% less packaging material</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sustainability Goals 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbon Neutral Operations</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Zero Waste to Landfill</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Renewable Energy Usage</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sustainable Packaging</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
