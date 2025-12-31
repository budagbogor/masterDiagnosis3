import { NextRequest, NextResponse } from 'next/server'
import { vehicleDatabase } from '@/lib/vehicle-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')

    if (!brand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parameter brand diperlukan' 
        },
        { status: 400 }
      )
    }

    const models = await vehicleDatabase.getModelsByBrand(brand)

    return NextResponse.json({
      success: true,
      data: models
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data model' 
      },
      { status: 500 }
    )
  }
}