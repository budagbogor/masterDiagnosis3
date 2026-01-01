import { supabase, supabaseAdmin } from './supabase'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface DiagnosisResult {
  id: string
  vehicle: {
    brand: string
    model: string
    year: string
    engineCode: string
    transmission: string
    mileage: number
    vin?: string
  }
  symptoms: {
    complaint: string
    sounds: string[]
    vibrations: string[]
    smells: string[]
    warningLights: string[]
    conditions: string[]
    additionalNotes?: string
  }
  serviceHistory: {
    lastServiceDate?: string
    partsReplaced: string[]
    modifications: string[]
  }
  dtcCodes: string[]
  aiAnalysis: any
  status: string
  createdAt: string
  updatedAt: string
}

export class DiagnosisService {
  
  // Simpan diagnosis ke SQLite (Prisma)
  async saveToPrisma(diagnosisData: any): Promise<string> {
    try {
      const diagnosis = await prisma.diagnosis.create({
        data: {
          brand: diagnosisData.vehicle.brand,
          model: diagnosisData.vehicle.model,
          year: diagnosisData.vehicle.year,
          engineCode: diagnosisData.vehicle.engineCode,
          transmission: diagnosisData.vehicle.transmission,
          mileage: diagnosisData.vehicle.mileage,
          vin: diagnosisData.vehicle.vin,
          complaint: diagnosisData.symptoms.complaint,
          sounds: JSON.stringify(diagnosisData.symptoms.sounds || []),
          vibrations: JSON.stringify(diagnosisData.symptoms.vibrations || []),
          smells: JSON.stringify(diagnosisData.symptoms.smells || []),
          warningLights: JSON.stringify(diagnosisData.symptoms.warningLights || []),
          conditions: JSON.stringify(diagnosisData.symptoms.conditions || []),
          additionalNotes: diagnosisData.symptoms.additionalNotes,
          lastServiceDate: diagnosisData.serviceHistory?.lastServiceDate,
          partsReplaced: JSON.stringify(diagnosisData.serviceHistory?.partsReplaced || []),
          modifications: JSON.stringify(diagnosisData.serviceHistory?.modifications || []),
          errorCodes: JSON.stringify(diagnosisData.dtcCodes || []),
          visualInspection: diagnosisData.testResults?.visualInspection,
          testDriveNotes: diagnosisData.testResults?.testDriveNotes,
          deepDiveData: diagnosisData.deepDive ? JSON.stringify(diagnosisData.deepDive) : null,
          status: 'ANALYZING'
        }
      })
      
      return diagnosis.id
    } catch (error) {
      console.error('Error saving to Prisma:', error)
      throw error
    }
  }
  
  // Simpan diagnosis ke Supabase
  async saveToSupabase(diagnosisData: any, diagnosisId?: string): Promise<string> {
    try {
      // Cek apakah Supabase dikonfigurasi
      if (!supabaseAdmin) {
        console.warn('Supabase not configured, skipping Supabase save')
        return diagnosisId || crypto.randomUUID()
      }
      
      // Simpan langsung ke tabel diagnosis
      const diagnosisRecord = {
        id: diagnosisId || crypto.randomUUID(),
        brand: diagnosisData.vehicle.brand,
        model: diagnosisData.vehicle.model,
        year: diagnosisData.vehicle.year,
        engine_code: diagnosisData.vehicle.engineCode,
        transmission: diagnosisData.vehicle.transmission,
        mileage: diagnosisData.vehicle.mileage,
        vin: diagnosisData.vehicle.vin,
        complaint: diagnosisData.symptoms.complaint,
        sounds: diagnosisData.symptoms.sounds || [],
        vibrations: diagnosisData.symptoms.vibrations || [],
        smells: diagnosisData.symptoms.smells || [],
        warning_lights: diagnosisData.symptoms.warningLights || [],
        conditions: diagnosisData.symptoms.conditions || [],
        additional_notes: diagnosisData.symptoms.additionalNotes,
        error_codes: diagnosisData.dtcCodes || [],
        last_service_date: diagnosisData.serviceHistory?.lastServiceDate,
        parts_replaced: diagnosisData.serviceHistory?.partsReplaced || [],
        modifications: diagnosisData.serviceHistory?.modifications || [],
        visual_inspection: diagnosisData.testResults?.visualInspection,
        test_drive_notes: diagnosisData.testResults?.testDriveNotes,
        ai_analysis: diagnosisData.aiAnalysis || null,
        status: 'ANALYZING'
      }
      
      const { data, error } = await supabaseAdmin
        .from('diagnosis')
        .upsert(diagnosisRecord, { onConflict: 'id' })
        .select('id')
        .single()
      
      if (error) {
        console.error('Error saving to Supabase:', error)
        throw error
      }
      
      return data.id
    } catch (error) {
      console.error('Error saving to Supabase:', error)
      throw error
    }
  }
  
  // Update hasil AI analysis
  async updateAIAnalysis(diagnosisId: string, aiAnalysis: any, confidence: number): Promise<void> {
    try {
      // Update di Prisma
      await prisma.diagnosis.update({
        where: { id: diagnosisId },
        data: {
          aiAnalysis: JSON.stringify(aiAnalysis),
          aiConfidence: confidence,
          estimatedCost: JSON.stringify(aiAnalysis.estimatedTotalCost),
          status: 'COMPLETED'
        }
      })
      
      // Update di Supabase jika dikonfigurasi
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('diagnosis')
          .update({
            ai_analysis: aiAnalysis,
            status: 'COMPLETED'
          })
          .eq('id', diagnosisId)
      }
      
    } catch (error) {
      console.error('Error updating AI analysis:', error)
      throw error
    }
  }
  
  // Ambil diagnosis berdasarkan ID
  async getDiagnosis(diagnosisId: string): Promise<DiagnosisResult | null> {
    try {
      const diagnosis = await prisma.diagnosis.findUnique({
        where: { id: diagnosisId },
        include: {
          reports: true
        }
      })
      
      if (!diagnosis) {
        return null
      }
      
      return {
        id: diagnosis.id,
        vehicle: {
          brand: diagnosis.brand,
          model: diagnosis.model,
          year: diagnosis.year,
          engineCode: diagnosis.engineCode,
          transmission: diagnosis.transmission,
          mileage: diagnosis.mileage,
          vin: diagnosis.vin || undefined
        },
        symptoms: {
          complaint: diagnosis.complaint,
          sounds: JSON.parse(diagnosis.sounds || '[]'),
          vibrations: JSON.parse(diagnosis.vibrations || '[]'),
          smells: JSON.parse(diagnosis.smells || '[]'),
          warningLights: JSON.parse(diagnosis.warningLights || '[]'),
          conditions: JSON.parse(diagnosis.conditions || '[]'),
          additionalNotes: diagnosis.additionalNotes || undefined
        },
        serviceHistory: {
          lastServiceDate: diagnosis.lastServiceDate || undefined,
          partsReplaced: JSON.parse(diagnosis.partsReplaced || '[]'),
          modifications: JSON.parse(diagnosis.modifications || '[]')
        },
        dtcCodes: JSON.parse(diagnosis.errorCodes || '[]'),
        aiAnalysis: diagnosis.aiAnalysis ? JSON.parse(diagnosis.aiAnalysis) : null,
        status: diagnosis.status,
        createdAt: diagnosis.createdAt.toISOString(),
        updatedAt: diagnosis.updatedAt.toISOString()
      }
    } catch (error) {
      console.error('Error getting diagnosis:', error)
      throw error
    }
  }
  
  // Ambil daftar diagnosis
  async getDiagnosesList(options: {
    userId?: string
    status?: string
    limit?: number
    offset?: number
  } = {}): Promise<{ diagnoses: DiagnosisResult[], total: number }> {
    try {
      const { userId, status, limit = 10, offset = 0 } = options
      
      const where: any = {}
      
      if (userId) {
        where.userId = userId
      }
      
      if (status) {
        where.status = status
      }
      
      const [diagnoses, total] = await Promise.all([
        prisma.diagnosis.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            engineCode: true,
            transmission: true,
            mileage: true,
            vin: true,
            complaint: true,
            sounds: true,
            vibrations: true,
            smells: true,
            warningLights: true,
            conditions: true,
            additionalNotes: true,
            partsReplaced: true,
            modifications: true,
            lastServiceDate: true,
            errorCodes: true,
            aiAnalysis: true,
            aiConfidence: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.diagnosis.count({ where })
      ])
      
      const formattedDiagnoses = diagnoses.map(diagnosis => ({
        id: diagnosis.id,
        vehicle: {
          brand: diagnosis.brand,
          model: diagnosis.model,
          year: diagnosis.year,
          engineCode: diagnosis.engineCode,
          transmission: diagnosis.transmission,
          mileage: diagnosis.mileage,
          vin: diagnosis.vin || undefined
        },
        symptoms: {
          complaint: diagnosis.complaint,
          sounds: JSON.parse(diagnosis.sounds || '[]'),
          vibrations: JSON.parse(diagnosis.vibrations || '[]'),
          smells: JSON.parse(diagnosis.smells || '[]'),
          warningLights: JSON.parse(diagnosis.warningLights || '[]'),
          conditions: JSON.parse(diagnosis.conditions || '[]'),
          additionalNotes: diagnosis.additionalNotes || undefined
        },
        serviceHistory: {
          lastServiceDate: diagnosis.lastServiceDate || undefined,
          partsReplaced: JSON.parse(diagnosis.partsReplaced || '[]'),
          modifications: JSON.parse(diagnosis.modifications || '[]')
        },
        dtcCodes: JSON.parse(diagnosis.errorCodes || '[]'),
        aiAnalysis: diagnosis.aiAnalysis ? JSON.parse(diagnosis.aiAnalysis) : null,
        status: diagnosis.status,
        createdAt: diagnosis.createdAt.toISOString(),
        updatedAt: diagnosis.updatedAt.toISOString()
      }))
      
      return {
        diagnoses: formattedDiagnoses,
        total
      }
    } catch (error) {
      console.error('Error getting diagnoses list:', error)
      throw error
    }
  }
  
  // Hapus diagnosis
  async deleteDiagnosis(diagnosisId: string): Promise<void> {
    try {
      // Hapus dari Prisma
      await prisma.diagnosis.delete({
        where: { id: diagnosisId }
      })
      
      // Hapus dari Supabase jika dikonfigurasi
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('diagnosis')
          .delete()
          .eq('id', diagnosisId)
      }
      
    } catch (error) {
      console.error('Error deleting diagnosis:', error)
      throw error
    }
  }
}

export const diagnosisService = new DiagnosisService()