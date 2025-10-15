import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Supplier from '@/lib/models/Supplier'

export async function GET() {
  try {
    await dbConnect()
    const suppliers = await Supplier.find({}).sort({ name: 1 })
    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch supplier data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const supplier = await Supplier.create(body)
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const supplier = await Supplier.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )
    
    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    )
  }
}