import { NextResponse } from 'next/server'
import { vehicleDatabase } from '@/lib/vehicle-service'

export async function GET() {
  try {
    const brands = await vehicleDatabase.getAllBrands()

    return NextResponse.json({
      success: true,
      data: brands
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data merek' 
      },
      { status: 500 }
    )
  }
}