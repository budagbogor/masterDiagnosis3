import { supabaseAdmin } from './supabase'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class SupabaseMigration {
  
  // Migrasi data vehicles dari SQLite ke Supabase
  async migrateVehicles() {
    try {
      console.log('🚗 Memulai migrasi data vehicles...')
      
      // Ambil data dari SQLite
      const vehicles = await prisma.vehicle.findMany()
      
      if (vehicles.length === 0) {
        console.log('❌ Tidak ada data vehicles di SQLite')
        return
      }
      
      // Transform data untuk Supabase
      const supabaseVehicles = vehicles.map(vehicle => ({
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: parseInt(vehicle.years.split('-')[0]), // Ambil tahun pertama dari range
        engine_code: vehicle.variant || null,
        fuel_type: 'Bensin', // Default value karena tidak ada di schema
        transmission: 'Manual', // Default value karena tidak ada di schema
        created_at: vehicle.createdAt.toISOString(),
        updated_at: vehicle.updatedAt.toISOString()
      }))
      
      // Insert ke Supabase
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .upsert(supabaseVehicles, { onConflict: 'id' })
      
      if (error) {
        console.error('❌ Error migrasi vehicles:', error)
        throw error
      }
      
      console.log(`✅ Berhasil migrasi ${vehicles.length} vehicles ke Supabase`)
      return data
      
    } catch (error) {
      console.error('❌ Error dalam migrasi vehicles:', error)
      throw error
    }
  }
  
  // Migrasi data DTC codes dari SQLite ke Supabase
  async migrateDTCCodes() {
    try {
      console.log('🔧 Memulai migrasi data DTC codes...')
      
      // Ambil data dari SQLite
      const dtcCodes = await prisma.dTCCode.findMany()
      
      if (dtcCodes.length === 0) {
        console.log('❌ Tidak ada data DTC codes di SQLite')
        return
      }
      
      // Transform data untuk Supabase
      const supabaseDTCCodes = dtcCodes.map(dtc => ({
        id: dtc.id,
        code: dtc.code,
        description: dtc.descriptionIndonesian,
        system: dtc.system,
        severity: dtc.severity,
        possible_causes: JSON.parse(dtc.possibleCauses || '[]'),
        created_at: dtc.createdAt.toISOString(),
        updated_at: dtc.updatedAt.toISOString()
      }))
      
      // Insert ke Supabase
      const { data, error } = await supabaseAdmin
        .from('dtc_codes')
        .upsert(supabaseDTCCodes, { onConflict: 'id' })
      
      if (error) {
        console.error('❌ Error migrasi DTC codes:', error)
        throw error
      }
      
      console.log(`✅ Berhasil migrasi ${dtcCodes.length} DTC codes ke Supabase`)
      return data
      
    } catch (error) {
      console.error('❌ Error dalam migrasi DTC codes:', error)
      throw error
    }
  }
  
  // Migrasi data diagnosis sessions dari SQLite ke Supabase
  async migrateDiagnosisSessions() {
    try {
      console.log('📊 Memulai migrasi data diagnosis sessions...')
      
      // Ambil data dari SQLite
      const sessions = await prisma.diagnosis.findMany()
      
      if (sessions.length === 0) {
        console.log('❌ Tidak ada data diagnosis sessions di SQLite')
        return
      }
      
      // Transform data untuk Supabase
      const supabaseSessions = sessions.map(session => ({
        id: session.id,
        vehicle_id: session.vehicleId,
        symptoms: JSON.parse(session.sounds || '[]').concat(
          JSON.parse(session.vibrations || '[]'),
          JSON.parse(session.smells || '[]'),
          JSON.parse(session.warningLights || '[]'),
          JSON.parse(session.conditions || '[]')
        ),
        dtc_codes: JSON.parse(session.errorCodes || '[]'),
        ai_analysis: session.aiAnalysis ? JSON.parse(session.aiAnalysis) : null,
        status: session.status,
        created_at: session.createdAt.toISOString(),
        updated_at: session.updatedAt.toISOString()
      }))
      
      // Insert ke Supabase
      const { data, error } = await supabaseAdmin
        .from('diagnosis_sessions')
        .upsert(supabaseSessions, { onConflict: 'id' })
      
      if (error) {
        console.error('❌ Error migrasi diagnosis sessions:', error)
        throw error
      }
      
      console.log(`✅ Berhasil migrasi ${sessions.length} diagnosis sessions ke Supabase`)
      return data
      
    } catch (error) {
      console.error('❌ Error dalam migrasi diagnosis sessions:', error)
      throw error
    }
  }
  
  // Migrasi semua data
  async migrateAll() {
    try {
      console.log('🚀 Memulai migrasi lengkap ke Supabase...')
      
      await this.migrateVehicles()
      await this.migrateDTCCodes()
      await this.migrateDiagnosisSessions()
      
      console.log('🎉 Migrasi lengkap berhasil!')
      
    } catch (error) {
      console.error('❌ Error dalam migrasi lengkap:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  }
  
  // Test koneksi Supabase
  async testConnection() {
    try {
      console.log('🔍 Testing koneksi Supabase...')
      
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ Error koneksi Supabase:', error)
        return false
      }
      
      console.log('✅ Koneksi Supabase berhasil!')
      return true
      
    } catch (error) {
      console.error('❌ Error test koneksi:', error)
      return false
    }
  }
}