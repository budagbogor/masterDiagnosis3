import { NextRequest, NextResponse } from 'next/server'
import { vehicleDatabase } from '@/lib/vehicle-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const criteria = {
      brand: searchParams.get('brand') || undefined,
      model: searchParams.get('model') || undefined,
      year: searchParams.get('year') || undefined,
      type: searchParams.get('type') || undefined,
      segment: searchParams.get('segment') || undefined,
      fuel: searchParams.get('fuel') || undefined,
      query: searchParams.get('q') || undefined,
    }

    const vehicles = await vehicleDatabase.searchVehicles(criteria)

    return NextResponse.json({
      success: true,
      data: vehicles,
      count: vehicles.length
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data kendaraan' 
      },
      { status: 500 }
    )
  }
}