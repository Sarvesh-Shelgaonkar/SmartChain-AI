"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, MapPin, TrendingUp, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const storeData = [
  {
    id: 1,
    name: "Mumbai Central Mall",
    region: "Maharashtra",
    city: "Mumbai",
    rank: 1,
    score: 98.5,
    accuracy: 99.2,
    costSavings: 245000,
    aiUsage: 96.8,
    customerSatisfaction: 97.5,
    trend: "up",
    manager: "Rajesh Sharma",
  },
  {
    id: 2,
    name: "Pune Tech Plaza",
    region: "Maharashtra",
    city: "Pune",
    rank: 2,
    score: 96.8,
    accuracy: 97.8,
    costSavings: 198000,
    aiUsage: 94.2,
    customerSatisfaction: 96.1,
    trend: "up",
    manager: "Priya Patel",
  },
  {
    id: 3,
    name: "Bangalore Innovation Hub",
    region: "Karnataka",
    city: "Bangalore",
    rank: 3,
    score: 95.2,
    accuracy: 96.5,
    costSavings: 187000,
    aiUsage: 92.7,
    customerSatisfaction: 95.8,
    trend: "stable",
    manager: "Arjun Kumar",
  },
  {
    id: 4,
    name: "Delhi Metro Store",
    region: "Delhi",
    city: "New Delhi",
    rank: 4,
    score: 94.1,
    accuracy: 95.3,
    costSavings: 176000,
    aiUsage: 91.4,
    customerSatisfaction: 94.2,
    trend: "up",
    manager: "Sunita Singh",
  },
  {
    id: 5,
    name: "Hyderabad Tech City",
    region: "Telangana",
    city: "Hyderabad",
    rank: 5,
    score: 92.7,
    accuracy: 94.1,
    costSavings: 165000,
    aiUsage: 89.8,
    customerSatisfaction: 93.5,
    trend: "down",
    manager: "Vikram Reddy",
  },
  {
    id: 6,
    name: "Jalgaon Central",
    region: "Maharashtra",
    city: "Jalgaon",
    rank: 6,
    score: 91.3,
    accuracy: 92.8,
    costSavings: 142000,
    aiUsage: 87.5,
    customerSatisfaction: 92.1,
    trend: "up",
    manager: "Amit Desai",
  },
  {
    id: 7,
    name: "Kolhapur Store",
    region: "Maharashtra",
    city: "Kolhapur",
    rank: 7,
    score: 89.6,
    accuracy: 91.2,
    costSavings: 134000,
    aiUsage: 85.3,
    customerSatisfaction: 90.8,
    trend: "stable",
    manager: "Meera Kulkarni",
  },
  {
    id: 8,
    name: "Nashik Mall",
    region: "Maharashtra",
    city: "Nashik",
    rank: 8,
    score: 88.4,
    accuracy: 89.7,
    costSavings: 128000,
    aiUsage: 83.9,
    customerSatisfaction: 89.2,
    trend: "up",
    manager: "Ravi Joshi",
  },
]

export function EfficiencyLeaderboard() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [sortBy, setSortBy] = useState("score")
  const [filteredStores, setFilteredStores] = useState(storeData)

  const regions = ["all", "Maharashtra", "Karnataka", "Delhi", "Telangana"]

  const handleFilter = (region: string, sort: string) => {
    let filtered = region === "all" ? storeData : storeData.filter((store) => store.region === region)

    filtered = filtered.sort((a, b) => {
      switch (sort) {
        case "accuracy":
          return b.accuracy - a.accuracy
        case "costSavings":
          return b.costSavings - a.costSavings
        case "aiUsage":
          return b.aiUsage - a.aiUsage
        case "customerSatisfaction":
          return b.customerSatisfaction - a.customerSatisfaction
        default:
          return b.score - a.score
      }
    })

    setFilteredStores(filtered)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        )
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600"
    if (score >= 90) return "text-blue-600"
    if (score >= 85) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Store Efficiency Leaderboard</span>
              <Badge className="ml-2 bg-yellow-100 text-yellow-800">247 Stores</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedRegion}
                onValueChange={(value) => {
                  setSelectedRegion(value)
                  handleFilter(value, sortBy)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value)
                  handleFilter(selectedRegion, value)
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Overall Score</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="costSavings">Cost Savings</SelectItem>
                  <SelectItem value="aiUsage">AI Usage</SelectItem>
                  <SelectItem value="customerSatisfaction">Customer Satisfaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStores.slice(0, 8).map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                  store.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    {getRankIcon(store.rank)}
                    <div>
                      <h4 className="font-semibold">{store.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {store.city}, {store.region}
                        </span>
                        <span>•</span>
                        <span>Manager: {store.manager}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(store.score)}`}>{store.score}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">Score</span>
                      </div>
                    </div>
                    {getTrendIcon(store.trend)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={store.accuracy} className="flex-1 h-2" />
                      <span className="text-sm font-semibold">{store.accuracy}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cost Savings</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold">₹{(store.costSavings / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">AI Usage</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={store.aiUsage} className="flex-1 h-2" />
                      <span className="text-sm font-semibold">{store.aiUsage}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer Satisfaction</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={store.customerSatisfaction} className="flex-1 h-2" />
                      <span className="text-sm font-semibold">{store.customerSatisfaction}%</span>
                    </div>
                  </div>
                </div>

                {store.rank <= 3 && (
                  <div className="mt-3 flex items-center justify-between">
                    <Badge
                      className={
                        store.rank === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : store.rank === 2
                            ? "bg-gray-100 text-gray-800"
                            : "bg-orange-100 text-orange-800"
                      }
                    >
                      {store.rank === 1 ? "🏆 Champion" : store.rank === 2 ? "🥈 Runner-up" : "🥉 Third Place"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">Regional Performance Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-blue-600">Maharashtra</p>
                <p>Avg Score: 93.2</p>
                <p className="text-xs text-gray-500">5 stores</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">Karnataka</p>
                <p>Avg Score: 91.8</p>
                <p className="text-xs text-gray-500">1 store</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-purple-600">Delhi</p>
                <p>Avg Score: 89.4</p>
                <p className="text-xs text-gray-500">1 store</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-orange-600">Telangana</p>
                <p>Avg Score: 87.6</p>
                <p className="text-xs text-gray-500">1 store</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
