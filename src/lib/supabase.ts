import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if keys are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key-here'

export const supabase = isSupabaseConfigured ? 
  createClient(supabaseUrl, supabaseAnonKey) : null

// Server-side client dengan service role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const isServiceRoleConfigured = serviceRoleKey && 
  serviceRoleKey !== 'your-supabase-service-role-key-here'

export const supabaseAdmin = isSupabaseConfigured && isServiceRoleConfigured ?
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  ) : null

// Database types untuk TypeScript
export type Database = {
  public: {
    Tables: {
      engines: {
        Row: {
          id: string
          code: string
          brand: string
          displacement: number
          cylinders: number
          fuel: string
          aspiration: string
          power: number | null
          torque: number | null
          common_vehicles: any
          common_issues: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          brand: string
          displacement: number
          cylinders: number
          fuel: string
          aspiration: string
          power?: number | null
          torque?: number | null
          common_vehicles?: any
          common_issues?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          brand?: string
          displacement?: number
          cylinders?: number
          fuel?: string
          aspiration?: string
          power?: number | null
          torque?: number | null
          common_vehicles?: any
          common_issues?: any
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          brand: string
          model: string
          variant: string
          years: string
          type: string
          segment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          variant: string
          years: string
          type: string
          segment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          variant?: string
          years?: string
          type?: string
          segment?: string
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_engine_relationships: {
        Row: {
          id: string
          vehicle_brand: string
          vehicle_model: string
          engine_code: string
          transmissions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_brand: string
          vehicle_model: string
          engine_code: string
          transmissions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_brand?: string
          vehicle_model?: string
          engine_code?: string
          transmissions?: any
          created_at?: string
          updated_at?: string
        }
      }
      dtc_codes: {
        Row: {
          id: string
          code: string
          description: string
          system: string
          severity: string
          possible_causes: any
          diagnostic_steps: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description: string
          system: string
          severity: string
          possible_causes?: any
          diagnostic_steps?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string
          system?: string
          severity?: string
          possible_causes?: any
          diagnostic_steps?: any
          created_at?: string
          updated_at?: string
        }
      }
      diagnosis: {
        Row: {
          id: string
          brand: string
          model: string
          year: string
          engine_code: string | null
          transmission: string | null
          mileage: number
          vin: string | null
          complaint: string
          sounds: any
          vibrations: any
          smells: any
          warning_lights: any
          conditions: any
          additional_notes: string | null
          error_codes: any
          last_service_date: string | null
          parts_replaced: any
          modifications: any
          visual_inspection: string | null
          test_drive_notes: string | null
          ai_analysis: any | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: string
          engine_code?: string | null
          transmission?: string | null
          mileage: number
          vin?: string | null
          complaint: string
          sounds?: any
          vibrations?: any
          smells?: any
          warning_lights?: any
          conditions?: any
          additional_notes?: string | null
          error_codes?: any
          last_service_date?: string | null
          parts_replaced?: any
          modifications?: any
          visual_inspection?: string | null
          test_drive_notes?: string | null
          ai_analysis?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: string
          engine_code?: string | null
          transmission?: string | null
          mileage?: number
          vin?: string | null
          complaint?: string
          sounds?: any
          vibrations?: any
          smells?: any
          warning_lights?: any
          conditions?: any
          additional_notes?: string | null
          error_codes?: any
          last_service_date?: string | null
          parts_replaced?: any
          modifications?: any
          visual_inspection?: string | null
          test_drive_notes?: string | null
          ai_analysis?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          diagnosis_id: string
          report_number: string
          customer_info: any
          technician_info: any
          report_data: any
          template_used: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          diagnosis_id: string
          report_number: string
          customer_info?: any
          technician_info?: any
          report_data: any
          template_used?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          diagnosis_id?: string
          report_number?: string
          customer_info?: any
          technician_info?: any
          report_data?: any
          template_used?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}