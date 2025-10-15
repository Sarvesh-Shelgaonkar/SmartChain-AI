import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Delivery from '@/lib/models/Delivery'

export async function GET() {
  try {
    await dbConnect()
    const deliveries = await Delivery.find({}).sort({ createdAt: -1 })
    return NextResponse.json(deliveries)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch delivery data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const delivery = await Delivery.create(body)
    return NextResponse.json(delivery, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create delivery' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const delivery = await Delivery.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )
    
    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(delivery)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update delivery' },
      { status: 500 }
    )
  }
}