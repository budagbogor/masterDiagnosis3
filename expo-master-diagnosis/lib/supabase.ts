import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase menggunakan MCP
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tlyiqancvcqiaawlkzah.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_LFsYetkOENQEI0BVkGIjRA_uHgnpe5S';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types untuk database
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine_code: string;
  engine_type: string;
  fuel_type: string;
  created_at: string;
  updated_at: string;
}

export interface DTCCode {
  id: string;
  code: string;
  system: string;
  subsystem?: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  possible_causes: string[];
  symptoms: string[];
  diagnostic_steps: string[];
  repair_procedures: string[];
  related_sensors: string[];
  related_actuators: string[];
  applicable_vehicles: string[];
  created_at: string;
  updated_at: string;
}

export interface DiagnosisSession {
  id: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  symptoms: string;
  dtc_codes: string[];
  diagnosis_result: string;
  recommendations: string[];
  confidence_score: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
  updated_at: string;
}

// Service functions
export class SupabaseService {
  // Vehicle operations
  static async getVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return { success: false, error };
    }
  }

  static async getVehiclesByBrand(brand: string) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('brand', brand)
        .order('model', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching vehicles by brand:', error);
      return { success: false, error };
    }
  }

  // DTC operations
  static async getDTCCodes(system?: string) {
    try {
      let query = supabase
        .from('dtc_codes')
        .select('*')
        .order('code', { ascending: true });
      
      if (system && system !== 'all') {
        query = query.eq('system', system);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching DTC codes:', error);
      return { success: false, error };
    }
  }

  static async searchDTCCodes(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('dtc_codes')
        .select('*')
        .or(`code.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('code', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error searching DTC codes:', error);
      return { success: false, error };
    }
  }

  static async getDTCByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from('dtc_codes')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching DTC by code:', error);
      return { success: false, error };
    }
  }

  // Diagnosis operations
  static async saveDiagnosis(diagnosis: Omit<DiagnosisSession, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .insert([diagnosis])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      return { success: false, error };
    }
  }

  static async getDiagnosisHistory() {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching diagnosis history:', error);
      return { success: false, error };
    }
  }

  static async deleteDiagnosis(id: string) {
    try {
      const { error } = await supabase
        .from('diagnosis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      return { success: false, error };
    }
  }

  // AI Mock service dengan fallback
  static async performAIDiagnosis(
    vehicleBrand: string,
    vehicleModel: string,
    vehicleYear: number,
    symptoms: string,
    dtcCodes: string[]
  ) {
    try {
      // Simulasi AI diagnosis dengan mock data
      // Dalam implementasi nyata, ini akan memanggil API AI
      
      const mockDiagnosis = {
        diagnosis_result: `Berdasarkan gejala "${symptoms}" dan kode DTC ${dtcCodes.join(', ')}, kemungkinan masalah pada sistem ${dtcCodes.length > 0 ? 'engine management' : 'mekanis'}. Diperlukan pemeriksaan lebih lanjut untuk memastikan diagnosis.`,
        recommendations: [
          'Lakukan scan ulang dengan scanner OBD-II',
          'Periksa kondisi komponen terkait',
          'Test drive untuk konfirmasi gejala',
          'Konsultasi dengan teknisi berpengalaman'
        ],
        confidence_score: Math.floor(Math.random() * 30) + 70, // 70-100%
        severity: dtcCodes.length > 0 ? 'HIGH' : 'MEDIUM' as 'HIGH' | 'MEDIUM'
      };

      // Simulasi delay API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, data: mockDiagnosis };
    } catch (error) {
      console.error('Error performing AI diagnosis:', error);
      
      // Fallback diagnosis jika AI tidak tersedia
      return {
        success: true,
        data: {
          diagnosis_result: 'Koneksi ke AI terputus. Menggunakan diagnosis dasar berdasarkan gejala yang dilaporkan.',
          recommendations: [
            'Periksa manual kendaraan untuk troubleshooting',
            'Konsultasi dengan bengkel resmi',
            'Lakukan pemeriksaan visual komponen',
            'Coba diagnosis ulang setelah koneksi stabil'
          ],
          confidence_score: 50,
          severity: 'MEDIUM' as 'MEDIUM',
          isOffline: true
        }
      };
    }
  }

  // Statistics
  static async getDatabaseStats() {
    try {
      const [vehiclesResult, dtcResult, diagnosisResult] = await Promise.all([
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('dtc_codes').select('*', { count: 'exact', head: true }),
        supabase.from('diagnosis').select('*', { count: 'exact', head: true })
      ]);

      return {
        success: true,
        data: {
          vehicles: vehiclesResult.count || 0,
          dtcCodes: dtcResult.count || 0,
          diagnoses: diagnosisResult.count || 0
        }
      };
    } catch (error) {
      console.error('Error fetching database stats:', error);
      return { success: false, error };
    }
  }
}

// Connection status checker
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
};