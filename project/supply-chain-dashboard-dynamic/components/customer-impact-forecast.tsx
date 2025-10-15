"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, TrendingDown, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const customerImpactData = [
  {
    id: 1,
    product: "Parachute Coconut Oil 500ml",
    store: "Jalgaon Central",
    riskLevel: 95,
    affectedCustomers: 1247,
    predictedLoss: 89500,
    timeToStockout: "2.3 days",
    customerSatisfaction: 23,
    alternativeAvailable: false,
  },
  {
    id: 2,
    product: "Surf Excel 1kg",
    store: "Kolhapur Store",
    riskLevel: 78,
    affectedCustomers: 892,
    predictedLoss: 67200,
    timeToStockout: "4.1 days",
    customerSatisfaction: 45,
    alternativeAvailable: true,
  },
  {
    id: 3,
    product: "Maggi 2-Minute Noodles",
    store: "Nashik Mall",
    riskLevel: 65,
    affectedCustomers: 634,
    predictedLoss: 45800,
    timeToStockout: "5.8 days",
    customerSatisfaction: 62,
    alternativeAvailable: true,
  },
  {
    id: 4,
    product: "Tata Salt 1kg",
    store: "Aurangabad Plaza",
    riskLevel: 52,
    affectedCustomers: 456,
    predictedLoss: 32100,
    timeToStockout: "6.2 days",
    customerSatisfaction: 71,
    alternativeAvailable: true,
  },
]

export function CustomerImpactForecast() {
  const [totalLoss, setTotalLoss] = useState(234600)

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalLoss((prev) => prev + Math.floor(Math.random() * 1000))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return { color: "text-red-600", bg: "bg-red-100", border: "border-red-200" }
    if (risk >= 60) return { color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" }
    if (risk >= 40) return { color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" }
    return { color: "text-green-600", bg: "bg-green-100", border: "border-green-200" }
  }

  const getRiskGauge = (risk: number) => {
    const colors = getRiskColor(risk)
    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={risk >= 80 ? "#dc2626" : risk >= 60 ? "#ea580c" : risk >= 40 ? "#d97706" : "#16a34a"}
            strokeWidth="2"
            strokeDasharray={`${risk}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colors.color}`}>{risk}%</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Customer Impact Forecast</span>
            <Badge className="ml-auto bg-red-100 text-red-800">High Risk Alert</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-700">Predicted Revenue Loss</h3>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{totalLoss.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-sm text-red-600">Due to stockouts in next 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600">Affected Customers</p>
                <p className="text-xl font-bold text-red-700">3,229</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {customerImpactData.map((item) => {
              const colors = getRiskColor(item.riskLevel)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: item.id * 0.1 }}
                  className={`p-4 border rounded-lg ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product}</h4>
                      <p className="text-sm opacity-75">{item.store}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs opacity-75">Risk Level</p>
                        {getRiskGauge(item.riskLevel)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs opacity-75">Affected Customers</p>
                      <p className="font-semibold">{item.affectedCustomers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Predicted Loss</p>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-3 w-3" />
                        <span className="font-semibold">{item.predictedLoss.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Time to Stockout</p>
                      <p className="font-semibold text-red-600">{item.timeToStockout}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Customer Satisfaction</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.customerSatisfaction} className="flex-1 h-2" />
                        <span className="text-sm font-semibold">{item.customerSatisfaction}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.alternativeAvailable ? (
                        <Badge className="bg-green-100 text-green-800">Alternative Available</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">No Alternative</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm opacity-75">
                      <TrendingDown className="h-4 w-4" />
                      <span>Impact increasing</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
