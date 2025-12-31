import { NextRequest, NextResponse } from 'next/server'
import { dtcLibrary } from '@/lib/dtc-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const system = searchParams.get('system')
    const severity = searchParams.get('severity')

    let dtcCodes

    if (query) {
      dtcCodes = await dtcLibrary.searchDTCs(query)
    } else if (system) {
      dtcCodes = await dtcLibrary.getDTCsBySystem(system)
    } else if (severity) {
      dtcCodes = await dtcLibrary.getDTCsBySeverity(severity)
    } else {
      // Return empty array jika tidak ada parameter
      dtcCodes = []
    }

    return NextResponse.json({
      success: true,
      data: dtcCodes,
      count: dtcCodes.length
    })
  } catch (error) {
    console.error('Error fetching DTC codes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data kode DTC' 
      },
      { status: 500 }
    )
  }
}