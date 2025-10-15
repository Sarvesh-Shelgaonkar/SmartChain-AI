"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Star, Package, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const substitutionData = [
  {
    id: 1,
    outOfStock: {
      name: "Parachute Coconut Oil 500ml",
      sku: "PCO-500ML",
      store: "Jalgaon Central",
    },
    alternatives: [
      {
        name: "Parachute Coconut Oil 200ml",
        sku: "PCO-200ML",
        confidence: 95,
        availability: 156,
        priceMatch: 92,
        customerPreference: 88,
        reason: "Same brand, smaller size",
      },
      {
        name: "Coconut Oil - Patanjali 500ml",
        sku: "PNJ-CO-500",
        confidence: 78,
        availability: 89,
        priceMatch: 85,
        customerPreference: 72,
        reason: "Similar product, different brand",
      },
      {
        name: "KLF Coconad Coconut Oil 500ml",
        sku: "KLF-CO-500",
        confidence: 71,
        availability: 67,
        priceMatch: 88,
        customerPreference: 69,
        reason: "Premium alternative",
      },
    ],
  },
  {
    id: 2,
    outOfStock: {
      name: "Surf Excel 1kg",
      sku: "SE-1KG",
      store: "Kolhapur Store",
    },
    alternatives: [
      {
        name: "Surf Excel 500g (2 packs)",
        sku: "SE-500G",
        confidence: 92,
        availability: 234,
        priceMatch: 96,
        customerPreference: 91,
        reason: "Same brand, equivalent quantity",
      },
      {
        name: "Ariel Complete 1kg",
        sku: "AR-1KG",
        confidence: 84,
        availability: 123,
        priceMatch: 89,
        customerPreference: 76,
        reason: "Competitor product, similar quality",
      },
      {
        name: "Tide Plus 1kg",
        sku: "TD-1KG",
        confidence: 79,
        availability: 98,
        priceMatch: 91,
        customerPreference: 73,
        reason: "Popular alternative brand",
      },
    ],
  },
]

export function ProductSubstitution() {
  const [selectedSubstitutions, setSelectedSubstitutions] = useState<{ [key: number]: number }>({})
  const [appliedSubstitutions, setAppliedSubstitutions] = useState<number[]>([])
  const [isApplying, setIsApplying] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectAlternative = (substitutionId: number, alternativeIndex: number) => {
    setSelectedSubstitutions({
      ...selectedSubstitutions,
      [substitutionId]: alternativeIndex,
    })
  }

  const handleApplySubstitution = async (substitution: any) => {
    const selectedIndex = selectedSubstitutions[substitution.id]
    if (selectedIndex !== undefined) {
      setIsApplying(true)
      
      // Get the selected alternative
      const selectedAlternative = substitution.alternatives[selectedIndex]
      
      // In a real app, we would make an API call here
      // Since we're simulating, we'll just update the local state directly
      
      // Update local state after a short delay to simulate API call
      setTimeout(() => {
        // Add to applied substitutions
        setAppliedSubstitutions(prev => [...prev, substitution.id])
        
        // Trigger refresh of the component
        setRefreshKey(prev => prev + 1)
        
        // Show success notification
        alert(`Successfully substituted ${substitution.outOfStock.name} with ${selectedAlternative.name}`)
        
        // Close dialog if open
        const dialogElement = document.querySelector('[role="dialog"]')
        if (dialogElement) {
          const closeButton = dialogElement.querySelector('button[aria-label="Close"]')
          if (closeButton) {
            (closeButton as HTMLButtonElement).click()
          }
        }
        
        // Reset loading state
        setIsApplying(false)
      }, 1000)
    }
  }

  const handleNotifyCustomers = async (substitution: any) => {
    try {
      const response = await fetch('/api/notifications/substitution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: substitution.outOfStock.name,
          store: substitution.outOfStock.store,
          message: `${substitution.outOfStock.name} is temporarily out of stock. We have suitable alternatives available.`
        }),
      })

      if (response.ok) {
        alert(`Notification sent to customers about ${substitution.outOfStock.name} substitution!`)
      } else {
        throw new Error('Failed to send notification')
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
      alert('Failed to send notification. Please try again.')
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-blue-600"
    if (confidence >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-purple-500" />
            <span>Smart Product Substitution</span>
            <Badge className="ml-auto bg-green-100 text-green-800">AI Recommendations</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {substitutionData.map((substitution) => (
              <motion.div
                key={substitution.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: substitution.id * 0.1 }}
                className="border rounded-lg p-4 bg-red-50 border-red-200"
              >
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-700">Out of Stock</span>
                  </div>
                  <h4 className="font-semibold">{substitution.outOfStock.name}</h4>
                  <p className="text-sm text-gray-600">
                    {substitution.outOfStock.store} • SKU: {substitution.outOfStock.sku}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-700">Recommended Alternatives:</h5>
                  {substitution.alternatives.map((alternative, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedSubstitutions[substitution.id] === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => handleSelectAlternative(substitution.id, index)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h6 className="font-semibold">{alternative.name}</h6>
                          <p className="text-sm text-gray-500">SKU: {alternative.sku}</p>
                          <p className="text-xs text-gray-600 mt-1">{alternative.reason}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getConfidenceColor(alternative.confidence)}`}>
                            {alternative.confidence}%
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">Confidence</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Availability</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={(alternative.availability / 200) * 100} className="flex-1 h-1" />
                            <span className="font-semibold">{alternative.availability}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price Match</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={alternative.priceMatch} className="flex-1 h-1" />
                            <span className="font-semibold">{alternative.priceMatch}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Customer Preference</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={alternative.customerPreference} className="flex-1 h-1" />
                            <span className="font-semibold">{alternative.customerPreference}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  {appliedSubstitutions.includes(substitution.id) ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Substitution Applied</span>
                    </div>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            disabled={selectedSubstitutions[substitution.id] === undefined || isApplying}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isApplying ? 'animate-spin' : ''}`} />
                            {isApplying ? 'Applying...' : 'Apply Substitution'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-blue-500" />
                              <span>Confirm Product Substitution</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Alert className="border-blue-200 bg-blue-50">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800">
                                You are about to apply a product substitution. This will update inventory and notify relevant teams.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-2">Out of Stock</h4>
                                <p className="text-sm font-medium">{substitution.outOfStock.name}</p>
                                <p className="text-xs text-gray-600">SKU: {substitution.outOfStock.sku}</p>
                                <p className="text-xs text-gray-600">Store: {substitution.outOfStock.store}</p>
                              </div>
                              
                              {selectedSubstitutions[substitution.id] !== undefined && (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                  <h4 className="font-semibold text-green-800 mb-2">Substitute With</h4>
                                  <p className="text-sm font-medium">
                                    {substitution.alternatives[selectedSubstitutions[substitution.id]].name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    SKU: {substitution.alternatives[selectedSubstitutions[substitution.id]].sku}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Available: {substitution.alternatives[selectedSubstitutions[substitution.id]].availability} units
                                  </p>
                                  <div className="mt-2">
                                    <Badge className="bg-green-100 text-green-800">
                                      {substitution.alternatives[selectedSubstitutions[substitution.id]].confidence}% Confidence
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleApplySubstitution(substitution)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Substitution
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline"
                        onClick={() => handleNotifyCustomers(substitution)}
                      >
                        Notify Customers
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
