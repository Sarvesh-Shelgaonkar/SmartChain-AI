"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Cloud, Truck, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimulationResult {
  scenario: string
  impact: {
    inventory: number
    deliveries: number
    costs: number
    customerSatisfaction: number
  }
  recommendations: string[]
  timeToRecover: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const scenarios = [
  {
    id: 'monsoon',
    name: 'Monsoon Season Impact',
    description: 'Heavy rainfall affecting transportation and demand patterns',
    icon: Cloud,
    color: 'text-blue-600'
  },
  {
    id: 'supplier_disruption',
    name: 'Major Supplier Disruption',
    description: 'Key supplier facing production issues',
    icon: Package,
    color: 'text-red-600'
  },
  {
    id: 'demand_surge',
    name: 'Festival Demand Surge',
    description: 'Unexpected high demand during festival season',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    id: 'route_blockage',
    name: 'Major Route Blockage',
    description: 'Highway closure affecting multiple delivery routes',
    icon: Truck,
    color: 'text-orange-600'
  },
  {
    id: 'cyber_attack',
    name: 'Cyber Security Incident',
    description: 'System outage affecting operations',
    icon: Zap,
    color: 'text-purple-600'
  }
]

export function ScenarioSimulator() {
  const [selectedScenario, setSelectedScenario] = useState('')
  const [intensity, setIntensity] = useState([50])
  const [duration, setDuration] = useState([7])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)

  const runSimulation = () => {
    if (!selectedScenario) return

    setIsSimulating(true)
    
    // Simulate processing time
    setTimeout(() => {
      const result = generateSimulationResult(selectedScenario, intensity[0], duration[0])
      setSimulationResult(result)
      setIsSimulating(false)
    }, 3000)
  }

  const generateSimulationResult = (scenario: string, intensityValue: number, durationValue: number): SimulationResult => {
    const baseImpact = intensityValue / 100
    const durationMultiplier = durationValue / 7

    switch (scenario) {
      case 'monsoon':
        return {
          scenario: 'Monsoon Season Impact',
          impact: {
            inventory: Math.round(-15 * baseImpact * durationMultiplier),
            deliveries: Math.round(-25 * baseImpact * durationMultiplier),
            costs: Math.round(20 * baseImpact * durationMultiplier),
            customerSatisfaction: Math.round(-18 * baseImpact * durationMultiplier)
          },
          recommendations: [
            'Increase umbrella and rainwear inventory by 300%',
            'Activate backup transportation routes',
            'Pre-position inventory in affected regions',
            'Implement weather-based demand forecasting'
          ],
          timeToRecover: `${Math.round(14 * durationMultiplier)} days`,
          severity: intensityValue > 75 ? 'critical' : intensityValue > 50 ? 'high' : 'medium'
        }

      case 'supplier_disruption':
        return {
          scenario: 'Major Supplier Disruption',
          impact: {
            inventory: Math.round(-30 * baseImpact * durationMultiplier),
            deliveries: Math.round(-20 * baseImpact * durationMultiplier),
            costs: Math.round(35 * baseImpact * durationMultiplier),
            customerSatisfaction: Math.round(-25 * baseImpact * durationMultiplier)
          },
          recommendations: [
            'Activate secondary suppliers immediately',
            'Implement product substitution strategies',
            'Increase safety stock for critical items',
            'Diversify supplier base to reduce dependency'
          ],
          timeToRecover: `${Math.round(21 * durationMultiplier)} days`,
          severity: intensityValue > 70 ? 'critical' : intensityValue > 45 ? 'high' : 'medium'
        }

      case 'demand_surge':
        return {
          scenario: 'Festival Demand Surge',
          impact: {
            inventory: Math.round(-40 * baseImpact * durationMultiplier),
            deliveries: Math.round(15 * baseImpact * durationMultiplier),
            costs: Math.round(-10 * baseImpact * durationMultiplier),
            customerSatisfaction: Math.round(20 * baseImpact * durationMultiplier)
          },
          recommendations: [
            'Emergency procurement from all suppliers',
            'Implement dynamic pricing strategies',
            'Increase delivery capacity by 50%',
            'Activate seasonal workforce'
          ],
          timeToRecover: `${Math.round(10 * durationMultiplier)} days`,
          severity: intensityValue > 80 ? 'high' : intensityValue > 60 ? 'medium' : 'low'
        }

      case 'route_blockage':
        return {
          scenario: 'Major Route Blockage',
          impact: {
            inventory: Math.round(-10 * baseImpact * durationMultiplier),
            deliveries: Math.round(-35 * baseImpact * durationMultiplier),
            costs: Math.round(25 * baseImpact * durationMultiplier),
            customerSatisfaction: Math.round(-20 * baseImpact * durationMultiplier)
          },
          recommendations: [
            'Activate alternative transportation routes',
            'Use air freight for critical deliveries',
            'Implement local sourcing strategies',
            'Communicate delays to customers proactively'
          ],
          timeToRecover: `${Math.round(7 * durationMultiplier)} days`,
          severity: intensityValue > 75 ? 'high' : intensityValue > 50 ? 'medium' : 'low'
        }

      case 'cyber_attack':
        return {
          scenario: 'Cyber Security Incident',
          impact: {
            inventory: Math.round(-20 * baseImpact * durationMultiplier),
            deliveries: Math.round(-30 * baseImpact * durationMultiplier),
            costs: Math.round(40 * baseImpact * durationMultiplier),
            customerSatisfaction: Math.round(-30 * baseImpact * durationMultiplier)
          },
          recommendations: [
            'Activate manual backup systems',
            'Implement emergency communication protocols',
            'Engage cybersecurity incident response team',
            'Prioritize critical operations restoration'
          ],
          timeToRecover: `${Math.round(5 * durationMultiplier)} days`,
          severity: intensityValue > 60 ? 'critical' : intensityValue > 40 ? 'high' : 'medium'
        }

      default:
        return {
          scenario: 'Unknown Scenario',
          impact: { inventory: 0, deliveries: 0, costs: 0, customerSatisfaction: 0 },
          recommendations: [],
          timeToRecover: '0 days',
          severity: 'low'
        }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
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
            <Zap className="h-5 w-5 text-purple-500" />
            <span>Supply Chain Scenario Simulator</span>
            <Badge className="ml-auto bg-purple-100 text-purple-800">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <motion.div
                  key={scenario.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScenario === scenario.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${scenario.color}`} />
                    <div>
                      <h3 className="font-semibold text-sm">{scenario.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Parameters */}
          {selectedScenario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 border-t pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Impact Intensity: {intensity[0]}%
                  </label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration: {duration[0]} days
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSimulating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSimulationResult(null)
                    setSelectedScenario('')
                    setIntensity([50])
                    setDuration([7])
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {simulationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Simulation Results</h3>
                <Badge className={getSeverityColor(simulationResult.severity)}>
                  {simulationResult.severity.toUpperCase()} IMPACT
                </Badge>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {getImpactIcon(simulationResult.impact.inventory)}
                    <span className="text-sm font-medium">Inventory</span>
                  </div>
                  <p className={`text-lg font-bold ${
                    simulationResult.impact.inventory > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {simulationResult.impact.inventory > 0 ? '+' : ''}{simulationResult.impact.inventory}%
                  </p>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {getImpactIcon(simulationResult.impact.deliveries)}
                    <span className="text-sm font-medium">Deliveries</span>
                  </div>
                  <p className={`text-lg font-bold ${
                    simulationResult.impact.deliveries > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {simulationResult.impact.deliveries > 0 ? '+' : ''}{simulationResult.impact.deliveries}%
                  </p>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {getImpactIcon(-simulationResult.impact.costs)}
                    <span className="text-sm font-medium">Costs</span>
                  </div>
                  <p className={`text-lg font-bold ${
                    simulationResult.impact.costs > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {simulationResult.impact.costs > 0 ? '+' : ''}{simulationResult.impact.costs}%
                  </p>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {getImpactIcon(simulationResult.impact.customerSatisfaction)}
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                  </div>
                  <p className={`text-lg font-bold ${
                    simulationResult.impact.customerSatisfaction > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {simulationResult.impact.customerSatisfaction > 0 ? '+' : ''}{simulationResult.impact.customerSatisfaction}%
                  </p>
                </div>
              </div>

              {/* Recovery Time */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Estimated Recovery Time:</strong> {simulationResult.timeToRecover}
                </AlertDescription>
              </Alert>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Recommended Actions</span>
                </h4>
                <div className="space-y-2">
                  {simulationResult.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-green-800">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}