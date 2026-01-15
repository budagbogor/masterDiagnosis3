// Script untuk mengupload data DTC komprehensif ke Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Baca data DTC dari file yang baru dibuat
const dtcDataPath = 'src/lib/comprehensive-dtc-data.ts';
const dtcContent = fs.readFileSync(dtcDataPath, 'utf8');

// Extract data array dari file TypeScript
const arrayMatch = dtcContent.match(/export const COMPREHENSIVE_DTC_DATA: DTCDataItem\[\] = (\[[\s\S]*?\])/);
if (!arrayMatch) {
  console.error('❌ Tidak dapat menemukan array COMPREHENSIVE_DTC_DATA');
  process.exit(1);
}

let dtcData;
try {
  // Parse JSON data
  dtcData = JSON.parse(arrayMatch[1]);
} catch (error) {
  console.error('❌ Error parsing DTC data:', error);
  process.exit(1);
}

// Konfigurasi Supabase
// Konfigurasi Supabase
require('dotenv').config(); // Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDTCCodes() {
  try {
    console.log('🚀 Memulai upload data DTC ke Supabase...');
    console.log(`📊 Total kode DTC: ${dtcData.length}`);

    // Transform data untuk Supabase
    const dtcCodesForSupabase = dtcData.map(dtc => ({
      code: dtc.code,
      system: dtc.system,
      subsystem: dtc.subsystem || null,
      description: dtc.descriptionIndonesian,
      severity: dtc.severity,
      possible_causes: dtc.possibleCauses,
      symptoms: dtc.symptoms,
      diagnostic_steps: dtc.diagnosticSteps,
      repair_procedures: dtc.repairProcedures,
      related_sensors: dtc.relatedSensors,
      related_actuators: dtc.relatedActuators,
      applicable_vehicles: dtc.applicableVehicles
    }));

    // Hapus data lama terlebih dahulu
    console.log('🗑️ Menghapus data DTC lama...');
    const { error: deleteError } = await supabase
      .from('dtc_codes')
      .delete()
      .neq('code', ''); // Delete all records

    if (deleteError) {
      console.warn('⚠️ Warning saat menghapus data lama:', deleteError.message);
    }

    // Upload data dalam batch untuk menghindari timeout
    const batchSize = 100;
    let uploadedCount = 0;

    for (let i = 0; i < dtcCodesForSupabase.length; i += batchSize) {
      const batch = dtcCodesForSupabase.slice(i, i + batchSize);

      console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dtcCodesForSupabase.length / batchSize)} (${batch.length} records)...`);

      const { error } = await supabase
        .from('dtc_codes')
        .upsert(batch, { onConflict: 'code' });

      if (error) {
        console.error(`❌ Error uploading batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }

      uploadedCount += batch.length;
      console.log(`✅ Uploaded ${uploadedCount}/${dtcCodesForSupabase.length} records`);

      // Delay kecil untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Berhasil upload semua data DTC ke Supabase!');

    // Verifikasi data
    const { data: verifyData, error: verifyError } = await supabase
      .from('dtc_codes')
      .select('code, system, severity')
      .limit(10);

    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
    } else {
      console.log('🔍 Sample data yang berhasil diupload:');
      verifyData.forEach(item => {
        console.log(`  - ${item.code} (${item.system}) - ${item.severity}`);
      });
    }

    // Statistik
    const { data: statsData, error: statsError } = await supabase
      .from('dtc_codes')
      .select('system, severity');

    if (!statsError && statsData) {
      const systemStats = {};
      const severityStats = {};

      statsData.forEach(item => {
        systemStats[item.system] = (systemStats[item.system] || 0) + 1;
        severityStats[item.severity] = (severityStats[item.severity] || 0) + 1;
      });

      console.log('\n📊 Statistik data DTC di Supabase:');
      console.log('Berdasarkan sistem:');
      Object.entries(systemStats).forEach(([system, count]) => {
        console.log(`  ${system}: ${count} kode`);
      });

      console.log('Berdasarkan severity:');
      Object.entries(severityStats).forEach(([severity, count]) => {
        console.log(`  ${severity}: ${count} kode`);
      });
    }

  } catch (error) {
    console.error('❌ Error dalam proses seed:', error);
    process.exit(1);
  }
}

// Jalankan script
seedDTCCodes();