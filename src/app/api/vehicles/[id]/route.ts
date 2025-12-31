import { NextRequest, NextResponse } from 'next/server'
import { vehicleDatabase } from '@/lib/vehicle-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await vehicleDatabase.getVehicleDetails(params.id)

    if (!vehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kendaraan tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Error fetching vehicle details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil detail kendaraan' 
      },
      { status: 500 }
    )
  }
}