import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { name, email, password, role, department } = await request.json()
    
    // Validate required fields
    if (!name || !email || !password || !department) {
      return NextResponse.json(
        { error: 'Name, email, password, and department are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
      department,
    })
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}