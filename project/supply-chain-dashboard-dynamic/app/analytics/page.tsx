"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Activity, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    revenue: 4523100,
    costSavings: 847500,
    efficiencyScore: 94.2,
    ordersProcessed: 2847,
    isLoading: false
  })
  const [performanceData, setPerformanceData] = useState({
    onTimeDelivery: 94.2,
    avgDeliveryTime: 2.3,
    customerSatisfaction: 4.7,
    stockTurnover: 8.5,
    stockoutIncidents: 3,
    excessStockValue: 234500,
    avgLeadTime: 3.2,
    qualityScore: 96.8,
    costVariance: -2.1
  })
  const [forecastData, setForecastData] = useState({
    next7Days: { increase: 15, confidence: 94.2 },
    next30Days: { increase: 28, confidence: 87.5 },
    alerts: [
      { type: 'stock', message: 'Parachute Oil will run out in 3 days', severity: 'high' },
      { type: 'demand', message: 'Umbrella demand expected +300%', severity: 'medium' }
    ]
  })

  const refreshAnalytics = async () => {
    setAnalyticsData(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(prev => ({
        ...prev,
        revenue: prev.revenue + Math.floor(Math.random() * 50000),
        costSavings: prev.costSavings + Math.floor(Math.random() * 10000),
        efficiencyScore: Math.min(100, prev.efficiencyScore + Math.random() * 2),
        ordersProcessed: prev.ordersProcessed + Math.floor(Math.random() * 100),
        isLoading: false
      }))
    }, 1500)
  }

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshAnalytics()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ProtectedRoute requiredPermission="view_analytics">
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
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              </div>
            </div>
            <Button 
              onClick={refreshAnalytics} 
              disabled={analyticsData.isLoading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${analyticsData.isLoading ? 'animate-spin' : ''}`} />
              {analyticsData.isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs.{analyticsData.revenue.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  <div className="mt-2">
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs.{analyticsData.costSavings.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                  <div className="mt-2">
                    <Progress value={68} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.efficiencyScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                  <div className="mt-2">
                    <Progress value={analyticsData.efficiencyScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Processed</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.ordersProcessed.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  <div className="mt-2">
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">January</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.38,50,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">February</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '70%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.41,20,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">March</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '73%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.43,50,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">April</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '72%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.42,80,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">May</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.44,50,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-weight-bold">June</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{width: '76%'}}></div>
                        </div>
                        <span className="text-sm font-bold text-green-600">Rs.45,23,100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Personal Care</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.12,34,500</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Food & Beverages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.10,87,200</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Household Items</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full" style={{width: '62%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.8,95,400</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Grocery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-orange-500 rounded-full" style={{width: '52%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.7,56,800</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Dairy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-red-500 rounded-full" style={{width: '38%'}}></div>
                        </div>
                        <span className="text-sm font-medium">Rs.5,49,200</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">On-Time Delivery Rate</span>
                        <span className="font-bold text-green-600">{performanceData.onTimeDelivery}%</span>
                      </div>
                      <Progress value={performanceData.onTimeDelivery} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Delivery Time</span>
                        <span className="font-bold">{performanceData.avgDeliveryTime} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-bold text-blue-600">{performanceData.customerSatisfaction}/5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inventory Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stock Turnover Rate</span>
                        <span className="font-bold text-purple-600">{performanceData.stockTurnover}x</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stockout Incidents</span>
                        <span className="font-bold text-red-600">{performanceData.stockoutIncidents} this month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Excess Stock Value</span>
                        <span className="font-bold">Rs.{performanceData.excessStockValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supplier Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Lead Time</span>
                        <span className="font-bold">{performanceData.avgLeadTime} days</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quality Score</span>
                        <span className="font-bold text-green-600">{performanceData.qualityScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cost Variance</span>
                        <span className="font-bold text-blue-600">{performanceData.costVariance}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Demand Trends by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Personal Care</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{width: '85%'}}></div>
                          </div>
                          <span className="text-sm font-bold text-green-600">+18.5%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Food & Beverages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">+22.3%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Household Items</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full" style={{width: '62%'}}></div>
                          </div>
                          <span className="text-sm font-bold text-purple-600">+15.7%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Monsoon Season</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Umbrella sales +340%, Rainwear +280%
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800">Festival Season</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Sweets +450%, Decorative items +320%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecasting">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Demand Forecasting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Next 7 Days</h4>
                        <p className="text-sm text-green-700">Expected demand increase: +{forecastData.next7Days.increase}%</p>
                        <p className="text-xs text-green-600">Confidence: {forecastData.next7Days.confidence}%</p>
                        <div className="mt-2">
                          <Progress value={forecastData.next7Days.confidence} className="h-1.5" />
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Next 30 Days</h4>
                        <p className="text-sm text-blue-700">Seasonal adjustment: +{forecastData.next30Days.increase}%</p>
                        <p className="text-xs text-blue-600">Confidence: {forecastData.next30Days.confidence}%</p>
                        <div className="mt-2">
                          <Progress value={forecastData.next30Days.confidence} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Predictive Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {forecastData.alerts.map((alert, index) => (
                        <div 
                          key={index} 
                          className={`p-2 ${
                            alert.severity === 'high' 
                              ? 'bg-red-50 border border-red-200' 
                              : 'bg-orange-50 border border-orange-200'
                          } rounded`}
                        >
                          <div className="flex justify-between items-center">
                            <p className={`text-sm font-medium ${
                              alert.severity === 'high' ? 'text-red-800' : 'text-orange-800'
                            }`}>
                              {alert.type === 'stock' ? 'Stock Alert' : 'Demand Spike'}
                            </p>
                            <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className={`text-xs ${
                            alert.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {alert.message}
                          </p>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => {
                          setForecastData(prev => ({
                            ...prev,
                            alerts: [
                              ...prev.alerts,
                              { 
                                type: Math.random() > 0.5 ? 'stock' : 'demand', 
                                message: 'New forecast alert detected', 
                                severity: Math.random() > 0.5 ? 'high' : 'medium'
                              }
                            ]
                          }))
                        }}
                      >
                        Generate New Forecast
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}