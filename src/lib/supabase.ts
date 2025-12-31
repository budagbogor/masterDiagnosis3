import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client dengan service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types untuk TypeScript
export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          engine_code: string | null
          fuel_type: string
          transmission: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: number
          engine_code?: string | null
          fuel_type: string
          transmission: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: number
          engine_code?: string | null
          fuel_type?: string
          transmission?: string
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
          possible_causes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description: string
          system: string
          severity: string
          possible_causes: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string
          system?: string
          severity?: string
          possible_causes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      diagnosis_sessions: {
        Row: {
          id: string
          vehicle_id: string
          symptoms: string[]
          dtc_codes: string[]
          ai_analysis: any
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          symptoms: string[]
          dtc_codes: string[]
          ai_analysis?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          symptoms?: string[]
          dtc_codes?: string[]
          ai_analysis?: any
          status?: string
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