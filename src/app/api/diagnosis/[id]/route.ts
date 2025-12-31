import { NextRequest, NextResponse } from 'next/server'
import { diagnosisService } from '@/lib/diagnosis-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnosis = await diagnosisService.getDiagnosis(params.id)

    if (!diagnosis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Diagnosis tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: diagnosis
    })
  } catch (error) {
    console.error('Error fetching diagnosis:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data diagnosis' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Update menggunakan service (bisa ditambahkan method update di service)
    // Untuk sementara gunakan response sederhana
    return NextResponse.json({
      success: true,
      message: 'Update diagnosis belum diimplementasi'
    })
  } catch (error) {
    console.error('Error updating diagnosis:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengupdate diagnosis' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await diagnosisService.deleteDiagnosis(params.id)

    return NextResponse.json({
      success: true,
      message: 'Diagnosis berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting diagnosis:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menghapus diagnosis' 
      },
      { status: 500 }
    )
  }
}