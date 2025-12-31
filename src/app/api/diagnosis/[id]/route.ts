import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: params.id },
      include: {
        reports: true
      }
    })

    if (!diagnosis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Diagnosis tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const result = {
      ...diagnosis,
      sounds: JSON.parse(diagnosis.sounds || '[]'),
      vibrations: JSON.parse(diagnosis.vibrations || '[]'),
      smells: JSON.parse(diagnosis.smells || '[]'),
      warningLights: JSON.parse(diagnosis.warningLights || '[]'),
      conditions: JSON.parse(diagnosis.conditions || '[]'),
      partsReplaced: JSON.parse(diagnosis.partsReplaced || '[]'),
      modifications: JSON.parse(diagnosis.modifications || '[]'),
      errorCodes: JSON.parse(diagnosis.errorCodes || '[]'),
      aiAnalysis: diagnosis.aiAnalysis ? JSON.parse(diagnosis.aiAnalysis) : null,
      estimatedCost: diagnosis.estimatedCost ? JSON.parse(diagnosis.estimatedCost) : null,
      deepDiveData: diagnosis.deepDiveData ? JSON.parse(diagnosis.deepDiveData) : null
    }

    return NextResponse.json({
      success: true,
      data: result
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
    
    const diagnosis = await prisma.diagnosis.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: diagnosis
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
    await prisma.diagnosis.delete({
      where: { id: params.id }
    })

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