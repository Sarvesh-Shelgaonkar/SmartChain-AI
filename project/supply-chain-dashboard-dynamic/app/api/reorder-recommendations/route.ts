import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ReorderRecommendation from '@/lib/models/ReorderRecommendation'

export async function GET() {
  try {
    await dbConnect()
    const recommendations = await ReorderRecommendation.find({})
      .sort({ priority: 1, daysLeft: 1 })
    return NextResponse.json(recommendations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reorder recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const recommendation = await ReorderRecommendation.create(body)
    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create reorder recommendation' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const recommendation = await ReorderRecommendation.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )
    
    if (!recommendation) {
      return NextResponse.json(
        { error: 'Reorder recommendation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(recommendation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reorder recommendation' },
      { status: 500 }
    )
  }
}