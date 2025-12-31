import { NextRequest, NextResponse } from 'next/server'
import { SupabaseMigration } from '@/lib/supabase-migration'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const migration = new SupabaseMigration()
    
    switch (action) {
      case 'test':
        const isConnected = await migration.testConnection()
        return NextResponse.json({ 
          success: isConnected, 
          message: isConnected ? 'Koneksi Supabase berhasil' : 'Koneksi Supabase gagal' 
        })
        
      case 'vehicles':
        await migration.migrateVehicles()
        return NextResponse.json({ 
          success: true, 
          message: 'Migrasi vehicles berhasil' 
        })
        
      case 'dtc':
        await migration.migrateDTCCodes()
        return NextResponse.json({ 
          success: true, 
          message: 'Migrasi DTC codes berhasil' 
        })
        
      case 'diagnosis':
        await migration.migrateDiagnosisSessions()
        return NextResponse.json({ 
          success: true, 
          message: 'Migrasi diagnosis sessions berhasil' 
        })
        
      case 'all':
        await migration.migrateAll()
        return NextResponse.json({ 
          success: true, 
          message: 'Migrasi lengkap berhasil' 
        })
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Action tidak valid' 
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}