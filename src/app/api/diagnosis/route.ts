import { NextRequest, NextResponse } from 'next/server'
import { aiMasterTechnician, DiagnosisData } from '@/lib/openai'
import { diagnosisService } from '@/lib/diagnosis-service'

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
    const diagnosisId = await diagnosisService.saveToPrisma(body)
    
    // Simpan juga ke Supabase
    try {
      await diagnosisService.saveToSupabase(body, diagnosisId)
    } catch (supabaseError) {
      console.warn('Failed to save to Supabase, continuing with local database:', supabaseError)
    }

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
      await diagnosisService.updateAIAnalysis(diagnosisId, aiResult, aiResult.confidence)

      return NextResponse.json({
        success: true,
        data: {
          id: diagnosisId,
          status: 'COMPLETED',
          aiAnalysis: aiResult
        }
      })

    } catch (aiError) {
      console.error('AI Analysis Error:', aiError)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal menganalisa dengan AI',
          diagnosisId: diagnosisId
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

    const result = await diagnosisService.getDiagnosesList({
      userId: userId || undefined,
      status: status || undefined,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      data: result.diagnoses,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: offset + limit < result.total
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