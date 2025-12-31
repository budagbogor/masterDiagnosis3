import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { aiMasterTechnician, DiagnosisData } from '@/lib/openai'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validasi data input
    if (!body.vehicle || !body.symptoms) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data kendaraan dan gejala diperlukan' 
        },
        { status: 400 }
      )
    }

    // Simpan diagnosis ke database dengan status ANALYZING
    const diagnosis = await prisma.diagnosis.create({
      data: {
        brand: body.vehicle.brand,
        model: body.vehicle.model,
        year: body.vehicle.year,
        engineCode: body.vehicle.engineCode,
        transmission: body.vehicle.transmission,
        mileage: body.vehicle.mileage,
        vin: body.vehicle.vin,
        complaint: body.symptoms.complaint,
        sounds: JSON.stringify(body.symptoms.sounds || []),
        vibrations: JSON.stringify(body.symptoms.vibrations || []),
        smells: JSON.stringify(body.symptoms.smells || []),
        warningLights: JSON.stringify(body.symptoms.warningLights || []),
        conditions: JSON.stringify(body.symptoms.conditions || []),
        additionalNotes: body.symptoms.additionalNotes,
        lastServiceDate: body.serviceHistory?.lastServiceDate,
        partsReplaced: JSON.stringify(body.serviceHistory?.partsReplaced || []),
        modifications: JSON.stringify(body.serviceHistory?.modifications || []),
        errorCodes: JSON.stringify(body.dtcCodes || []),
        visualInspection: body.testResults?.visualInspection,
        testDriveNotes: body.testResults?.testDriveNotes,
        status: 'ANALYZING'
      }
    })

    // Proses analisa dengan AI
    try {
      const diagnosisData: DiagnosisData = {
        vehicle: body.vehicle,
        symptoms: body.symptoms,
        dtcCodes: body.dtcCodes || [],
        serviceHistory: body.serviceHistory || {},
        testResults: body.testResults
      }

      const aiResult = await aiMasterTechnician.analyzeDiagnosis(diagnosisData)

      // Update diagnosis dengan hasil AI
      const updatedDiagnosis = await prisma.diagnosis.update({
        where: { id: diagnosis.id },
        data: {
          aiAnalysis: JSON.stringify(aiResult),
          aiConfidence: aiResult.confidence,
          estimatedCost: JSON.stringify(aiResult.estimatedTotalCost),
          status: 'COMPLETED'
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: updatedDiagnosis.id,
          status: updatedDiagnosis.status,
          aiAnalysis: aiResult
        }
      })

    } catch (aiError) {
      console.error('AI Analysis Error:', aiError)
      
      // Update status ke ERROR
      await prisma.diagnosis.update({
        where: { id: diagnosis.id },
        data: {
          status: 'ERROR'
        }
      })

      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal menganalisa dengan AI',
          diagnosisId: diagnosis.id
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error creating diagnosis:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal membuat diagnosis' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (status) {
      where.status = status
    }

    const diagnoses = await prisma.diagnosis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        complaint: true,
        status: true,
        aiConfidence: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const total = await prisma.diagnosis.count({ where })

    return NextResponse.json({
      success: true,
      data: diagnoses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching diagnoses:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data diagnosis' 
      },
      { status: 500 }
    )
  }
}