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
      
      // Cek apakah vehicle sudah ada di Supabase, jika tidak buat baru
      let vehicleId = null
      
      const { data: existingVehicle } = await supabaseAdmin
        .from('vehicles')
        .select('id')
        .eq('brand', diagnosisData.vehicle.brand)
        .eq('model', diagnosisData.vehicle.model)
        .eq('year', parseInt(diagnosisData.vehicle.year))
        .single()
      
      if (existingVehicle) {
        vehicleId = existingVehicle.id
      } else {
        // Buat vehicle baru
        const { data: newVehicle, error: vehicleError } = await supabaseAdmin
          .from('vehicles')
          .insert({
            brand: diagnosisData.vehicle.brand,
            model: diagnosisData.vehicle.model,
            year: parseInt(diagnosisData.vehicle.year),
            engine_code: diagnosisData.vehicle.engineCode,
            fuel_type: 'Bensin', // Default
            transmission: diagnosisData.vehicle.transmission
          })
          .select('id')
          .single()
        
        if (vehicleError) {
          console.error('Error creating vehicle:', vehicleError)
          // Jika gagal buat vehicle, lanjut tanpa vehicle_id
        } else {
          vehicleId = newVehicle.id
        }
      }
      
      // Simpan diagnosis session
      const diagnosisSession = {
        id: diagnosisId || crypto.randomUUID(),
        vehicle_id: vehicleId,
        symptoms: [
          ...diagnosisData.symptoms.sounds || [],
          ...diagnosisData.symptoms.vibrations || [],
          ...diagnosisData.symptoms.smells || [],
          ...diagnosisData.symptoms.warningLights || [],
          ...diagnosisData.symptoms.conditions || [],
          diagnosisData.symptoms.complaint
        ].filter(Boolean),
        dtc_codes: diagnosisData.dtcCodes || [],
        ai_analysis: diagnosisData.aiAnalysis || null,
        status: diagnosisData.status || 'ANALYZING'
      }
      
      const { data, error } = await supabaseAdmin
        .from('diagnosis_sessions')
        .upsert(diagnosisSession, { onConflict: 'id' })
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
          .from('diagnosis_sessions')
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
          .from('diagnosis_sessions')
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