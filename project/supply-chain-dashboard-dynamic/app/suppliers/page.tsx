"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SupplierPerformance } from "@/components/supplier-performance"
import Link from "next/link"

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Performance</h1>
        </div>
      </div>

      <SupplierPerformance />
    </div>
  )
}