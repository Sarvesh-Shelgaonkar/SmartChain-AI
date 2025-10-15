"use client"

import { useState, useEffect } from "react"
import { Bell, Package, Truck, TrendingUp, AlertTriangle, IndianRupee, Zap, Brain, Globe, BarChart3, FileText, Settings, LogOut, Users, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useInventory } from "@/hooks/useInventory"
import { useDeliveries } from "@/hooks/useDeliveries"
import { MovableAIChat } from "@/components/movable-ai-chat"
import Link from "next/link"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [totalSavings, setTotalSavings] = useState(2847500)
  const [activeAlerts, setActiveAlerts] = useState(7)
  
  const { user, logout, hasPermission } = useAuth()
  const { inventory, loading: inventoryLoading } = useInventory()
  const { deliveries, loading: deliveriesLoading } = useDeliveries()

  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setTotalSavings((prev) => prev + Math.floor(Math.random() * 1000))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const getStockStatus = (current: number, optimal: number) => {
    const percentage = (current / optimal) * 100
    if (percentage < 30) return { status: "critical", color: "bg-red-500", text: "Critical" }
    if (percentage < 60) return { status: "low", color: "bg-orange-500", text: "Low Stock" }
    if (percentage > 120) return { status: "excess", color: "bg-blue-500", text: "Excess" }
    return { status: "optimal", color: "bg-green-500", text: "Optimal" }
  }

  // Calculate stats from dynamic data
  const criticalItems = inventory.filter(item => (item.current / item.optimal) * 100 < 30).length
  const activeDeliveries = deliveries.filter(delivery => delivery.status === 'in-transit').length

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SmartChain AI</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Live Savings Today</p>
                <p className="text-2xl font-bold text-green-600 flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {totalSavings.toLocaleString("en-IN")}
                </p>
              </div>
              <Button variant="outline" className="relative bg-white text-gray-700">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{activeAlerts}</Badge>
              </Button>
              <ThemeToggle />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="outline" className="w-fit">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission('view_analytics') && (
                    <DropdownMenuItem asChild>
                      <Link href="/simulator">
                        <Activity className="mr-2 h-4 w-4" />
                        Scenario Simulator
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Stores</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                  <Globe className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Live Deliveries</p>
                    <p className="text-2xl font-bold">{activeDeliveries}</p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Critical Items</p>
                    <p className="text-2xl font-bold">{criticalItems}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Efficiency Score</p>
                    <p className="text-2xl font-bold">94.2%</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <Link href="/inventory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Inventory</h3>
                <p className="text-sm text-gray-500">{inventory.length} items</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/deliveries">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Deliveries</h3>
                <p className="text-sm text-gray-500">{deliveries.length} active</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/suppliers">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Suppliers</h3>
                <p className="text-sm text-gray-500">Performance</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/reorder">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-semibold">Reorder</h3>
                <p className="text-sm text-gray-500">Recommendations</p>
              </CardContent>
            </Card>
          </Link>

          {hasPermission('view_analytics') && (
            <Link href="/analytics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-gray-500">Reports & Insights</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {hasPermission('view_analytics') && (
            <Link href="/reports">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold">Reports</h3>
                  <p className="text-sm text-gray-500">Documents</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {hasPermission('view_analytics') && (
            <Link href="/simulator">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Simulator</h3>
                  <p className="text-sm text-gray-500">Scenarios</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {hasPermission('manage_users') && (
            <Link href="/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                  <h3 className="font-semibold">Users</h3>
                  <p className="text-sm text-gray-500">Management</p>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Recent Inventory Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Inventory Updates</span>
              <Link href="/inventory">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <div className="text-center py-4">Loading inventory data...</div>
            ) : (
              <div className="space-y-4">
                {inventory.slice(0, 5).map((item) => {
                  const stockStatus = getStockStatus(item.current, item.optimal)
                  const percentage = (item.current / item.optimal) * 100

                  return (
                    <div key={item._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                          <div>
                            <h4 className="font-semibold">{item.product}</h4>
                            <p className="text-sm text-gray-500">{item.store}</p>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access to AI Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-6 w-6" />
                <span>Scenario Simulator</span>
                <Badge className="ml-auto bg-white/20 text-white">AI-Powered</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 mb-4">
                Simulate supply chain scenarios and analyze their impact with AI predictions.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-purple-100">
                  <p>- 5 Scenario Types</p>
                  <p>- Real-time Impact Analysis</p>
                  <p>- AI Recommendations</p>
                </div>
                <Link href="/simulator">
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Zap className="h-4 w-4 mr-2" />
                    Launch Simulator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6" />
                <span>AI Assistant</span>
                <Badge className="ml-auto bg-white/20 text-white">Live Chat</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-4">
                Get instant answers about your supply chain operations and data insights.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-100">
                  <p>- Real-time Data Queries</p>
                  <p>- Smart Recommendations</p>
                  <p>- 24/7 Availability</p>
                </div>
                <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  <Brain className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movable AI Chat */}
        <MovableAIChat />

        {/* Live Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-blue-500 text-white p-2">
          <div className="container mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <span>Last Updated: {currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>247 Stores Connected</span>
              <span>{activeDeliveries} Deliveries Active</span>
              <span>AI Processing: 1.2k predictions/min</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}