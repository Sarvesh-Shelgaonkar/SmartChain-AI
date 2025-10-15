import { NextResponse } from 'next/server'
import seedDatabase from '@/scripts/seed-database'

export async function POST() {
  try {
    await seedDatabase()
    return NextResponse.json({ message: 'Database seeded successfully!' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}