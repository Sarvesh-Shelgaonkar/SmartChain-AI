"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, CheckCircle, Eye, Phone, Mail, MapPin, Star, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSuppliers } from "@/hooks/useSuppliers"

export function SupplierPerformance() {
  const { suppliers, loading, error } = useSuppliers()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortField, setSortField] = useState("onTimeDelivery")
  const [sortDirection, setSortDirection] = useState("desc")

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading supplier data...</p>
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

  const filteredSuppliers = selectedCategory === "all" 
    ? suppliers 
    : suppliers.filter(supplier => supplier.category === selectedCategory)

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a]
    const bVal = b[sortField as keyof typeof b]

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal
    }
    return sortDirection === "desc" 
      ? String(bVal).localeCompare(String(aVal)) 
      : String(aVal).localeCompare(String(bVal))
  })

  const categories = [...new Set(suppliers.map(supplier => supplier.category))]

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === "desc" ? "asc" : "desc"
    setSortField(field)
    setSortDirection(direction)
  }

  const getStatusBadge = (onTimeDelivery: number) => {
    if (onTimeDelivery >= 95) return { variant: "default" as const, text: "Excellent", color: "bg-green-100 text-green-800" }
    if (onTimeDelivery >= 90) return { variant: "secondary" as const, text: "Good", color: "bg-blue-100 text-blue-800" }
    if (onTimeDelivery >= 80) return { variant: "outline" as const, text: "Average", color: "bg-orange-100 text-orange-800" }
    return { variant: "destructive" as const, text: "Poor", color: "bg-red-100 text-red-800" }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
                <p className="text-sm text-gray-500">Total Suppliers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {suppliers.filter(s => s.onTimeDelivery >= 95).length}
                </p>
                <p className="text-sm text-gray-500">Excellent Performance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {suppliers.filter(s => s.onTimeDelivery >= 90 && s.onTimeDelivery < 95).length}
                </p>
                <p className="text-sm text-gray-500">Good Performance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {suppliers.filter(s => s.onTimeDelivery < 90).length}
                </p>
                <p className="text-sm text-gray-500">Needs Improvement</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Supplier Performance Dashboard ({sortedSuppliers.length})</span>
            <Badge variant="outline" className="ml-auto">
              Live Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                    Supplier Name
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("onTimeDelivery")}>
                    On-Time Delivery %
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("avgDelay")}>
                    Avg Delay (days)
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("qualityScore")}>
                    Quality Score
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("sustainabilityScore")}>
                    Sustainability
                  </TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSuppliers.map((supplier) => {
                  const status = getStatusBadge(supplier.onTimeDelivery)
                  return (
                    <motion.tr
                      key={supplier._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{supplier.name}</p>
                          <p className="text-xs text-gray-500">{supplier.totalOrders} orders</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{supplier.onTimeDelivery}%</span>
                          <Progress value={supplier.onTimeDelivery} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={supplier.avgDelay > 4 ? "text-red-600" : "text-green-600"}>
                          {supplier.avgDelay} days
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{supplier.qualityScore}%</span>
                          <Progress value={supplier.qualityScore} className="w-12 h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{supplier.sustainabilityScore}%</span>
                          <Progress value={supplier.sustainabilityScore} className="w-12 h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.text}</Badge>
                      </TableCell>
                      <TableCell>{getTrendIcon(supplier.performance.trend)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>{supplier.name} - Detailed View</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Company Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Company Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline">{supplier.category}</Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span>{supplier.rating}/5.0 Rating</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span>{supplier.totalOrders} Total Orders</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Contact Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-blue-500" />
                                      <span>{supplier.contact.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-green-500" />
                                      <span>{supplier.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4 text-red-500" />
                                      <span>{supplier.contact.address}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Performance Metrics */}
                              <div>
                                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>On-Time Delivery</span>
                                        <span>{supplier.onTimeDelivery}%</span>
                                      </div>
                                      <Progress value={supplier.onTimeDelivery} className="h-2" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Quality Score</span>
                                        <span>{supplier.qualityScore}%</span>
                                      </div>
                                      <Progress value={supplier.qualityScore} className="h-2" />
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Cost Efficiency</span>
                                        <span>{supplier.costEfficiency}%</span>
                                      </div>
                                      <Progress value={supplier.costEfficiency} className="h-2" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Sustainability</span>
                                        <span>{supplier.sustainabilityScore}%</span>
                                      </div>
                                      <Progress value={supplier.sustainabilityScore} className="h-2" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-600">{supplier.avgDelay}</p>
                                  <p className="text-sm text-gray-500">Avg Delay (days)</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    {getTrendIcon(supplier.performance.trend)}
                                    <p className="text-2xl font-bold text-green-600">{supplier.performance.lastMonth}%</p>
                                  </div>
                                  <p className="text-sm text-gray-500">Last Month Performance</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}