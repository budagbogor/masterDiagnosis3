import { NextRequest, NextResponse } from 'next/server'
import { dtcLibrary } from '@/lib/dtc-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const dtcDetails = await dtcLibrary.getDTCDetails(params.code.toUpperCase())

    if (!dtcDetails) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kode DTC tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: dtcDetails
    })
  } catch (error) {
    console.error('Error fetching DTC details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil detail kode DTC' 
      },
      { status: 500 }
    )
  }
}