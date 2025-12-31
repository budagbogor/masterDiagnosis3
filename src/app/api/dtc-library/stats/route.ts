import { NextResponse } from 'next/server'
import { dtcLibraryService } from '@/lib/dtc-library-service'

export async function GET() {
  try {
    const stats = await dtcLibraryService.getDTCStatistics()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching DTC statistics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil statistik DTC' 
      },
      { status: 500 }
    )
  }
}