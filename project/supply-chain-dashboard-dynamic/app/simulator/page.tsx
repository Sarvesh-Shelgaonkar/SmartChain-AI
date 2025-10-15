"use client"

import { ArrowLeft, Zap, TrendingUp, AlertTriangle, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScenarioSimulator } from "@/components/scenario-simulator"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

export default function SimulatorPage() {
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
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Supply Chain Scenario Simulator</h1>
                  <p className="text-gray-600">AI-Powered Impact Analysis & Predictions</p>
                </div>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered
            </Badge>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Scenarios Available</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Accuracy Rate</p>
                    <p className="text-2xl font-bold">94.2%</p>
                  </div>
                  <Brain className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Simulations Run</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 rounded-full p-1">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">How It Works</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Select a scenario, adjust impact intensity and duration, then run the simulation. 
                  Our AI analyzes historical data and current trends to predict impacts on inventory, 
                  deliveries, costs, and customer satisfaction. Get actionable recommendations to mitigate risks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Simulator Component */}
        <ScenarioSimulator />
      </div>
    </ProtectedRoute>
  )
}