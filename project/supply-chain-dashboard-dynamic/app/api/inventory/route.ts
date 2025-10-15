import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Inventory from '@/lib/models/Inventory'

export async function GET() {
  try {
    await dbConnect()
    const inventory = await Inventory.find({}).sort({ lastUpdated: -1 })
    return NextResponse.json(inventory)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const inventory = await Inventory.create(body)
    return NextResponse.json(inventory, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const inventory = await Inventory.findByIdAndUpdate(
      _id,
      { ...updateData, lastUpdated: new Date() },
      { new: true }
    )
    
    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(inventory)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    )
  }
}