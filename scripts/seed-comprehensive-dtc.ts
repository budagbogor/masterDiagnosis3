
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { COMPREHENSIVE_DTC_DATA } from '../src/lib/comprehensive-dtc-data';

// Load environment variables
dotenv.config();

// Konfigurasi Supabase
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
        console.log(`📊 Total kode DTC: ${COMPREHENSIVE_DTC_DATA.length}`);

        // Fetch existing codes to reuse IDs?
        // Since we are doing bulk insert/upsert, fetching all might be slow if large.
        // But for upsert with conflict on code, we need IDs if they are new.
        // If they exist, we should reuse ID? Or does upsert (onConflict code) preserve ID if not provided?
        // In PostgreSQL upsert (ON CONFLICT DO UPDATE), if we provide ID, it updates it. If we don't, it might complain if it's NOT NULL.
        // BUT if it's an UPDATE, and we don't provide ID, existing ID is kept.
        // The problem is for INSERT (new records), ID is required.
        // So we MUST provide ID.
        // If we provide a RANDOM ID for an EXISTING record, does it overwrite the old ID?
        // It depends on the columns in the update part.
        // PostgREST upsert updates NO columns unless specified? No, it updates ALL columns provided in payload.
        // So if we provide a NEW ID, it will try to change the ID.
        // Changing PK is allowed but risky.
        // Ideally we should NOT send ID for existing records.
        // But we can't easily know which are existing without checking.

        // Solution: Fetch ALL existing codes + IDs first.
        // COMPREHENSIVE_DTC_DATA might be large (hundreds/thousands).
        // Let's page it or just fetch all code, id.

        console.log('📥 Fetching existing DTC codes...');
        const { data: existingData, error: fetchError } = await supabase.from('DTCCode').select('id, code');
        const existingMap = new Map();
        if (existingData) {
            existingData.forEach(item => existingMap.set(item.code, item.id));
        }

        const now = new Date().toISOString();

        // Transform data untuk Supabase
        const getSystemFromCode = (code: string): string => {
            const prefix = code.charAt(0).toUpperCase();
            if (prefix === 'P') {
                // Check for transmission range (P0700-P0999)
                const num = parseInt(code.substring(1));
                if (num >= 700 && num <= 999) return 'TRANSMISSION';
                return 'ENGINE';
            }
            if (prefix === 'B') return 'BODY';
            if (prefix === 'C') return 'BRAKES'; // Chassis often brakes/suspension
            if (prefix === 'U') return 'ELECTRICAL';
            return 'ENGINE'; // Default
        };

        const dtcCodesForSupabase = COMPREHENSIVE_DTC_DATA.map(dtc => {
            const existingId = existingMap.get(dtc.code);
            return {
                id: existingId || randomUUID(), // Use existing ID or generate new
                code: dtc.code,
                system: getSystemFromCode(dtc.code),
                subsystem: dtc.subsystem || null,
                description: dtc.descriptionIndonesian,
                descriptionIndonesian: dtc.descriptionIndonesian, // Map correctly
                severity: dtc.severity,
                possibleCauses: JSON.stringify(dtc.possibleCauses), // Changed key to match schemaCamelCase
                symptoms: JSON.stringify(dtc.symptoms),
                diagnosticSteps: JSON.stringify(dtc.diagnosticSteps),
                repairProcedures: JSON.stringify(dtc.repairProcedures),
                // relatedSensors: JSON.stringify(dtc.relatedSensors), // Removed as it is relation
                applicableVehicles: JSON.stringify(dtc.applicableVehicles),
                createdAt: now, // Add timestamps, though default exists for createdAt, standard to provide
                updatedAt: now
            };
        });

        // Hapus data lama terlebih dahulu? NO, upsert is better.
        // The original script deleted everything. If we delete, we don't need to worry about IDs!
        // Deleting is cleaner for "seeding".
        // If we delete, we can just generate new IDs.

        // Let's stick to the user's original logic: "Hapus data lama..."
        // But upsert is safer for references.
        // If we delete, references (Foreign Keys) might block deletion.
        // The script tried to delete.

        // Let's use UPSERT with the correct ID map logic. It's robust.

        // Upload data dalam batch
        const batchSize = 50;
        let uploadedCount = 0;

        for (let i = 0; i < dtcCodesForSupabase.length; i += batchSize) {
            const batch = dtcCodesForSupabase.slice(i, i + batchSize);

            // Clean up fields that don't exist on the table if needed, already done in map

            console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dtcCodesForSupabase.length / batchSize)}...`);

            const { error } = await supabase
                .from('DTCCode')
                .upsert(batch, { onConflict: 'code' });

            if (error) {
                console.error(`❌ Error uploading batch:`, error);
            } else {
                uploadedCount += batch.length;
            }

            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
        }

        console.log(`✅ Uploaded ${uploadedCount}/${dtcCodesForSupabase.length} records`);

    } catch (error) {
        console.error('❌ Error dalam proses seed:', error);
        process.exit(1);
    }
}

seedDTCCodes();
