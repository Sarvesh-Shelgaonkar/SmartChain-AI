import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SustainabilityMetric from '@/lib/models/SustainabilityMetric'

export async function GET() {
  try {
    await dbConnect()
    const metrics = await SustainabilityMetric.find({})
      .sort({ category: 1, metric: 1 })
    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sustainability metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const metric = await SustainabilityMetric.create(body)
    return NextResponse.json(metric, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create sustainability metric' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const metric = await SustainabilityMetric.findByIdAndUpdate(
      _id,
      { ...updateData, lastCalculated: new Date() },
      { new: true }
    )
    
    if (!metric) {
      return NextResponse.json(
        { error: 'Sustainability metric not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(metric)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update sustainability metric' },
      { status: 500 }
    )
  }
}