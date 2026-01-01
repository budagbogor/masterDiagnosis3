import { supabaseAdmin } from './supabase'
import { ALL_DTC_DATA } from './dtc-data'
import { COMPREHENSIVE_DTC_DATA } from './comprehensive-dtc-data'

export interface DTCCode {
  id: string
  code: string
  system: string
  subsystem?: string
  description: string
  descriptionIndonesian: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  symptoms: string[]
  possibleCauses: string[]
  diagnosticSteps: string[]
  repairProcedures: string[]
  relatedSensors: string[]
  relatedActuators: string[]
  applicableVehicles?: string[]
  createdAt: string
  updatedAt: string
}

export interface DTCSystem {
  code: string
  name: string
  nameIndonesian: string
  description: string
  color: string
  icon: string
}

export class DTCLibraryService {
  
  // Sistem DTC berdasarkan standar OBD-II
  static readonly SYSTEMS: DTCSystem[] = [
    {
      code: 'P0',
      name: 'Powertrain - Generic',
      nameIndonesian: 'Sistem Penggerak - Umum',
      description: 'Engine, transmission, and emission control systems',
      color: 'bg-red-100 text-red-800',
      icon: '⚙️'
    },
    {
      code: 'P1',
      name: 'Powertrain - Manufacturer',
      nameIndonesian: 'Sistem Penggerak - Pabrikan',
      description: 'Manufacturer specific powertrain codes',
      color: 'bg-orange-100 text-orange-800',
      icon: '🏭'
    },
    {
      code: 'B0',
      name: 'Body - Generic',
      nameIndonesian: 'Sistem Bodi - Umum',
      description: 'Body control systems, airbags, seatbelts',
      color: 'bg-blue-100 text-blue-800',
      icon: '🚗'
    },
    {
      code: 'B1',
      name: 'Body - Manufacturer',
      nameIndonesian: 'Sistem Bodi - Pabrikan',
      description: 'Manufacturer specific body codes',
      color: 'bg-indigo-100 text-indigo-800',
      icon: '🔧'
    },
    {
      code: 'C0',
      name: 'Chassis - Generic',
      nameIndonesian: 'Sistem Sasis - Umum',
      description: 'ABS, traction control, suspension systems',
      color: 'bg-green-100 text-green-800',
      icon: '🛞'
    },
    {
      code: 'C1',
      name: 'Chassis - Manufacturer',
      nameIndonesian: 'Sistem Sasis - Pabrikan',
      description: 'Manufacturer specific chassis codes',
      color: 'bg-emerald-100 text-emerald-800',
      icon: '⚡'
    },
    {
      code: 'U0',
      name: 'Network - Generic',
      nameIndonesian: 'Sistem Jaringan - Umum',
      description: 'Communication network and module codes',
      color: 'bg-purple-100 text-purple-800',
      icon: '📡'
    },
    {
      code: 'U1',
      name: 'Network - Manufacturer',
      nameIndonesian: 'Sistem Jaringan - Pabrikan',
      description: 'Manufacturer specific network codes',
      color: 'bg-violet-100 text-violet-800',
      icon: '🔗'
    }
  ]

  // Menggunakan data DTC lengkap dari comprehensive-dtc-data.ts (2000+ kode)
  static readonly DTC_CODES: Omit<DTCCode, 'id' | 'createdAt' | 'updatedAt'>[] = [
    ...ALL_DTC_DATA.map(dtc => ({
      code: dtc.code,
      system: dtc.system,
      subsystem: dtc.subsystem,
      description: dtc.description,
      descriptionIndonesian: dtc.descriptionIndonesian,
      severity: dtc.severity,
      symptoms: dtc.symptoms,
      possibleCauses: dtc.possibleCauses,
      diagnosticSteps: dtc.diagnosticSteps,
      repairProcedures: dtc.repairProcedures,
      relatedSensors: dtc.relatedSensors,
      relatedActuators: dtc.relatedActuators,
      applicableVehicles: dtc.applicableVehicles
    })),
    ...COMPREHENSIVE_DTC_DATA.map(dtc => ({
      code: dtc.code,
      system: dtc.system,
      subsystem: dtc.subsystem,
      description: dtc.description,
      descriptionIndonesian: dtc.descriptionIndonesian,
      severity: dtc.severity,
      symptoms: dtc.symptoms,
      possibleCauses: dtc.possibleCauses,
      diagnosticSteps: dtc.diagnosticSteps,
      repairProcedures: dtc.repairProcedures,
      relatedSensors: dtc.relatedSensors,
      relatedActuators: dtc.relatedActuators,
      applicableVehicles: dtc.applicableVehicles
    }))
  ]

  // Simpan semua DTC codes ke Supabase
  async seedDTCCodes(): Promise<void> {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase not configured, skipping DTC seed')
        return
      }

      console.log('🔧 Memulai seed DTC codes ke Supabase...')

      // Transform data untuk Supabase dengan pengecekan kolom yang ada
      const dtcCodesForSupabase = DTCLibraryService.DTC_CODES.map(dtc => ({
        code: dtc.code,
        system: dtc.system,
        subsystem: dtc.subsystem || null,
        description: dtc.descriptionIndonesian,
        severity: dtc.severity,
        possible_causes: dtc.possibleCauses || [],
        symptoms: dtc.symptoms || [],
        diagnostic_steps: dtc.diagnosticSteps || [],
        repair_procedures: dtc.repairProcedures || [],
        related_sensors: dtc.relatedSensors || [],
        related_actuators: dtc.relatedActuators || [],
        applicable_vehicles: dtc.applicableVehicles || []
      }))

      // Insert ke Supabase dengan batch untuk menghindari timeout
      const batchSize = 50
      let insertedCount = 0

      for (let i = 0; i < dtcCodesForSupabase.length; i += batchSize) {
        const batch = dtcCodesForSupabase.slice(i, i + batchSize)
        
        const { error } = await supabaseAdmin
          .from('dtc_codes')
          .upsert(batch, { onConflict: 'code' })

        if (error) {
          console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
          // Continue dengan batch berikutnya jika ada error
          continue
        }

        insertedCount += batch.length
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(dtcCodesForSupabase.length/batchSize)}`)
      }

      console.log(`✅ Berhasil seed ${insertedCount} DTC codes ke Supabase`)
    } catch (error) {
      console.error('❌ Error dalam seed DTC codes:', error)
      throw error
    }
  }

  // Ambil DTC codes berdasarkan sistem
  async getDTCCodesBySystem(system?: string): Promise<DTCCode[]> {
    try {
      if (!supabaseAdmin) {
        // Fallback ke data lokal jika Supabase tidak tersedia
        return DTCLibraryService.DTC_CODES
          .filter(dtc => !system || dtc.system === system)
          .map(dtc => ({
            ...dtc,
            id: dtc.code,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
      }

      let query = supabaseAdmin.from('dtc_codes').select('*')
      
      if (system) {
        query = query.eq('system', system)
      }

      const { data, error } = await query.order('code')

      if (error) {
        console.error('Error fetching DTC codes:', error)
        // Fallback ke data lokal
        return DTCLibraryService.DTC_CODES
          .filter(dtc => !system || dtc.system === system)
          .map(dtc => ({
            ...dtc,
            id: dtc.code,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
      }

      // Transform data dari Supabase ke format DTCCode
      return (data || []).map(item => ({
        id: item.id,
        code: item.code,
        system: item.system,
        subsystem: item.subsystem || '',
        description: item.description,
        descriptionIndonesian: item.description,
        severity: item.severity,
        symptoms: item.symptoms || [],
        possibleCauses: item.possible_causes || [],
        diagnosticSteps: item.diagnostic_steps || [],
        repairProcedures: item.repair_procedures || [],
        relatedSensors: item.related_sensors || [],
        relatedActuators: item.related_actuators || [],
        applicableVehicles: item.applicable_vehicles || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))
    } catch (error) {
      console.error('Error getting DTC codes:', error)
      // Fallback ke data lokal
      return DTCLibraryService.DTC_CODES
        .filter(dtc => !system || dtc.system === system)
        .map(dtc => ({
          ...dtc,
          id: dtc.code,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
    }
  }

  // Cari DTC berdasarkan kode atau teks
  async searchDTCCodes(searchTerm: string): Promise<DTCCode[]> {
    try {
      const allCodes = await this.getDTCCodesBySystem()
      const term = searchTerm.toLowerCase()
      
      return allCodes.filter(dtc => 
        dtc.code.toLowerCase().includes(term) ||
        dtc.description.toLowerCase().includes(term) ||
        dtc.descriptionIndonesian.toLowerCase().includes(term) ||
        dtc.symptoms.some(symptom => symptom.toLowerCase().includes(term)) ||
        dtc.possibleCauses.some(cause => cause.toLowerCase().includes(term))
      )
    } catch (error) {
      console.error('Error searching DTC codes:', error)
      throw error
    }
  }

  // Cari DTC berdasarkan kode spesifik
  async searchDTCCode(code: string): Promise<DTCCode | null> {
    try {
      const allCodes = await this.getDTCCodesBySystem()
      return allCodes.find(dtc => dtc.code.toLowerCase() === code.toLowerCase()) || null
    } catch (error) {
      console.error('Error searching DTC code:', error)
      throw error
    }
  }

  // Ambil statistik DTC
  async getDTCStatistics(): Promise<{ [system: string]: number }> {
    try {
      const allCodes = await this.getDTCCodesBySystem()
      const stats: { [system: string]: number } = {}
      
      DTCLibraryService.SYSTEMS.forEach(system => {
        stats[system.code] = allCodes.filter(dtc => dtc.system === system.code).length
      })
      
      return stats
    } catch (error) {
      console.error('Error getting DTC statistics:', error)
      throw error
    }
  }
}

export const dtcLibraryService = new DTCLibraryService()