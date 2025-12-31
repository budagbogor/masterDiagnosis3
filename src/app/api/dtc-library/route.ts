import { NextRequest, NextResponse } from 'next/server'
import { dtcLibraryService } from '@/lib/dtc-library-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const system = searchParams.get('system')
    const search = searchParams.get('search')
    
    if (search) {
      // Cari DTC berdasarkan kode atau teks
      const dtcCodes = await dtcLibraryService.searchDTCCodes(search)
      return NextResponse.json({
        success: true,
        data: dtcCodes
      })
    }
    
    // Ambil DTC berdasarkan sistem
    const dtcCodes = await dtcLibraryService.getDTCCodesBySystem(system || undefined)
    
    return NextResponse.json({
      success: true,
      data: dtcCodes
    })
  } catch (error) {
    console.error('Error fetching DTC library:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data DTC library' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'seed') {
      await dtcLibraryService.seedDTCCodes()
      return NextResponse.json({
        success: true,
        message: 'DTC codes berhasil di-seed ke database'
      })
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Action tidak valid' 
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error seeding DTC codes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal seed DTC codes' 
      },
      { status: 500 }
    )
  }
}